import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoriesApi, tagsApi } from '@/api'
import type { CreateCategory, CreateTag, UpdateCategory, UpdateTag } from '@/types'

export const categoryKeys = {
  all: ['categories'] as const,
  list: (profileId: string) => [...categoryKeys.all, profileId] as const,
}

export const tagKeys = {
  all: ['tags'] as const,
  list: (profileId: string) => [...tagKeys.all, profileId] as const,
}

export function useCategories(profileId: string | null) {
  return useQuery({
    queryKey: categoryKeys.list(profileId!),
    queryFn: () => categoriesApi.list(profileId!),
    enabled: !!profileId,
  })
}

export function useCreateCategory(profileId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateCategory) => categoriesApi.create(profileId, req),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: categoryKeys.list(profileId) }),
  })
}

export function useUpdateCategory(profileId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateCategory }) =>
      categoriesApi.update(id, req),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: categoryKeys.list(profileId) }),
  })
}

export function useDeleteCategory(profileId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoriesApi.delete(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: categoryKeys.list(profileId) }),
  })
}

export function useTags(profileId: string | null) {
  return useQuery({
    queryKey: tagKeys.list(profileId!),
    queryFn: () => tagsApi.list(profileId!),
    enabled: !!profileId,
  })
}

export function useCreateTag(profileId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateTag) => tagsApi.create(profileId, req),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: tagKeys.list(profileId) }),
  })
}

export function useUpdateTag(profileId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateTag }) =>
      tagsApi.update(id, req),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: tagKeys.list(profileId) }),
  })
}

export function useDeleteTag(profileId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => tagsApi.delete(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: tagKeys.list(profileId) }),
  })
}
