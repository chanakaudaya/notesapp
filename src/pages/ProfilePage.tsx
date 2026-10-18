import { useState } from 'react'
import { User } from 'lucide-react'
import { useProfiles, useCreateProfile } from '@/hooks/useProfiles'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const AVATAR_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#ec4899', '#14b8a6', '#6366f1',
]

export function ProfilePage() {
  const { data: profiles, isLoading } = useProfiles()
  const createProfile = useCreateProfile()
  const setActiveProfileId = useAppStore((s) => s.setActiveProfileId)

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0])

  const handleCreate = async () => {
    if (!name.trim()) return
    const profile = await createProfile.mutateAsync({
      name: name.trim(),
      avatar_color: selectedColor,
    })
    setActiveProfileId(profile.id)
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-gray-400">Loading profiles…</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-3xl font-bold text-white">
          N
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes App</h1>
        <p className="mt-1 text-sm text-gray-500">
          {profiles && profiles.length > 0
            ? 'Choose a profile to continue'
            : 'Create your first profile to get started'}
        </p>
      </div>

      {/* Existing profiles */}
      {profiles && profiles.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveProfileId(p.id)}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-primary-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 w-32"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-white text-xl font-semibold"
                style={{ backgroundColor: p.avatar_color }}
              >
                {p.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate w-full text-center">
                {p.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Create profile form */}
      {showForm ? (
        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            New Profile
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
            />
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Avatar color
              </p>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
                      selectedColor === color
                        ? 'ring-2 ring-offset-2 ring-primary-500 scale-110'
                        : ''
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleCreate} className="flex-1" disabled={!name.trim()}>
                Create
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)} size="lg">
          <User size={18} className="mr-2" />
          Create Profile
        </Button>
      )}
    </div>
  )
}
