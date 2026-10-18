use crate::error::{AppError, Result};
use crate::models::*;
use chrono::Utc;
use sqlx::SqlitePool;

pub async fn create_note(
    pool: &SqlitePool,
    profile_id: &str,
    req: CreateNote,
) -> Result<NoteWithTags> {
    let id = new_id();
    let now = Utc::now();
    let is_todo = req.is_todo_list.unwrap_or(false) as i64;
    let content = req.content.unwrap_or_default();

    sqlx::query(
        "INSERT INTO notes (id, profile_id, category_id, title, content, is_todo_list, color, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&id).bind(profile_id).bind(&req.category_id).bind(&req.title)
    .bind(&content).bind(is_todo).bind(&req.color)
    .bind(now.to_rfc3339()).bind(now.to_rfc3339())
    .execute(pool).await?;

    if let Some(tag_ids) = &req.tag_ids {
        for tag_id in tag_ids {
            sqlx::query("INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)")
                .bind(&id).bind(tag_id).execute(pool).await?;
        }
    }

    get_note_with_tags(pool, &id).await
}

pub async fn get_note(pool: &SqlitePool, id: &str) -> Result<Note> {
    sqlx::query_as::<_, Note>("SELECT * FROM notes WHERE id = ? AND deleted_at IS NULL")
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Note {id} not found")))
}

pub async fn get_note_with_tags(pool: &SqlitePool, id: &str) -> Result<NoteWithTags> {
    let note = get_note(pool, id).await?;
    let tags = get_tags_for_note(pool, id).await?;
    let todo_items = get_todo_items_for_note(pool, id).await?;
    Ok(NoteWithTags { note, tags, todo_items })
}

async fn get_tags_for_note(pool: &SqlitePool, note_id: &str) -> Result<Vec<Tag>> {
    Ok(sqlx::query_as::<_, Tag>(
        "SELECT t.* FROM tags t
         JOIN note_tags nt ON nt.tag_id = t.id
         WHERE nt.note_id = ? AND t.deleted_at IS NULL",
    )
    .bind(note_id)
    .fetch_all(pool)
    .await?)
}

async fn get_todo_items_for_note(pool: &SqlitePool, note_id: &str) -> Result<Vec<TodoItem>> {
    Ok(sqlx::query_as::<_, TodoItem>(
        "SELECT * FROM todo_items WHERE note_id = ? ORDER BY position ASC, created_at ASC",
    )
    .bind(note_id)
    .fetch_all(pool)
    .await?)
}

pub async fn list_notes(pool: &SqlitePool, filter: NoteFilter) -> Result<Vec<NoteWithTags>> {
    let limit = filter.limit.unwrap_or(50);
    let offset = filter.offset.unwrap_or(0);
    let status = filter.status.as_deref().unwrap_or("Active");

    // Use FTS if search query provided
    let note_ids: Vec<String> = if let Some(ref search) = filter.search {
        let query = format!("{search}*");
        sqlx::query_scalar::<_, String>(
            "SELECT n.id FROM notes n
             JOIN notes_fts fts ON fts.id = n.id
             WHERE fts MATCH ? AND n.profile_id = ? AND n.status = ? AND n.deleted_at IS NULL
             ORDER BY n.updated_at DESC LIMIT ? OFFSET ?",
        )
        .bind(&query).bind(&filter.profile_id).bind(status)
        .bind(limit).bind(offset)
        .fetch_all(pool)
        .await?
    } else if let Some(ref tag_id) = filter.tag_id {
        sqlx::query_scalar::<_, String>(
            "SELECT n.id FROM notes n
             JOIN note_tags nt ON nt.note_id = n.id
             WHERE n.profile_id = ? AND n.status = ? AND nt.tag_id = ? AND n.deleted_at IS NULL
             ORDER BY CASE n.status WHEN 'Pinned' THEN 0 ELSE 1 END, n.updated_at DESC
             LIMIT ? OFFSET ?",
        )
        .bind(&filter.profile_id).bind(status).bind(tag_id)
        .bind(limit).bind(offset)
        .fetch_all(pool)
        .await?
    } else if let Some(ref cat_id) = filter.category_id {
        sqlx::query_scalar::<_, String>(
            "SELECT id FROM notes WHERE profile_id = ? AND status = ? AND category_id = ? AND deleted_at IS NULL
             ORDER BY CASE status WHEN 'Pinned' THEN 0 ELSE 1 END, updated_at DESC
             LIMIT ? OFFSET ?",
        )
        .bind(&filter.profile_id).bind(status).bind(cat_id)
        .bind(limit).bind(offset)
        .fetch_all(pool)
        .await?
    } else {
        sqlx::query_scalar::<_, String>(
            "SELECT id FROM notes WHERE profile_id = ? AND status = ? AND deleted_at IS NULL
             ORDER BY CASE status WHEN 'Pinned' THEN 0 ELSE 1 END, updated_at DESC
             LIMIT ? OFFSET ?",
        )
        .bind(&filter.profile_id).bind(status)
        .bind(limit).bind(offset)
        .fetch_all(pool)
        .await?
    };

    let mut results = Vec::with_capacity(note_ids.len());
    for note_id in note_ids {
        if let Ok(n) = get_note_with_tags(pool, &note_id).await {
            results.push(n);
        }
    }
    Ok(results)
}

pub async fn update_note(
    pool: &SqlitePool,
    id: &str,
    req: UpdateNote,
) -> Result<NoteWithTags> {
    let now = Utc::now().to_rfc3339();
    if let Some(ref title) = req.title {
        sqlx::query("UPDATE notes SET title = ?, updated_at = ? WHERE id = ?")
            .bind(title).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(ref content) = req.content {
        sqlx::query("UPDATE notes SET content = ?, updated_at = ? WHERE id = ?")
            .bind(content).bind(&now).bind(id).execute(pool).await?;
    }
    if req.category_id.is_some() {
        sqlx::query("UPDATE notes SET category_id = ?, updated_at = ? WHERE id = ?")
            .bind(&req.category_id).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(ref color) = req.color {
        sqlx::query("UPDATE notes SET color = ?, updated_at = ? WHERE id = ?")
            .bind(color).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(ref tag_ids) = req.tag_ids {
        sqlx::query("DELETE FROM note_tags WHERE note_id = ?").bind(id).execute(pool).await?;
        for tag_id in tag_ids {
            sqlx::query("INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)")
                .bind(id).bind(tag_id).execute(pool).await?;
        }
    }
    get_note_with_tags(pool, id).await
}

pub async fn set_note_status(pool: &SqlitePool, id: &str, status: &str) -> Result<Note> {
    let now = Utc::now().to_rfc3339();
    sqlx::query("UPDATE notes SET status = ?, updated_at = ? WHERE id = ?")
        .bind(status).bind(&now).bind(id).execute(pool).await?;
    get_note(pool, id).await
}

pub async fn delete_note_permanent(pool: &SqlitePool, id: &str) -> Result<()> {
    sqlx::query("DELETE FROM notes WHERE id = ?").bind(id).execute(pool).await?;
    Ok(())
}
