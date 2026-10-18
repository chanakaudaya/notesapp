use crate::error::Result;
use crate::models::*;
use crate::services::reminders;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn create_reminder(
    state: State<'_, AppState>,
    profile_id: String,
    req: CreateReminder,
) -> Result<Reminder> {
    reminders::create_reminder(&state.pool, &profile_id, req).await
}

#[tauri::command]
pub async fn list_reminders_for_note(
    state: State<'_, AppState>,
    note_id: String,
) -> Result<Vec<Reminder>> {
    reminders::list_reminders_for_note(&state.pool, &note_id).await
}

#[tauri::command]
pub async fn list_upcoming_reminders(
    state: State<'_, AppState>,
    profile_id: String,
) -> Result<Vec<Reminder>> {
    reminders::list_upcoming_reminders(&state.pool, &profile_id).await
}

#[tauri::command]
pub async fn list_due_reminders(
    state: State<'_, AppState>,
    profile_id: String,
) -> Result<Vec<Reminder>> {
    reminders::list_due_reminders(&state.pool, &profile_id).await
}

#[tauri::command]
pub async fn update_reminder(
    state: State<'_, AppState>,
    id: String,
    req: UpdateReminder,
) -> Result<Reminder> {
    reminders::update_reminder(&state.pool, &id, req).await
}

#[tauri::command]
pub async fn dismiss_reminder(state: State<'_, AppState>, id: String) -> Result<Reminder> {
    reminders::dismiss_reminder(&state.pool, &id).await
}

#[tauri::command]
pub async fn delete_reminder(state: State<'_, AppState>, id: String) -> Result<()> {
    reminders::delete_reminder(&state.pool, &id).await
}
