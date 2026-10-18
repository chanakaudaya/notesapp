import { invoke } from '@tauri-apps/api/core'
import type {
  Category,
  CreateCategory,
  CreateNote,
  CreateProfile,
  CreateReminder,
  CreateTag,
  CreateTodoItem,
  Note,
  NoteFilter,
  NoteWithTags,
  Profile,
  Reminder,
  Tag,
  TodoItem,
  UpdateCategory,
  UpdateNote,
  UpdateProfile,
  UpdateReminder,
  UpdateTag,
  UpdateTodoItem,
} from '@/types'

// ─── Profiles ─────────────────────────────────────────────────────────────────

export const profilesApi = {
  create: (req: CreateProfile) => invoke<Profile>('create_profile', { req }),
  get: (id: string) => invoke<Profile>('get_profile', { id }),
  list: () => invoke<Profile[]>('list_profiles'),
  update: (id: string, req: UpdateProfile) =>
    invoke<Profile>('update_profile', { id, req }),
  delete: (id: string) => invoke<void>('delete_profile', { id }),
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export const notesApi = {
  create: (profileId: string, req: CreateNote) =>
    invoke<NoteWithTags>('create_note', { profileId, req }),
  get: (id: string) => invoke<NoteWithTags>('get_note', { id }),
  list: (filter: NoteFilter) => invoke<NoteWithTags[]>('list_notes', { filter }),
  update: (id: string, req: UpdateNote) =>
    invoke<NoteWithTags>('update_note', { id, req }),
  setStatus: (id: string, status: string) =>
    invoke<Note>('set_note_status', { id, status }),
  deletePermanent: (id: string) => invoke<void>('delete_note_permanent', { id }),
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesApi = {
  create: (profileId: string, req: CreateCategory) =>
    invoke<Category>('create_category', { profileId, req }),
  list: (profileId: string) =>
    invoke<Category[]>('list_categories', { profileId }),
  update: (id: string, req: UpdateCategory) =>
    invoke<Category>('update_category', { id, req }),
  delete: (id: string) => invoke<void>('delete_category', { id }),
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export const tagsApi = {
  create: (profileId: string, req: CreateTag) =>
    invoke<Tag>('create_tag', { profileId, req }),
  list: (profileId: string) => invoke<Tag[]>('list_tags', { profileId }),
  update: (id: string, req: UpdateTag) =>
    invoke<Tag>('update_tag', { id, req }),
  delete: (id: string) => invoke<void>('delete_tag', { id }),
}

// ─── Todo Items ───────────────────────────────────────────────────────────────

export const todosApi = {
  create: (noteId: string, req: CreateTodoItem) =>
    invoke<TodoItem>('create_todo_item', { noteId, req }),
  list: (noteId: string) =>
    invoke<TodoItem[]>('list_todo_items', { noteId }),
  update: (id: string, req: UpdateTodoItem) =>
    invoke<TodoItem>('update_todo_item', { id, req }),
  delete: (id: string) => invoke<void>('delete_todo_item', { id }),
  reorder: (noteId: string, orderedIds: string[]) =>
    invoke<TodoItem[]>('reorder_todo_items', { noteId, orderedIds }),
}

// ─── Reminders ────────────────────────────────────────────────────────────────

export const remindersApi = {
  create: (profileId: string, req: CreateReminder) =>
    invoke<Reminder>('create_reminder', { profileId, req }),
  listForNote: (noteId: string) =>
    invoke<Reminder[]>('list_reminders_for_note', { noteId }),
  listUpcoming: (profileId: string) =>
    invoke<Reminder[]>('list_upcoming_reminders', { profileId }),
  listDue: (profileId: string) =>
    invoke<Reminder[]>('list_due_reminders', { profileId }),
  update: (id: string, req: UpdateReminder) =>
    invoke<Reminder>('update_reminder', { id, req }),
  dismiss: (id: string) => invoke<Reminder>('dismiss_reminder', { id }),
  delete: (id: string) => invoke<void>('delete_reminder', { id }),
}
