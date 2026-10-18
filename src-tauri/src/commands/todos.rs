use crate::error::Result;
use crate::models::*;
use crate::services::todos;
use crate::AppState;
use tauri::State;

#[tauri::command]
pub async fn create_todo_item(
    state: State<'_, AppState>,
    note_id: String,
    req: CreateTodoItem,
) -> Result<TodoItem> {
    todos::create_todo_item(&state.pool, &note_id, req).await
}

#[tauri::command]
pub async fn list_todo_items(
    state: State<'_, AppState>,
    note_id: String,
) -> Result<Vec<TodoItem>> {
    todos::list_todo_items(&state.pool, &note_id).await
}

#[tauri::command]
pub async fn update_todo_item(
    state: State<'_, AppState>,
    id: String,
    req: UpdateTodoItem,
) -> Result<TodoItem> {
    todos::update_todo_item(&state.pool, &id, req).await
}

#[tauri::command]
pub async fn delete_todo_item(state: State<'_, AppState>, id: String) -> Result<()> {
    todos::delete_todo_item(&state.pool, &id).await
}

#[tauri::command]
pub async fn reorder_todo_items(
    state: State<'_, AppState>,
    note_id: String,
    ordered_ids: Vec<String>,
) -> Result<Vec<TodoItem>> {
    todos::reorder_todo_items(&state.pool, &note_id, ordered_ids).await
}
