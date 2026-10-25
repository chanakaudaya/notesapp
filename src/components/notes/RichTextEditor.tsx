import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
  Table as TableIcon,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import '@/styles/editor.css'

interface RichTextEditorProps {
  content: string
  onContentChange: (content: string) => void
  editable?: boolean
}

export function RichTextEditor({
  content,
  onContentChange,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
        }),
        Link.configure({
          openOnClick: false,
        }),
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableCell,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ],
      content: content || '<p></p>',
      editable,
      onUpdate: ({ editor }) => {
        try {
          onContentChange(editor.getHTML())
        } catch (error) {
          console.error('Error updating content:', error)
        }
      },
    },
    [editable]
  )

  // Only update content when it changes and editor is ready
  useEffect(() => {
    if (!editor) return
    
    try {
      const currentContent = editor.getHTML()
      // Only update if content actually changed to avoid unnecessary updates
      if (content && currentContent !== content) {
        editor.commands.setContent(content)
      }
    } catch (error) {
      console.error('Error setting content:', error)
    }
  }, [content, editor])

  if (!editor) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-400">Loading editor…</p>
      </div>
    )
  }

  const handleLinkClick = () => {
    const url = prompt('Enter URL:')
    if (url) {
      try {
        editor.chain().focus().toggleLink({ href: url }).run()
      } catch (error) {
        console.error('Error adding link:', error)
      }
    }
  }

  const insertTable = () => {
    try {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    } catch (error) {
      console.error('Error inserting table:', error)
    }
  }

  const deleteTable = () => {
    try {
      editor.chain().focus().deleteTable().run()
    } catch (error) {
      console.error('Error deleting table:', error)
    }
  }

  const addTableRowBefore = () => {
    try {
      editor.chain().focus().addRowBefore().run()
    } catch (error) {
      console.error('Error adding row:', error)
    }
  }

  const addTableRowAfter = () => {
    try {
      editor.chain().focus().addRowAfter().run()
    } catch (error) {
      console.error('Error adding row:', error)
    }
  }

  const addTableColBefore = () => {
    try {
      editor.chain().focus().addColumnBefore().run()
    } catch (error) {
      console.error('Error adding column:', error)
    }
  }

  const addTableColAfter = () => {
    try {
      editor.chain().focus().addColumnAfter().run()
    } catch (error) {
      console.error('Error adding column:', error)
    }
  }

  const isTableActive = editor.isActive('table')

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Main Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2 flex flex-wrap gap-1 overflow-x-auto">
        {/* Text formatting */}
        <Button
          size="sm"
          variant={editor.isActive('bold') ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().toggleBold().run()
            } catch (e) {
              console.error('Bold error:', e)
            }
          }}
          title="Bold (Ctrl+B)"
          className="flex-shrink-0"
        >
          <Bold size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('italic') ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().toggleItalic().run()
            } catch (e) {
              console.error('Italic error:', e)
            }
          }}
          title="Italic (Ctrl+I)"
          className="flex-shrink-0"
        >
          <Italic size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('strike') ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().toggleStrike().run()
            } catch (e) {
              console.error('Strike error:', e)
            }
          }}
          title="Strikethrough"
          className="flex-shrink-0"
        >
          <Strikethrough size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('code') ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().toggleCode().run()
            } catch (e) {
              console.error('Code error:', e)
            }
          }}
          title="Code"
          className="flex-shrink-0"
        >
          <Code size={16} />
        </Button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0" />

        {/* Headings */}
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            } catch (e) {
              console.error('Heading 2 error:', e)
            }
          }}
          title="Heading 2"
          className="flex-shrink-0 text-sm"
        >
          H2
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            } catch (e) {
              console.error('Heading 3 error:', e)
            }
          }}
          title="Heading 3"
          className="flex-shrink-0 text-sm"
        >
          H3
        </Button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0" />

        {/* Lists */}
        <Button
          size="sm"
          variant={editor.isActive('bulletList') ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().toggleBulletList().run()
            } catch (e) {
              console.error('Bullet list error:', e)
            }
          }}
          title="Bullet list"
          className="flex-shrink-0"
        >
          <List size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive('orderedList') ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().toggleOrderedList().run()
            } catch (e) {
              console.error('Ordered list error:', e)
            }
          }}
          title="Ordered list"
          className="flex-shrink-0"
        >
          <ListOrdered size={16} />
        </Button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0" />

        {/* Alignment */}
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().setTextAlign('left').run()
            } catch (e) {
              console.error('Align left error:', e)
            }
          }}
          title="Align left"
          className="flex-shrink-0"
        >
          <AlignLeft size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().setTextAlign('center').run()
            } catch (e) {
              console.error('Align center error:', e)
            }
          }}
          title="Align center"
          className="flex-shrink-0"
        >
          <AlignCenter size={16} />
        </Button>
        <Button
          size="sm"
          variant={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'ghost'}
          onClick={() => {
            try {
              editor.chain().focus().setTextAlign('right').run()
            } catch (e) {
              console.error('Align right error:', e)
            }
          }}
          title="Align right"
          className="flex-shrink-0"
        >
          <AlignRight size={16} />
        </Button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0" />

        {/* Horizontal rule */}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            try {
              editor.chain().focus().setHorizontalRule().run()
            } catch (e) {
              console.error('Horizontal rule error:', e)
            }
          }}
          title="Horizontal line"
          className="flex-shrink-0"
        >
          <Minus size={16} />
        </Button>

        {/* Link */}
        <Button
          size="sm"
          variant={editor.isActive('link') ? 'primary' : 'ghost'}
          onClick={handleLinkClick}
          title="Add link"
          className="flex-shrink-0"
        >
          🔗
        </Button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0" />

        {/* Table */}
        <Button
          size="sm"
          variant={isTableActive ? 'primary' : 'ghost'}
          onClick={insertTable}
          title="Insert table"
          className="flex-shrink-0"
        >
          <TableIcon size={16} />
        </Button>
      </div>

      {/* Table actions toolbar (shown when table is active) */}
      {isTableActive && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900 p-2 flex flex-wrap gap-1 overflow-x-auto">
          <span className="text-xs text-gray-600 dark:text-gray-300 self-center px-2">
            Table tools:
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={addTableRowBefore}
            title="Add row before"
            className="flex-shrink-0 text-xs"
          >
            ↑ Row
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={addTableRowAfter}
            title="Add row after"
            className="flex-shrink-0 text-xs"
          >
            ↓ Row
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={addTableColBefore}
            title="Add column before"
            className="flex-shrink-0 text-xs"
          >
            ← Col
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={addTableColAfter}
            title="Add column after"
            className="flex-shrink-0 text-xs"
          >
            Col →
          </Button>
          <div className="w-px bg-gray-400 dark:bg-gray-600 mx-1 flex-shrink-0" />
          <Button
            size="sm"
            variant="ghost"
            onClick={deleteTable}
            title="Delete table"
            className="flex-shrink-0 text-red-500 hover:text-red-600"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )}

      {/* Editor content area */}
      <div className="flex-1 overflow-y-auto p-4">
        <EditorContent editor={editor} className="prose dark:prose-invert max-w-none" />
      </div>
    </div>
  )
}
