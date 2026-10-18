import { useState } from 'react'
import { Bell, Clock, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import {
  useRemindersForNote,
  useCreateReminder,
  useDismissReminder,
  useDeleteReminder,
} from '@/hooks/useReminders'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/Button'

interface ReminderSectionProps {
  noteId: string
}

export function ReminderSection({ noteId }: ReminderSectionProps) {
  const { activeProfileId } = useAppStore()
  const { data: reminders } = useRemindersForNote(noteId)
  const createReminder = useCreateReminder(activeProfileId ?? '')
  const dismissReminder = useDismissReminder()
  const deleteReminder = useDeleteReminder()

  const [reminderDate, setReminderDate] = useState('')
  const [reminderTime, setReminderTime] = useState('')

  const handleCreate = async () => {
    if (!reminderDate || !reminderTime || !activeProfileId) return
    const remindAt = new Date(`${reminderDate}T${reminderTime}`).toISOString()
    await createReminder.mutateAsync({ note_id: noteId, remind_at: remindAt })
    setReminderDate('')
    setReminderTime('')
  }

  return (
    <div className="px-4 py-3">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        <Bell size={14} />
        Reminders
      </div>

      {/* Existing reminders */}
      {reminders && reminders.length > 0 && (
        <div className="mb-3 flex flex-col gap-1">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700/50"
            >
              <Clock size={13} className={r.is_dismissed ? 'text-gray-400' : 'text-primary-500'} />
              <span
                className={
                  r.is_dismissed ? 'flex-1 text-gray-400 line-through' : 'flex-1 text-gray-700 dark:text-gray-300'
                }
              >
                {format(new Date(r.remind_at), 'MMM d, yyyy h:mm a')}
              </span>
              {!r.is_dismissed && (
                <button
                  onClick={() => dismissReminder.mutate(r.id)}
                  className="text-gray-400 hover:text-green-500"
                  title="Mark as done"
                >
                  ✓
                </button>
              )}
              <button
                onClick={() => deleteReminder.mutate(r.id)}
                className="text-gray-400 hover:text-red-400"
                title="Delete reminder"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add reminder */}
      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Date</label>
          <input
            type="date"
            value={reminderDate}
            onChange={(e) => setReminderDate(e.target.value)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-primary-400 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500">Time</label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-primary-400 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          />
        </div>
        <Button size="sm" onClick={handleCreate} disabled={!reminderDate || !reminderTime}>
          Set
        </Button>
      </div>
    </div>
  )
}
