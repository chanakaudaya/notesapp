import { Sidebar } from '@/components/ui/Sidebar'
import { NoteList } from '@/components/notes/NoteList'
import { NoteEditor } from '@/components/notes/NoteEditor'

export function MainPage() {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 shrink-0 overflow-hidden">
          <NoteList />
        </div>
        <div className="flex-1 overflow-hidden">
          <NoteEditor />
        </div>
      </div>
    </div>
  )
}
