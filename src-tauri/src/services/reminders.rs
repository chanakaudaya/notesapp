use crate::error::{AppError, Result};
use crate::models::*;
use chrono::Utc;
use sqlx::SqlitePool;

pub async fn create_reminder(
    pool: &SqlitePool,
    profile_id: &str,
    req: CreateReminder,
) -> Result<Reminder> {
    let id = new_id();
    let now = Utc::now();
    let is_recurring = req.is_recurring.unwrap_or(false) as i64;

    sqlx::query(
        "INSERT INTO reminders (id, note_id, profile_id, remind_at, is_recurring, recurrence_rule, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(&id).bind(&req.note_id).bind(profile_id)
    .bind(req.remind_at.to_rfc3339())
    .bind(is_recurring).bind(&req.recurrence_rule)
    .bind(now.to_rfc3339()).bind(now.to_rfc3339())
    .execute(pool).await?;

    get_reminder(pool, &id).await
}

pub async fn get_reminder(pool: &SqlitePool, id: &str) -> Result<Reminder> {
    sqlx::query_as::<_, Reminder>("SELECT * FROM reminders WHERE id = ?")
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Reminder {id} not found")))
}

pub async fn list_reminders_for_note(pool: &SqlitePool, note_id: &str) -> Result<Vec<Reminder>> {
    Ok(sqlx::query_as::<_, Reminder>(
        "SELECT * FROM reminders WHERE note_id = ? ORDER BY remind_at ASC",
    )
    .bind(note_id)
    .fetch_all(pool)
    .await?)
}

pub async fn list_upcoming_reminders(
    pool: &SqlitePool,
    profile_id: &str,
) -> Result<Vec<Reminder>> {
    let now = Utc::now().to_rfc3339();
    Ok(sqlx::query_as::<_, Reminder>(
        "SELECT * FROM reminders
         WHERE profile_id = ?
           AND is_dismissed = 0
           AND (is_snoozed = 0 OR snoozed_until <= ?)
           AND remind_at >= ?
         ORDER BY remind_at ASC
         LIMIT 50",
    )
    .bind(profile_id).bind(&now).bind(&now)
    .fetch_all(pool)
    .await?)
}

pub async fn list_due_reminders(pool: &SqlitePool, profile_id: &str) -> Result<Vec<Reminder>> {
    let now = Utc::now().to_rfc3339();
    Ok(sqlx::query_as::<_, Reminder>(
        "SELECT * FROM reminders
         WHERE profile_id = ?
           AND is_dismissed = 0
           AND remind_at <= ?
           AND (is_snoozed = 0 OR snoozed_until <= ?)
         ORDER BY remind_at ASC",
    )
    .bind(profile_id).bind(&now).bind(&now)
    .fetch_all(pool)
    .await?)
}

pub async fn update_reminder(
    pool: &SqlitePool,
    id: &str,
    req: UpdateReminder,
) -> Result<Reminder> {
    let now = Utc::now().to_rfc3339();
    if let Some(t) = req.remind_at {
        sqlx::query("UPDATE reminders SET remind_at = ?, updated_at = ? WHERE id = ?")
            .bind(t.to_rfc3339()).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(v) = req.is_dismissed {
        sqlx::query("UPDATE reminders SET is_dismissed = ?, updated_at = ? WHERE id = ?")
            .bind(v as i64).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(v) = req.is_snoozed {
        sqlx::query("UPDATE reminders SET is_snoozed = ?, updated_at = ? WHERE id = ?")
            .bind(v as i64).bind(&now).bind(id).execute(pool).await?;
    }
    if let Some(t) = req.snoozed_until {
        sqlx::query("UPDATE reminders SET snoozed_until = ?, is_snoozed = 1, updated_at = ? WHERE id = ?")
            .bind(t.to_rfc3339()).bind(&now).bind(id).execute(pool).await?;
    }
    get_reminder(pool, id).await
}

pub async fn delete_reminder(pool: &SqlitePool, id: &str) -> Result<()> {
    sqlx::query("DELETE FROM reminders WHERE id = ?").bind(id).execute(pool).await?;
    Ok(())
}

pub async fn dismiss_reminder(pool: &SqlitePool, id: &str) -> Result<Reminder> {
    let now = Utc::now().to_rfc3339();
    sqlx::query(
        "UPDATE reminders SET is_dismissed = 1, is_snoozed = 0, snoozed_until = NULL, updated_at = ? WHERE id = ?",
    )
    .bind(&now).bind(id).execute(pool).await?;
    get_reminder(pool, id).await
}
