use crate::error::{AppError, Result};
use crate::models::*;
use chrono::Utc;
use sqlx::SqlitePool;

// ─── Categories ──────────────────────────────────────────────────────────────

pub async fn create_category(
    pool: &SqlitePool,
    profile_id: &str,
    req: CreateCategory,
) -> Result<Category> {
    let id = new_id();
    let now = Utc::now();
    let color = req.color.unwrap_or_else(|| "#6b7280".to_string());

    sqlx::query(
        "INSERT INTO categories (id, profile_id, name, color, icon, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(profile_id)
    .bind(&req.name)
    .bind(&color)
    .bind(&req.icon)
    .bind(now.to_rfc3339())
    .bind(now.to_rfc3339())
    .execute(pool)
    .await?;

    get_category(pool, &id).await
}

pub async fn get_category(pool: &SqlitePool, id: &str) -> Result<Category> {
    sqlx::query_as::<_, Category>(
        "SELECT * FROM categories WHERE id = ? AND deleted_at IS NULL",
    )
    .bind(id)
    .fetch_optional(pool)
    .await?
    .ok_or_else(|| AppError::NotFound(format!("Category {id} not found")))
}

pub async fn list_categories(pool: &SqlitePool, profile_id: &str) -> Result<Vec<Category>> {
    Ok(sqlx::query_as::<_, Category>(
        "SELECT * FROM categories WHERE profile_id = ? AND deleted_at IS NULL ORDER BY name ASC",
    )
    .bind(profile_id)
    .fetch_all(pool)
    .await?)
}

pub async fn update_category(
    pool: &SqlitePool,
    id: &str,
    req: UpdateCategory,
) -> Result<Category> {
    let now = Utc::now().to_rfc3339();
    if let Some(name) = req.name {
        sqlx::query("UPDATE categories SET name = ?, updated_at = ? WHERE id = ?")
            .bind(&name).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(color) = req.color {
        sqlx::query("UPDATE categories SET color = ?, updated_at = ? WHERE id = ?")
            .bind(&color).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(icon) = req.icon {
        sqlx::query("UPDATE categories SET icon = ?, updated_at = ? WHERE id = ?")
            .bind(&icon).bind(&now).bind(id).execute(pool).await?;
    }
    get_category(pool, id).await
}

pub async fn delete_category(pool: &SqlitePool, id: &str) -> Result<()> {
    let now = Utc::now().to_rfc3339();
    sqlx::query("UPDATE categories SET deleted_at = ? WHERE id = ?")
        .bind(&now).bind(id).execute(pool).await?;
    // Remove category from notes
    sqlx::query("UPDATE notes SET category_id = NULL, updated_at = ? WHERE category_id = ?")
        .bind(&now).bind(id).execute(pool).await?;
    Ok(())
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

pub async fn create_tag(pool: &SqlitePool, profile_id: &str, req: CreateTag) -> Result<Tag> {
    let id = new_id();
    let now = Utc::now();
    let color = req.color.unwrap_or_else(|| "#8b5cf6".to_string());

    sqlx::query(
        "INSERT INTO tags (id, profile_id, name, color, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)",
    )
    .bind(&id).bind(profile_id).bind(&req.name).bind(&color)
    .bind(now.to_rfc3339()).bind(now.to_rfc3339())
    .execute(pool).await?;

    get_tag(pool, &id).await
}

pub async fn get_tag(pool: &SqlitePool, id: &str) -> Result<Tag> {
    sqlx::query_as::<_, Tag>("SELECT * FROM tags WHERE id = ? AND deleted_at IS NULL")
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Tag {id} not found")))
}

pub async fn list_tags(pool: &SqlitePool, profile_id: &str) -> Result<Vec<Tag>> {
    Ok(sqlx::query_as::<_, Tag>(
        "SELECT * FROM tags WHERE profile_id = ? AND deleted_at IS NULL ORDER BY name ASC",
    )
    .bind(profile_id)
    .fetch_all(pool)
    .await?)
}

pub async fn update_tag(pool: &SqlitePool, id: &str, req: UpdateTag) -> Result<Tag> {
    let now = Utc::now().to_rfc3339();
    if let Some(name) = req.name {
        sqlx::query("UPDATE tags SET name = ?, updated_at = ? WHERE id = ?")
            .bind(&name).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(color) = req.color {
        sqlx::query("UPDATE tags SET color = ?, updated_at = ? WHERE id = ?")
            .bind(&color).bind(&now).bind(id).execute(pool).await?;
    }
    get_tag(pool, id).await
}

pub async fn delete_tag(pool: &SqlitePool, id: &str) -> Result<()> {
    let now = Utc::now().to_rfc3339();
    sqlx::query("UPDATE tags SET deleted_at = ? WHERE id = ?")
        .bind(&now).bind(id).execute(pool).await?;
    sqlx::query("DELETE FROM note_tags WHERE tag_id = ?")
        .bind(id).execute(pool).await?;
    Ok(())
}
