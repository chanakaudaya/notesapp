import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notesApi } from '@/api'
import type { CreateNote, NoteFilter, UpdateNote } from '@/types'

export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (filter: NoteFilter) => [...noteKeys.lists(), filter] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
}

export function useNotes(filter: NoteFilter) {
  return useQuery({
    queryKey: noteKeys.list(filter),
    queryFn: () => notesApi.list(filter),
    enabled: !!filter.profile_id,
  })
}

export function useNote(id: string | null) {
  return useQuery({
    queryKey: noteKeys.detail(id!),
    queryFn: () => notesApi.get(id!),
    enabled: !!id,
  })
}

export function useCreateNote(profileId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateNote) => notesApi.create(profileId, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.lists() }),
  })
}

export function useUpdateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateNote }) =>
      notesApi.update(id, req),
    onSuccess: (note) => {
      qc.invalidateQueries({ queryKey: noteKeys.lists() })
      qc.setQueryData(noteKeys.detail(note.id), note)
    },
  })
}

export function useSetNoteStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      notesApi.setStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.lists() }),
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => notesApi.deletePermanent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.lists() }),
  })
}
