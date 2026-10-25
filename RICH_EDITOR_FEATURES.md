# Rich Text Editor Features

The Notes App now includes a powerful rich text editor built with TipTap, providing comprehensive text formatting and editing capabilities.

## Features Overview

### 1. Text Formatting
- **Bold** (Ctrl+B) - Emphasize important text
- **Italic** (Ctrl+I) - Italicize text for emphasis
- **Strikethrough** - Mark text as deleted or outdated
- **Code** - Format inline code snippets
- **Keyboard Shortcuts** - Full keyboard support for all formatting

### 2. Heading Levels
- **Heading 2** - For major sections
- **Heading 3** - For subsections
- Easily toggle between different heading levels

### 3. Lists
- **Bullet Lists** - Unordered list items with disc bullets
- **Ordered Lists** - Numbered lists for sequential content
- **Nested Lists** - Support for nested list items
- **Keep Marks** - Formatting preserved when converting to/from lists

### 4. Text Alignment
- **Align Left** - Default left alignment
- **Align Center** - Center text for titles or emphasis
- **Align Right** - Right-aligned text
- Works with paragraphs and headings

### 5. Tables
- **Insert Table** - Create tables with 3 rows and 3 columns (customizable)
- **Dynamic Table Manipulation:**
  - ↑ Add Row Before
  - ↓ Add Row After
  - ← Add Column Before
  - → Add Column After
  - Delete Table
- **Resizable Columns** - Drag column borders to resize
- **Header Rows** - Tables include formatted header rows
- **Cell Selection** - Visual feedback for selected cells

### 6. Links
- **Add Links** - Click the link button and enter a URL
- **Link Formatting** - Links are underlined and clickable
- **URL Support** - Full http/https URL support

### 7. Other Features
- **Horizontal Rule** - Insert divider lines (Minus button)
- **Code Blocks** - Full code block support with syntax highlighting
- **Blockquotes** - Format text as blockquotes
- **Auto-save** - Changes saved automatically as you type

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Bold | Ctrl+B |
| Italic | Ctrl+I |
| Code | Ctrl+` |
| Paragraph | Ctrl+Alt+0 |
| Heading 2 | Ctrl+Alt+2 |
| Heading 3 | Ctrl+Alt+3 |
| Bullet List | Ctrl+Shift+8 |
| Ordered List | Ctrl+Shift+7 |

## Toolbar Overview

### Main Toolbar
The top toolbar contains:
1. **Formatting buttons** - Bold, Italic, Strikethrough, Code
2. **Separator** - Visual divider
3. **Heading buttons** - H2, H3
4. **Separator** - Visual divider
5. **List buttons** - Bullet list, Ordered list
6. **Separator** - Visual divider
7. **Alignment buttons** - Left, Center, Right
8. **Separator** - Visual divider
9. **Utility buttons** - Horizontal rule, Link, Table

### Table Toolbar
When a table is active, an additional toolbar appears with table-specific tools:
- Add row before/after
- Add column before/after
- Delete table

## Copy, Cut, and Paste

The editor supports native browser copy/cut/paste functionality:
- **Copy** - Ctrl+C - Copies selected text with formatting preserved
- **Cut** - Ctrl+X - Cuts selected text
- **Paste** - Ctrl+V - Pastes content; formatting is automatically adapted to match

### Paste Behavior
- **Plain Text** - Pastes as plain text without formatting
- **Formatted Text** - HTML formatting is preserved
- **From Other Editors** - Content from Word, Google Docs, etc. pastes with formatting

## Data Storage

All rich text content is stored as HTML in the database, ensuring:
- **Full formatting preservation** - All styling, alignment, and structure is maintained
- **Cross-platform compatibility** - HTML is universally supported
- **Future compatibility** - Easy to export or migrate content
- **Search support** - FTS5 search indexes text content

## Technical Details

### Component Structure
```
src/components/notes/RichTextEditor.tsx
├── TipTap Editor Integration
├── Extensions
│   ├── StarterKit (core formatting)
│   ├── Link
│   ├── Table, TableRow, TableCell
│   └── TextAlign
└── Toolbar UI
```

### Styling
```
src/styles/editor.css
├── ProseMirror base styles
├── Typography styles
├── Table styles
├── Code block styles
└── Dark mode support
```

### Dependencies
- `@tiptap/react` - React bindings for TipTap
- `@tiptap/starter-kit` - Core formatting extensions
- `@tiptap/extension-link` - Link support
- `@tiptap/extension-table` - Table support
- `@tiptap/extension-table-row` - Table row support
- `@tiptap/extension-table-cell` - Table cell support
- `@tiptap/extension-text-align` - Text alignment support

## Styling and Customization

The editor uses:
- **Tailwind CSS** - For UI component styling
- **Dark mode support** - Automatic switching with app theme
- **Prose styles** - Beautiful default typography from Tailwind's prose plugin
- **Custom CSS** - Editor-specific styling in `editor.css`

## Browser Support

The rich text editor is compatible with:
- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Modern Electron/Tauri windows

## Migration from Plain Text

Existing plain text notes automatically work with the new editor:
- Plain text notes display in the rich editor
- No conversion needed - backwards compatible
- Formatting can be added to existing notes anytime

## Limitations and Notes

1. **Collaborative Editing** - Not yet supported (future enhancement)
2. **Media Embedding** - Images not yet supported (planned)
3. **Custom Fonts** - Uses system/web fonts (can be extended)
4. **Printing** - Full print support via browser print dialog
5. **Undo/Redo** - Full history with Ctrl+Z / Ctrl+Shift+Z

## Future Enhancements

Potential features for future versions:
- [ ] Image and media embedding
- [ ] Markdown import/export
- [ ] Custom colors and highlighting
- [ ] Mention support (@username)
- [ ] Emoji picker
- [ ] Table of contents auto-generation
- [ ] Collaborative editing with conflict resolution
- [ ] Version history and time-travel
