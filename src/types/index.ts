export interface Profile {
  id: string
  name: string
  avatar_color: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  profile_id: string
  name: string
  color: string
  icon?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Tag {
  id: string
  profile_id: string
  name: string
  color: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

export type NoteStatus = 'Active' | 'Pinned' | 'Archived' | 'Trashed'

export interface Note {
  id: string
  profile_id: string
  category_id?: string
  title: string
  content: string
  status: NoteStatus
  color?: string
  is_todo_list: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface TodoItem {
  id: string
  note_id: string
  text: string
  is_completed: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface NoteWithTags extends Note {
  tags: Tag[]
  todo_items: TodoItem[]
}

export interface Reminder {
  id: string
  note_id: string
  profile_id: string
  remind_at: string
  is_recurring: boolean
  recurrence_rule?: string
  is_dismissed: boolean
  is_snoozed: boolean
  snoozed_until?: string
  created_at: string
  updated_at: string
}

// ─── Request types ────────────────────────────────────────────────────────────

export interface CreateProfile {
  name: string
  avatar_color?: string
}

export interface UpdateProfile {
  name?: string
  avatar_color?: string
}

export interface CreateCategory {
  name: string
  color?: string
  icon?: string
}

export interface UpdateCategory {
  name?: string
  color?: string
  icon?: string
}

export interface CreateTag {
  name: string
  color?: string
}

export interface UpdateTag {
  name?: string
  color?: string
}

export interface CreateNote {
  title: string
  content?: string
  category_id?: string
  color?: string
  is_todo_list?: boolean
  tag_ids?: string[]
}

export interface UpdateNote {
  title?: string
  content?: string
  category_id?: string
  color?: string
  tag_ids?: string[]
}

export interface NoteFilter {
  profile_id: string
  status?: NoteStatus
  category_id?: string
  tag_id?: string
  search?: string
  limit?: number
  offset?: number
}

export interface CreateTodoItem {
  text: string
  position?: number
}

export interface UpdateTodoItem {
  text?: string
  is_completed?: boolean
  position?: number
}

export interface CreateReminder {
  note_id: string
  remind_at: string
  is_recurring?: boolean
  recurrence_rule?: string
}

export interface UpdateReminder {
  remind_at?: string
  is_recurring?: boolean
  recurrence_rule?: string
  is_dismissed?: boolean
  is_snoozed?: boolean
  snoozed_until?: string
}
