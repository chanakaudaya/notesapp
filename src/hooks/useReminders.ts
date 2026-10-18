import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { remindersApi } from '@/api'
import type { CreateReminder, UpdateReminder } from '@/types'

export const reminderKeys = {
  all: ['reminders'] as const,
  forNote: (noteId: string) => [...reminderKeys.all, 'note', noteId] as const,
  upcoming: (profileId: string) =>
    [...reminderKeys.all, 'upcoming', profileId] as const,
  due: (profileId: string) => [...reminderKeys.all, 'due', profileId] as const,
}

export function useRemindersForNote(noteId: string | null) {
  return useQuery({
    queryKey: reminderKeys.forNote(noteId!),
    queryFn: () => remindersApi.listForNote(noteId!),
    enabled: !!noteId,
  })
}

export function useUpcomingReminders(profileId: string | null) {
  return useQuery({
    queryKey: reminderKeys.upcoming(profileId!),
    queryFn: () => remindersApi.listUpcoming(profileId!),
    enabled: !!profileId,
    refetchInterval: 60_000, // Poll every minute for upcoming reminders
  })
}

export function useDueReminders(profileId: string | null) {
  return useQuery({
    queryKey: reminderKeys.due(profileId!),
    queryFn: () => remindersApi.listDue(profileId!),
    enabled: !!profileId,
    refetchInterval: 30_000, // Poll every 30s for due reminders
  })
}

export function useCreateReminder(profileId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateReminder) => remindersApi.create(profileId, req),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: reminderKeys.all }),
  })
}

export function useUpdateReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateReminder }) =>
      remindersApi.update(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: reminderKeys.all }),
  })
}

export function useDismissReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => remindersApi.dismiss(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: reminderKeys.all }),
  })
}

export function useDeleteReminder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => remindersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: reminderKeys.all }),
  })
}
