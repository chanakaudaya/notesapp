use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// ─── Profile ─────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Profile {
    pub id: String,
    pub name: String,
    pub avatar_color: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateProfile {
    pub name: String,
    pub avatar_color: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProfile {
    pub name: Option<String>,
    pub avatar_color: Option<String>,
}

// ─── Category ────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Category {
    pub id: String,
    pub profile_id: String,
    pub name: String,
    pub color: String,
    pub icon: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateCategory {
    pub name: String,
    pub color: Option<String>,
    pub icon: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCategory {
    pub name: Option<String>,
    pub color: Option<String>,
    pub icon: Option<String>,
}

// ─── Tag ─────────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Tag {
    pub id: String,
    pub profile_id: String,
    pub name: String,
    pub color: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateTag {
    pub name: String,
    pub color: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTag {
    pub name: Option<String>,
    pub color: Option<String>,
}

// ─── Note ────────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
pub enum NoteStatus {
    Active,
    Pinned,
    Archived,
    Trashed,
}

impl std::fmt::Display for NoteStatus {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            NoteStatus::Active => write!(f, "Active"),
            NoteStatus::Pinned => write!(f, "Pinned"),
            NoteStatus::Archived => write!(f, "Archived"),
            NoteStatus::Trashed => write!(f, "Trashed"),
        }
    }
}

impl std::str::FromStr for NoteStatus {
    type Err = String;
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "Active" => Ok(NoteStatus::Active),
            "Pinned" => Ok(NoteStatus::Pinned),
            "Archived" => Ok(NoteStatus::Archived),
            "Trashed" => Ok(NoteStatus::Trashed),
            _ => Err(format!("Unknown status: {s}")),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Note {
    pub id: String,
    pub profile_id: String,
    pub category_id: Option<String>,
    pub title: String,
    pub content: String,
    pub status: String,
    pub color: Option<String>,
    pub is_todo_list: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub deleted_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoteWithTags {
    #[serde(flatten)]
    pub note: Note,
    pub tags: Vec<Tag>,
    pub todo_items: Vec<TodoItem>,
}

#[derive(Debug, Deserialize)]
pub struct CreateNote {
    pub title: String,
    pub content: Option<String>,
    pub category_id: Option<String>,
    pub color: Option<String>,
    pub is_todo_list: Option<bool>,
    pub tag_ids: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateNote {
    pub title: Option<String>,
    pub content: Option<String>,
    pub category_id: Option<String>,
    pub color: Option<String>,
    pub tag_ids: Option<Vec<String>>,
}

#[derive(Debug, Deserialize)]
pub struct NoteFilter {
    pub profile_id: String,
    pub status: Option<String>,
    pub category_id: Option<String>,
    pub tag_id: Option<String>,
    pub search: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

// ─── TodoItem ─────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct TodoItem {
    pub id: String,
    pub note_id: String,
    pub text: String,
    pub is_completed: bool,
    pub position: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateTodoItem {
    pub text: String,
    pub position: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTodoItem {
    pub text: Option<String>,
    pub is_completed: Option<bool>,
    pub position: Option<i64>,
}

// ─── Reminder ────────────────────────────────────────────────────────────────

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Reminder {
    pub id: String,
    pub note_id: String,
    pub profile_id: String,
    pub remind_at: DateTime<Utc>,
    pub is_recurring: bool,
    pub recurrence_rule: Option<String>,
    pub is_dismissed: bool,
    pub is_snoozed: bool,
    pub snoozed_until: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateReminder {
    pub note_id: String,
    pub remind_at: DateTime<Utc>,
    pub is_recurring: Option<bool>,
    pub recurrence_rule: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateReminder {
    pub remind_at: Option<DateTime<Utc>>,
    pub is_recurring: Option<bool>,
    pub recurrence_rule: Option<String>,
    pub is_dismissed: Option<bool>,
    pub is_snoozed: Option<bool>,
    pub snoozed_until: Option<DateTime<Utc>>,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

pub fn new_id() -> String {
    Uuid::new_v4().to_string()
}
