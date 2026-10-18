mod commands;
mod db;
mod error;
mod models;
mod services;

use sqlx::SqlitePool;
use std::path::PathBuf;
use tauri::Manager;

pub struct AppState {
    pub pool: SqlitePool,
}

fn get_db_path(app: &tauri::App) -> PathBuf {
    let data_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app data directory");
    data_dir.join("notes.db")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let db_path = get_db_path(app);
            let app_handle = app.handle().clone();

            tauri::async_runtime::block_on(async move {
                let pool = db::create_pool(&db_path)
                    .await
                    .expect("Failed to create database pool");
                db::run_migrations(&pool)
                    .await
                    .expect("Failed to run database migrations");

                app_handle.manage(AppState { pool });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Profile commands
            commands::profiles::create_profile,
            commands::profiles::get_profile,
            commands::profiles::list_profiles,
            commands::profiles::update_profile,
            commands::profiles::delete_profile,
            // Note commands
            commands::notes::create_note,
            commands::notes::get_note,
            commands::notes::list_notes,
            commands::notes::update_note,
            commands::notes::set_note_status,
            commands::notes::delete_note_permanent,
            // Category commands
            commands::categories::create_category,
            commands::categories::list_categories,
            commands::categories::update_category,
            commands::categories::delete_category,
            // Tag commands
            commands::categories::create_tag,
            commands::categories::list_tags,
            commands::categories::update_tag,
            commands::categories::delete_tag,
            // Todo commands
            commands::todos::create_todo_item,
            commands::todos::list_todo_items,
            commands::todos::update_todo_item,
            commands::todos::delete_todo_item,
            commands::todos::reorder_todo_items,
            // Reminder commands
            commands::reminders::create_reminder,
            commands::reminders::list_reminders_for_note,
            commands::reminders::list_upcoming_reminders,
            commands::reminders::list_due_reminders,
            commands::reminders::update_reminder,
            commands::reminders::dismiss_reminder,
            commands::reminders::delete_reminder,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
