import React from 'react'
import {
  Archive,
  CheckSquare,
  LayoutGrid,
  Moon,
  Sun,
  Tag,
  Trash2,
} from 'lucide-react'
import { useCategories, useTags } from '@/hooks/useCategories'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import type { NoteStatus } from '@/types'

const STATUS_ITEMS: { label: string; status: NoteStatus; icon: React.ReactNode }[] = [
  { label: 'Notes', status: 'Active', icon: <LayoutGrid size={16} /> },
  { label: 'Pinned', status: 'Pinned', icon: <CheckSquare size={16} /> },
  { label: 'Archived', status: 'Archived', icon: <Archive size={16} /> },
  { label: 'Trash', status: 'Trashed', icon: <Trash2 size={16} /> },
]

export function Sidebar() {
  const {
    activeProfileId,
    activeStatus,
    setActiveStatus,
    activeCategoryId,
    setActiveCategoryId,
    activeTagId,
    setActiveTagId,
    darkMode,
    toggleDarkMode,
  } = useAppStore()

  const { data: categories } = useCategories(activeProfileId)
  const { data: tags } = useTags(activeProfileId)

  return (
    <nav className="flex h-full w-60 shrink-0 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      {/* App title */}
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-4 dark:border-gray-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white text-sm font-bold">
          N
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">Notes</span>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        {/* Status navigation */}
        <div className="mb-4">
          {STATUS_ITEMS.map(({ label, status, icon }) => (
            <SidebarItem
              key={status}
              icon={icon}
              label={label}
              active={activeStatus === status && !activeCategoryId && !activeTagId}
              onClick={() => {
                setActiveStatus(status)
                setActiveCategoryId(null)
                setActiveTagId(null)
              }}
            />
          ))}
        </div>

        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Categories
            </p>
            {categories.map((cat) => (
              <SidebarItem
                key={cat.id}
                icon={
                  <span
                    className="h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                }
                label={cat.name}
                active={activeCategoryId === cat.id}
                onClick={() => {
                  setActiveCategoryId(cat.id)
                  setActiveStatus('Active')
                }}
              />
            ))}
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="mb-4">
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Tags
            </p>
            {tags.map((tag) => (
              <SidebarItem
                key={tag.id}
                icon={<Tag size={14} style={{ color: tag.color }} />}
                label={tag.name}
                active={activeTagId === tag.id}
                onClick={() => {
                  setActiveTagId(tag.id)
                  setActiveStatus('Active')
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="border-t border-gray-200 px-2 py-2 dark:border-gray-700">
        <SidebarItem
          icon={darkMode ? <Sun size={16} /> : <Moon size={16} />}
          label={darkMode ? 'Light mode' : 'Dark mode'}
          onClick={toggleDarkMode}
        />
      </div>
    </nav>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
        active
          ? 'bg-primary-100 font-medium text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      )}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}
