import { Plus, Search } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useNotes } from '@/hooks/useNotes'
import { useCreateNote } from '@/hooks/useNotes'
import { NoteCard } from './NoteCard'
import { Button } from '@/components/ui/Button'

export function NoteList() {
  const {
    activeProfileId,
    activeStatus,
    activeCategoryId,
    activeTagId,
    searchQuery,
    setSearchQuery,
    selectedNoteId,
    setSelectedNoteId,
  } = useAppStore()

  const filter = {
    profile_id: activeProfileId ?? '',
    status: activeStatus,
    category_id: activeCategoryId ?? undefined,
    tag_id: activeTagId ?? undefined,
    search: searchQuery || undefined,
    limit: 100,
  }

  const { data: notes, isLoading } = useNotes(filter)
  const createNote = useCreateNote(activeProfileId ?? '')

  const handleCreateNote = async () => {
    if (!activeProfileId) return
    const note = await createNote.mutateAsync({
      title: '',
      content: '',
      is_todo_list: false,
    })
    setSelectedNoteId(note.id)
  }

  return (
    <div className="flex h-full flex-col border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <h2 className="text-sm font-semibold capitalize text-gray-700 dark:text-gray-300">
          {activeStatus}
        </h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleCreateNote}
          disabled={!activeProfileId}
          title="New note"
        >
          <Plus size={16} />
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="search"
            placeholder="Search notes…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm focus:border-primary-400 focus:outline-none dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
      </div>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {isLoading ? (
          <div className="py-8 text-center text-sm text-gray-400">Loading…</div>
        ) : !notes || notes.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            {searchQuery ? 'No notes match your search' : 'No notes yet'}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isSelected={note.id === selectedNoteId}
                onClick={() => setSelectedNoteId(note.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
