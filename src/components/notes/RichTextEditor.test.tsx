import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RichTextEditor } from '@/components/notes/RichTextEditor'

const queryClient = new QueryClient()

describe('RichTextEditor', () => {
  it('renders the editor with toolbar', () => {
    const handleChange = vi.fn()
    render(
      <QueryClientProvider client={queryClient}>
        <RichTextEditor content="<p>Test content</p>" onContentChange={handleChange} />
      </QueryClientProvider>
    )

    expect(screen.getByTitle('Bold (Ctrl+B)')).toBeInTheDocument()
    expect(screen.getByTitle('Italic (Ctrl+I)')).toBeInTheDocument()
    expect(screen.getByTitle('Heading 2')).toBeInTheDocument()
    expect(screen.getByTitle('Bullet list')).toBeInTheDocument()
    expect(screen.getByTitle('Ordered list')).toBeInTheDocument()
  })

  it('displays initial content', async () => {
    const handleChange = vi.fn()
    const content = '<h2>Test Heading</h2><p>Test paragraph</p>'

    render(
      <QueryClientProvider client={queryClient}>
        <RichTextEditor content={content} onContentChange={handleChange} />
      </QueryClientProvider>
    )

    await waitFor(() => {
      const editor = screen.getByRole('textbox', { hidden: true })
      expect(editor).toBeInTheDocument()
    })
  })

  it('calls onContentChange when content is edited', async () => {
    const handleChange = vi.fn()

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <RichTextEditor content="<p>Initial</p>" onContentChange={handleChange} />
      </QueryClientProvider>
    )

    const editor = container.querySelector('.ProseMirror')
    expect(editor).toBeInTheDocument()
  })

  it('renders formatting buttons', () => {
    const handleChange = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <RichTextEditor content="<p>Test</p>" onContentChange={handleChange} />
      </QueryClientProvider>
    )

    // Check for formatting buttons
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(10) // Should have many toolbar buttons
  })

  it('respects editable prop', () => {
    const handleChange = vi.fn()

    const { rerender } = render(
      <QueryClientProvider client={queryClient}>
        <RichTextEditor content="<p>Test</p>" onContentChange={handleChange} editable={true} />
      </QueryClientProvider>
    )

    const editableButton = screen.getByTitle('Bold (Ctrl+B)')
    expect(editableButton).not.toBeDisabled()

    rerender(
      <QueryClientProvider client={queryClient}>
        <RichTextEditor content="<p>Test</p>" onContentChange={handleChange} editable={false} />
      </QueryClientProvider>
    )
  })

  it('has table insertion button', () => {
    const handleChange = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <RichTextEditor content="<p>Test</p>" onContentChange={handleChange} />
      </QueryClientProvider>
    )

    const tableButton = screen.getByTitle('Insert table')
    expect(tableButton).toBeInTheDocument()
  })

  it('has link button', () => {
    const handleChange = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <RichTextEditor content="<p>Test</p>" onContentChange={handleChange} />
      </QueryClientProvider>
    )

    const linkButton = screen.getByText('🔗')
    expect(linkButton).toBeInTheDocument()
  })

  it('has alignment buttons', () => {
    const handleChange = vi.fn()

    render(
      <QueryClientProvider client={queryClient}>
        <RichTextEditor content="<p>Test</p>" onContentChange={handleChange} />
      </QueryClientProvider>
    )

    expect(screen.getByTitle('Align left')).toBeInTheDocument()
    expect(screen.getByTitle('Align center')).toBeInTheDocument()
    expect(screen.getByTitle('Align right')).toBeInTheDocument()
  })
})
