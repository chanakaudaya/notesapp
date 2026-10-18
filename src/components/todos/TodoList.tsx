import { useState } from 'react'
import { Check, Plus, Trash2, GripVertical } from 'lucide-react'
import type { TodoItem } from '@/types'
import {
  useCreateTodoItem,
  useUpdateTodoItem,
  useDeleteTodoItem,
} from '@/hooks/useTodos'
import { cn } from '@/lib/utils'

interface TodoListProps {
  noteId: string
  items: TodoItem[]
}

export function TodoList({ noteId, items }: TodoListProps) {
  const [newText, setNewText] = useState('')
  const createItem = useCreateTodoItem(noteId)
  const updateItem = useUpdateTodoItem(noteId)
  const deleteItem = useDeleteTodoItem(noteId)

  const handleAddItem = async () => {
    if (!newText.trim()) return
    await createItem.mutateAsync({ text: newText.trim() })
    setNewText('')
  }

  const handleToggle = (item: TodoItem) => {
    updateItem.mutate({ id: item.id, req: { is_completed: !item.is_completed } })
  }

  const handleTextChange = (item: TodoItem, text: string) => {
    updateItem.mutate({ id: item.id, req: { text } })
  }

  const pending = items.filter((i) => !i.is_completed)
  const completed = items.filter((i) => i.is_completed)

  return (
    <div className="flex flex-col gap-1">
      {/* Pending items */}
      {pending.map((item) => (
        <TodoItemRow
          key={item.id}
          item={item}
          onToggle={() => handleToggle(item)}
          onDelete={() => deleteItem.mutate(item.id)}
          onTextChange={(text) => handleTextChange(item, text)}
        />
      ))}

      {/* Add new item */}
      <div className="flex items-center gap-2 rounded-lg py-1">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-gray-300 dark:border-gray-600">
          <Plus size={10} className="text-gray-400" />
        </div>
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Add item…"
          className="flex-1 bg-transparent text-sm text-gray-500 placeholder:text-gray-300 focus:outline-none dark:text-gray-400"
        />
      </div>

      {/* Completed items */}
      {completed.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
            Completed ({completed.length})
          </p>
          {completed.map((item) => (
            <TodoItemRow
              key={item.id}
              item={item}
              onToggle={() => handleToggle(item)}
              onDelete={() => deleteItem.mutate(item.id)}
              onTextChange={(text) => handleTextChange(item, text)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface TodoItemRowProps {
  item: TodoItem
  onToggle: () => void
  onDelete: () => void
  onTextChange: (text: string) => void
}

function TodoItemRow({ item, onToggle, onDelete, onTextChange }: TodoItemRowProps) {
  const [editText, setEditText] = useState(item.text)

  return (
    <div className="group flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <GripVertical
        size={14}
        className="shrink-0 cursor-grab text-gray-300 opacity-0 group-hover:opacity-100"
      />
      <button
        onClick={onToggle}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          item.is_completed
            ? 'border-primary-500 bg-primary-500'
            : 'border-gray-300 hover:border-primary-400 dark:border-gray-600'
        )}
      >
        {item.is_completed && <Check size={10} className="text-white" strokeWidth={3} />}
      </button>
      <input
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        onBlur={() => {
          if (editText.trim() !== item.text) onTextChange(editText.trim())
        }}
        className={cn(
          'flex-1 bg-transparent text-sm focus:outline-none',
          item.is_completed
            ? 'text-gray-400 line-through dark:text-gray-500'
            : 'text-gray-700 dark:text-gray-200'
        )}
      />
      <button
        onClick={onDelete}
        className="shrink-0 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}
