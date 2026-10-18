use crate::error::Result;
use crate::models::*;
use crate::services::categories;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn create_category(
    state: State<'_, AppState>,
    profile_id: String,
    req: CreateCategory,
) -> Result<Category> {
    categories::create_category(&state.pool, &profile_id, req).await
}

#[tauri::command]
pub async fn list_categories(
    state: State<'_, AppState>,
    profile_id: String,
) -> Result<Vec<Category>> {
    categories::list_categories(&state.pool, &profile_id).await
}

#[tauri::command]
pub async fn update_category(
    state: State<'_, AppState>,
    id: String,
    req: UpdateCategory,
) -> Result<Category> {
    categories::update_category(&state.pool, &id, req).await
}

#[tauri::command]
pub async fn delete_category(state: State<'_, AppState>, id: String) -> Result<()> {
    categories::delete_category(&state.pool, &id).await
}

#[tauri::command]
pub async fn create_tag(
    state: State<'_, AppState>,
    profile_id: String,
    req: CreateTag,
) -> Result<Tag> {
    categories::create_tag(&state.pool, &profile_id, req).await
}

#[tauri::command]
pub async fn list_tags(
    state: State<'_, AppState>,
    profile_id: String,
) -> Result<Vec<Tag>> {
    categories::list_tags(&state.pool, &profile_id).await
}

#[tauri::command]
pub async fn update_tag(
    state: State<'_, AppState>,
    id: String,
    req: UpdateTag,
) -> Result<Tag> {
    categories::update_tag(&state.pool, &id, req).await
}

#[tauri::command]
pub async fn delete_tag(state: State<'_, AppState>, id: String) -> Result<()> {
    categories::delete_tag(&state.pool, &id).await
}
