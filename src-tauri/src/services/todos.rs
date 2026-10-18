use crate::error::{AppError, Result};
use crate::models::*;
use chrono::Utc;
use sqlx::SqlitePool;

pub async fn create_todo_item(
    pool: &SqlitePool,
    note_id: &str,
    req: CreateTodoItem,
) -> Result<TodoItem> {
    let id = new_id();
    let now = Utc::now();

    // If no position given, append after the last item
    let position = if let Some(pos) = req.position {
        pos as i64
    } else {
        let max: Option<i64> =
            sqlx::query_scalar("SELECT MAX(position) FROM todo_items WHERE note_id = ?")
                .bind(note_id)
                .fetch_one(pool)
                .await?;
        max.unwrap_or(-1) + 1
    };

    sqlx::query(
        "INSERT INTO todo_items (id, note_id, text, is_completed, position, created_at, updated_at)
         VALUES (?, ?, ?, 0, ?, ?, ?)",
    )
    .bind(&id).bind(note_id).bind(&req.text).bind(position)
    .bind(now.to_rfc3339()).bind(now.to_rfc3339())
    .execute(pool).await?;

    get_todo_item(pool, &id).await
}

pub async fn get_todo_item(pool: &SqlitePool, id: &str) -> Result<TodoItem> {
    sqlx::query_as::<_, TodoItem>("SELECT * FROM todo_items WHERE id = ?")
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Todo item {id} not found")))
}

pub async fn list_todo_items(pool: &SqlitePool, note_id: &str) -> Result<Vec<TodoItem>> {
    Ok(sqlx::query_as::<_, TodoItem>(
        "SELECT * FROM todo_items WHERE note_id = ? ORDER BY position ASC, created_at ASC",
    )
    .bind(note_id)
    .fetch_all(pool)
    .await?)
}

pub async fn update_todo_item(
    pool: &SqlitePool,
    id: &str,
    req: UpdateTodoItem,
) -> Result<TodoItem> {
    let now = Utc::now().to_rfc3339();
    if let Some(text) = &req.text {
        sqlx::query("UPDATE todo_items SET text = ?, updated_at = ? WHERE id = ?")
            .bind(text).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(is_completed) = req.is_completed {
        sqlx::query("UPDATE todo_items SET is_completed = ?, updated_at = ? WHERE id = ?")
            .bind(is_completed as i64).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(pos) = req.position {
        sqlx::query("UPDATE todo_items SET position = ?, updated_at = ? WHERE id = ?")
            .bind(pos as i64).bind(&now).bind(id).execute(pool).await?;
    }
    get_todo_item(pool, id).await
}

pub async fn delete_todo_item(pool: &SqlitePool, id: &str) -> Result<()> {
    sqlx::query("DELETE FROM todo_items WHERE id = ?")
        .bind(id).execute(pool).await?;
    Ok(())
}

pub async fn reorder_todo_items(
    pool: &SqlitePool,
    note_id: &str,
    ordered_ids: Vec<String>,
) -> Result<Vec<TodoItem>> {
    let now = Utc::now().to_rfc3339();
    for (pos, item_id) in ordered_ids.iter().enumerate() {
        sqlx::query(
            "UPDATE todo_items SET position = ?, updated_at = ? WHERE id = ? AND note_id = ?",
        )
        .bind(pos as i64).bind(&now).bind(item_id).bind(note_id)
        .execute(pool).await?;
    }
    list_todo_items(pool, note_id).await
}
