use crate::error::{AppError, Result};
use crate::models::*;
use chrono::Utc;
use sqlx::SqlitePool;

pub async fn create_profile(pool: &SqlitePool, req: CreateProfile) -> Result<Profile> {
    let id = new_id();
    let now = Utc::now();
    let color = req.avatar_color.unwrap_or_else(|| "#3b82f6".to_string());

    sqlx::query(
        "INSERT INTO profiles (id, name, avatar_color, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&req.name)
    .bind(&color)
    .bind(now.to_rfc3339())
    .bind(now.to_rfc3339())
    .execute(pool)
    .await?;

    get_profile(pool, &id).await
}

pub async fn get_profile(pool: &SqlitePool, id: &str) -> Result<Profile> {
    sqlx::query_as::<_, Profile>("SELECT * FROM profiles WHERE id = ?")
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Profile {id} not found")))
}

pub async fn list_profiles(pool: &SqlitePool) -> Result<Vec<Profile>> {
    Ok(
        sqlx::query_as::<_, Profile>("SELECT * FROM profiles ORDER BY created_at ASC")
            .fetch_all(pool)
            .await?,
    )
}

pub async fn update_profile(
    pool: &SqlitePool,
    id: &str,
    req: UpdateProfile,
) -> Result<Profile> {
    let now = Utc::now().to_rfc3339();
    if let Some(name) = req.name {
        sqlx::query("UPDATE profiles SET name = ?, updated_at = ? WHERE id = ?")
            .bind(&name)
            .bind(&now)
            .bind(id)
            .execute(pool)
            .await?;
    }
    if let Some(color) = req.avatar_color {
        sqlx::query("UPDATE profiles SET avatar_color = ?, updated_at = ? WHERE id = ?")
            .bind(&color)
            .bind(&now)
            .bind(id)
            .execute(pool)
            .await?;
    }
    get_profile(pool, id).await
}

pub async fn delete_profile(pool: &SqlitePool, id: &str) -> Result<()> {
    sqlx::query("DELETE FROM profiles WHERE id = ?")
        .bind(id)
        .execute(pool)
        .await?;
    Ok(())
}
