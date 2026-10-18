use crate::error::Result;
use crate::models::*;
use crate::services::profiles;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn create_profile(
    state: State<'_, AppState>,
    req: CreateProfile,
) -> Result<Profile> {
    profiles::create_profile(&state.pool, req).await
}

#[tauri::command]
pub async fn get_profile(state: State<'_, AppState>, id: String) -> Result<Profile> {
    profiles::get_profile(&state.pool, &id).await
}

#[tauri::command]
pub async fn list_profiles(state: State<'_, AppState>) -> Result<Vec<Profile>> {
    profiles::list_profiles(&state.pool).await
}

#[tauri::command]
pub async fn update_profile(
    state: State<'_, AppState>,
    id: String,
    req: UpdateProfile,
) -> Result<Profile> {
    profiles::update_profile(&state.pool, &id, req).await
}

#[tauri::command]
pub async fn delete_profile(state: State<'_, AppState>, id: String) -> Result<()> {
    profiles::delete_profile(&state.pool, &id).await
}
