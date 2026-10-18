import { format } from 'date-fns'
import { Archive, Pin, Tag, Trash2 } from 'lucide-react'
import type { NoteWithTags } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface NoteCardProps {
  note: NoteWithTags
  isSelected: boolean
  onClick: () => void
}

export function NoteCard({ note, isSelected, onClick }: NoteCardProps) {
  const preview = note.content.slice(0, 120).replace(/\n/g, ' ')
  const completedCount = note.todo_items.filter((t) => t.is_completed).length
  const totalCount = note.todo_items.length

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md',
        isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600',
        note.color ? '' : ''
      )}
      style={
        note.color && !isSelected
          ? { backgroundColor: note.color + '18', borderColor: note.color + '44' }
          : undefined
      }
    >
      {/* Status indicators */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3
          className={cn(
            'line-clamp-2 font-medium',
            note.title
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-400 italic dark:text-gray-500'
          )}
        >
          {note.title || 'Untitled'}
        </h3>
        <div className="flex shrink-0 gap-1 text-gray-400">
          {note.status === 'Pinned' && (
            <Pin size={14} className="text-primary-500" />
          )}
          {note.status === 'Archived' && <Archive size={14} />}
          {note.status === 'Trashed' && <Trash2 size={14} className="text-red-400" />}
        </div>
      </div>

      {/* Content preview */}
      {note.is_todo_list ? (
        <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
          {totalCount > 0
            ? `${completedCount}/${totalCount} tasks completed`
            : 'Empty to-do list'}
        </p>
      ) : (
        preview && (
          <p className="mb-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
            {preview}
          </p>
        )
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} color={tag.color}>
              <Tag size={10} />
              {tag.name}
            </Badge>
          ))}
          {note.tags.length > 3 && (
            <Badge>+{note.tags.length - 3}</Badge>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
        <span>{format(new Date(note.updated_at), 'MMM d, yyyy')}</span>
        {note.is_todo_list && (
          <span className="rounded bg-blue-100 px-1 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
            Todo
          </span>
        )}
      </div>
    </div>
  )
}
