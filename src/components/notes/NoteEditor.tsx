import { useCallback, useEffect, useState } from 'react'
import {
  Archive,
  Bell,
  Palette,
  Pin,
  Tag,
  Trash2,
} from 'lucide-react'
import { useNote, useSetNoteStatus, useUpdateNote, useDeleteNote } from '@/hooks/useNotes'
import { useTags } from '@/hooks/useCategories'
import { useAppStore } from '@/store/useAppStore'
import { TodoList } from '@/components/todos/TodoList'
import { ReminderSection } from '@/components/reminders/ReminderSection'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { NoteStatus } from '@/types'

const NOTE_COLORS = [
  '#ffffff', '#fef9c3', '#dcfce7', '#dbeafe', '#fce7f3',
  '#fef3c7', '#e0e7ff', '#ffedd5', '#f0fdf4', '#fdf4ff',
]

export function NoteEditor() {
  const { selectedNoteId, activeProfileId, setSelectedNoteId } = useAppStore()
  const { data: note, isLoading } = useNote(selectedNoteId)
  const { data: tags } = useTags(activeProfileId)

  const updateNote = useUpdateNote()
  const setStatus = useSetNoteStatus()
  const deleteNote = useDeleteNote()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [showReminderPanel, setShowReminderPanel] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
    }
  }, [note?.id])

  const save = useCallback(
    (newTitle: string, newContent: string) => {
      if (!note) return
      updateNote.mutate({ id: note.id, req: { title: newTitle, content: newContent } })
    },
    [note?.id]
  )

  const handleTitleBlur = () => save(title, content)
  const handleContentBlur = () => save(title, content)

  const handleStatusChange = (status: NoteStatus) => {
    if (!note) return
    setStatus.mutate({ id: note.id, status })
  }

  const handleColorChange = (color: string) => {
    if (!note) return
    updateNote.mutate({ id: note.id, req: { color } })
    setShowColorPicker(false)
  }

  const handleToggleTag = (tagId: string) => {
    if (!note) return
    const currentIds = note.tags.map((t) => t.id)
    const newIds = currentIds.includes(tagId)
      ? currentIds.filter((id) => id !== tagId)
      : [...currentIds, tagId]
    updateNote.mutate({ id: note.id, req: { tag_ids: newIds } })
  }

  const handleTrash = () => {
    if (!note) return
    if (note.status === 'Trashed') {
      deleteNote.mutate(note.id)
      setSelectedNoteId(null)
    } else {
      handleStatusChange('Trashed')
    }
  }

  if (!selectedNoteId) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400 dark:text-gray-600">
        <p className="text-sm">Select a note or create a new one</p>
      </div>
    )
  }

  if (isLoading || !note) {
    return (
      <div className="flex flex-1 items-center justify-center text-gray-400">
        <p className="text-sm">Loading…</p>
      </div>
    )
  }

  return (
    <div
      className="flex h-full flex-col"
      style={note.color ? { backgroundColor: note.color + '08' } : undefined}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-gray-200 px-4 py-2 dark:border-gray-700">
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            handleStatusChange(note.status === 'Pinned' ? 'Active' : 'Pinned')
          }
          title={note.status === 'Pinned' ? 'Unpin' : 'Pin'}
          className={note.status === 'Pinned' ? 'text-primary-600' : ''}
        >
          <Pin size={15} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            handleStatusChange(note.status === 'Archived' ? 'Active' : 'Archived')
          }
          title={note.status === 'Archived' ? 'Unarchive' : 'Archive'}
          className={note.status === 'Archived' ? 'text-amber-500' : ''}
        >
          <Archive size={15} />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowReminderPanel((p) => !p)}
          title="Set reminder"
          className={showReminderPanel ? 'text-primary-600' : ''}
        >
          <Bell size={15} />
        </Button>
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowTagPicker((p) => !p)}
            title="Add tags"
          >
            <Tag size={15} />
          </Button>
          {showTagPicker && tags && (
            <div className="absolute top-full left-0 z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleToggleTag(tag.id)}
                  className="flex w-full items-center gap-2 rounded px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                  {note.tags.some((t) => t.id === tag.id) && (
                    <span className="ml-auto text-primary-500">✓</span>
                  )}
                </button>
              ))}
              {tags.length === 0 && (
                <p className="px-2 py-1 text-xs text-gray-400">No tags yet</p>
              )}
            </div>
          )}
        </div>
        <div className="relative">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowColorPicker((p) => !p)}
            title="Note color"
          >
            <Palette size={15} />
          </Button>
          {showColorPicker && (
            <div className="absolute top-full left-0 z-20 mt-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="grid grid-cols-5 gap-1">
                {NOTE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="h-6 w-6 rounded-full border border-gray-300 transition-transform hover:scale-110"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleTrash}
            title={note.status === 'Trashed' ? 'Delete permanently' : 'Move to trash'}
            className="text-red-400 hover:text-red-500"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>

      {/* Tags bar */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 border-b border-gray-200 px-4 py-2 dark:border-gray-700">
          {note.tags.map((tag) => (
            <Badge key={tag.id} color={tag.color}>
              <Tag size={10} />
              {tag.name}
            </Badge>
          ))}
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Title"
          className="mb-4 w-full bg-transparent text-2xl font-semibold text-gray-900 placeholder:text-gray-300 focus:outline-none dark:text-white dark:placeholder:text-gray-600"
        />

        {note.is_todo_list ? (
          <TodoList noteId={note.id} items={note.todo_items} />
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleContentBlur}
            placeholder="Start writing…"
            className="h-full min-h-[300px] w-full resize-none bg-transparent text-base text-gray-700 placeholder:text-gray-300 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-600"
          />
        )}
      </div>

      {/* Reminder panel */}
      {showReminderPanel && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <ReminderSection noteId={note.id} />
        </div>
      )}
    </div>
  )
}
