use crate::error::Result;
use crate::models::*;
use crate::services::notes;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn create_note(
    state: State<'_, AppState>,
    profile_id: String,
    req: CreateNote,
) -> Result<NoteWithTags> {
    notes::create_note(&state.pool, &profile_id, req).await
}

#[tauri::command]
pub async fn get_note(state: State<'_, AppState>, id: String) -> Result<NoteWithTags> {
    notes::get_note_with_tags(&state.pool, &id).await
}

#[tauri::command]
pub async fn list_notes(
    state: State<'_, AppState>,
    filter: NoteFilter,
) -> Result<Vec<NoteWithTags>> {
    notes::list_notes(&state.pool, filter).await
}

#[tauri::command]
pub async fn update_note(
    state: State<'_, AppState>,
    id: String,
    req: UpdateNote,
) -> Result<NoteWithTags> {
    notes::update_note(&state.pool, &id, req).await
}

#[tauri::command]
pub async fn set_note_status(
    state: State<'_, AppState>,
    id: String,
    status: String,
) -> Result<Note> {
    notes::set_note_status(&state.pool, &id, &status).await
}

#[tauri::command]
pub async fn delete_note_permanent(state: State<'_, AppState>, id: String) -> Result<()> {
    notes::delete_note_permanent(&state.pool, &id).await
}
