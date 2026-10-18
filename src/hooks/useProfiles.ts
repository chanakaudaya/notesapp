import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { profilesApi } from '@/api'
import type { CreateProfile, UpdateProfile } from '@/types'

export const profileKeys = {
  all: ['profiles'] as const,
  list: () => [...profileKeys.all, 'list'] as const,
  detail: (id: string) => [...profileKeys.all, id] as const,
}

export function useProfiles() {
  return useQuery({
    queryKey: profileKeys.list(),
    queryFn: profilesApi.list,
  })
}

export function useCreateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (req: CreateProfile) => profilesApi.create(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.list() }),
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, req }: { id: string; req: UpdateProfile }) =>
      profilesApi.update(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.list() }),
  })
}

export function useDeleteProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => profilesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.list() }),
  })
}
