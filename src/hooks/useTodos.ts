import { useMutation, useQueryClient } from '@tanstack/react-query'
import { todosApi } from '@/api'
import type { CreateTodoItem, UpdateTodoItem } from '@/types'
import { noteKeys } from './useNotes'

export function useCreateTodoItem(noteId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateTodoItem) => todosApi.create(noteId, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.detail(noteId) }),
  })
}

export function useUpdateTodoItem(noteId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateTodoItem }) =>
      todosApi.update(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.detail(noteId) }),
  })
}

export function useDeleteTodoItem(noteId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => todosApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.detail(noteId) }),
  })
}

export function useReorderTodoItems(noteId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (orderedIds: string[]) => todosApi.reorder(noteId, orderedIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.detail(noteId) }),
  })
}
