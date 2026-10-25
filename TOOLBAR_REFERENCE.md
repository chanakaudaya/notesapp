# Rich Text Editor - Toolbar Reference

## Main Toolbar Layout

```
┌─ FORMATTING ─────────────────────────────────────────────────────────────┐
│                                                                           │
│  [B]  [I]  [—]  [<>]  │  [H2]  [H3]  │  [•]  [1.]  │  [<<] [>>] [>>]  │
│ Bold Italic Strike Code   Heading      Lists         Alignment           │
│                                                                           │
│  │  [─]  [🔗]  [⊞]                                                      │
│  Rule  Link   Table                                                       │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

## Detailed Button Reference

### Text Formatting Section
```
┌────────────────────────────────────────────┐
│ FORMATTING BUTTONS                          │
├────────────────────────────────────────────┤
│                                             │
│  [B]     Bold            Ctrl+B             │
│  Make text bold                             │
│                                             │
│  [I]     Italic          Ctrl+I             │
│  Slant text for emphasis                    │
│                                             │
│  [—]     Strikethrough                      │
│  Line through text                          │
│                                             │
│  [<>]    Code            Ctrl+`             │
│  Monospace formatting                       │
│                                             │
└────────────────────────────────────────────┘
```

### Heading & Structure Section
```
┌────────────────────────────────────────────┐
│ STRUCTURE BUTTONS                           │
├────────────────────────────────────────────┤
│                                             │
│  [H2]    Heading 2       Ctrl+Alt+2        │
│  Large section header                       │
│                                             │
│  [H3]    Heading 3       Ctrl+Alt+3        │
│  Subsection header                          │
│                                             │
└────────────────────────────────────────────┘
```

### List Section
```
┌────────────────────────────────────────────┐
│ LIST BUTTONS                                │
├────────────────────────────────────────────┤
│                                             │
│  [•]     Bullet List     Ctrl+Shift+8      │
│  Unordered list                             │
│                                             │
│  [1.]    Ordered List    Ctrl+Shift+7      │
│  Numbered list                              │
│                                             │
│  Nesting: Tab to indent, Shift+Tab to     │
│  outdent                                    │
│                                             │
└────────────────────────────────────────────┘
```

### Alignment Section
```
┌────────────────────────────────────────────┐
│ ALIGNMENT BUTTONS                           │
├────────────────────────────────────────────┤
│                                             │
│  [<<]    Align Left                        │
│  └─ Default alignment                       │
│                                             │
│  [>>]    Align Center                      │
│  └─ Center text on page                     │
│                                             │
│  [>>>]   Align Right                       │
│  └─ Right side alignment                    │
│                                             │
└────────────────────────────────────────────┘
```

### Utility Section
```
┌────────────────────────────────────────────┐
│ UTILITY BUTTONS                             │
├────────────────────────────────────────────┤
│                                             │
│  [─]     Horizontal Rule                   │
│  Insert divider line                        │
│                                             │
│  [🔗]    Link            Ctrl+K             │
│  Add hyperlink (prompts for URL)            │
│                                             │
│  [⊞]     Table                              │
│  Insert 3x3 table                           │
│                                             │
└────────────────────────────────────────────┘
```

## Table Toolbar (Conditional)

When your cursor is inside a table, this toolbar appears:

```
┌─ TABLE TOOLS ──────────────────────────────────────┐
│                                                     │
│  Table tools:  [↑ Row]  [↓ Row]  [← Col]  [→ Col]  │
│                                      [🗑]          │
│                                                     │
│  ↑ Row     Add row above current position           │
│  ↓ Row     Add row below current position           │
│  ← Col     Add column to the left                   │
│  → Col     Add column to the right                  │
│  🗑        Delete entire table                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Complete Button Reference

| Icon | Name | Shortcut | Function |
|------|------|----------|----------|
| **B** | Bold | Ctrl+B | Make text bold |
| *I* | Italic | Ctrl+I | Make text italic |
| ~~—~~ | Strikethrough | - | Draw line through text |
| <> | Code | Ctrl+` | Format as inline code |
| **H2** | Heading 2 | Ctrl+Alt+2 | Large section header |
| **H3** | Heading 3 | Ctrl+Alt+3 | Subsection header |
| • | Bullet List | Ctrl+Shift+8 | Unordered list |
| 1. | Ordered List | Ctrl+Shift+7 | Numbered list |
| ⬅ | Align Left | - | Align to left |
| ⬅➡ | Align Center | - | Center text |
| ➡ | Align Right | - | Align to right |
| − | Horizontal Rule | - | Insert divider |
| 🔗 | Link | Ctrl+K | Add hyperlink |
| ⊞ | Table | - | Insert table |

## Toolbar Sections Explained

### What Each Section Does

```
SECTION 1: TEXT FORMATTING
Purpose: Change how text looks
Use for: Emphasizing words, code snippets
Example: **Bold important point**

         SEPARATOR
         ────────────────────

SECTION 2: DOCUMENT STRUCTURE  
Purpose: Organize content hierarchically
Use for: Creating document outline
Example: # Title
         ## Section
         ### Subsection

         SEPARATOR
         ────────────────────

SECTION 3: LISTS
Purpose: Create ordered and unordered lists
Use for: Steps, features, items
Example: • First item
         • Second item
           - Nested item

         SEPARATOR
         ────────────────────

SECTION 4: ALIGNMENT
Purpose: Position text on page
Use for: Titles, emphasis, columns
Example: Text centered on page
         or aligned to right →

         SEPARATOR
         ────────────────────

SECTION 5: UTILITIES
Purpose: Advanced content insertion
Use for: Links, data, visual breaks
Example: Link to documentation
         3x3 table with data
```

## Button States

### Normal State
```
Button appears with light gray background
Text is black/gray depending on theme
Not bold, not highlighted
```

### Active/Selected State
```
Button appears with blue background (primary color)
Indicates the current formatting is active
Example: If text is bold, the [B] button is highlighted
```

### Hover State
```
Button brightens on mouseover
Shows available for interaction
Tooltip appears after 1 second (Ctrl+B)
```

### Disabled State
```
Not used in this editor (all buttons always available)
Buttons work based on context (table buttons only in tables)
```

## Keyboard Navigation

### Using Tab Key
```
1. Click in editor area
2. Press Tab repeatedly to cycle through buttons
3. Press Enter to activate selected button
4. Press Escape to return to editor
```

### Using Alt+Key Combinations
```
Alt+B = Bold toggle
Alt+I = Italic toggle
Alt+Shift+8 = Bullet list
Alt+Shift+7 = Ordered list
Alt+2 = Heading 2
Alt+3 = Heading 3
```

## Visual Feedback

### When Formatting is Active
```
Selected text: "This is BOLD text"
                        ↑
                      In text view:
                    Shows as bold

In toolbar:
[B] ← Highlighted in blue
    Indicates bold is active
```

### When Table is Active
```
Cursor in table cell:
┌─────────┬─────────┐
│ Cell 1  │ Cell 2  │ ← Cursor here
├─────────┼─────────┤
│ Cell 3  │ Cell 4  │
└─────────┴─────────┘

Table toolbar appears above editor:
┌─ TABLE TOOLS ──────────────────────────┐
│ Table tools: [↑ Row] [↓ Row] [← Col]...│
└────────────────────────────────────────┘
```

## Mobile & Responsive Design

### Desktop (1024px+)
- All buttons visible
- Single row toolbar
- Full-width editor

### Tablet (768px-1023px)
- Most buttons visible
- Toolbar may wrap to 2 lines
- Horizontal scroll if needed

### Mobile (< 768px)
- Essential buttons visible
- More toolbar on 2-3 lines
- Touch-friendly button sizes

## Toolbar Customization (For Developers)

### Adding a New Button
```tsx
<Button
  size="sm"
  variant={editor.isActive('featureName') ? 'primary' : 'ghost'}
  onClick={() => editor.chain().focus().toggleFeature().run()}
  title="Feature Name (Ctrl+Shift+F)"
  className="flex-shrink-0"
>
  Icon_Component
</Button>
```

### Grouping Buttons
```tsx
// Add separator between groups
<div className="w-px bg-gray-300 dark:bg-gray-600 mx-1 flex-shrink-0" />
```

### Button Styling
- Size: `sm` for toolbar
- Variant: `ghost` (default) or `primary` (when active)
- No minimum width to fit in compact toolbar

## Accessibility Features

### Screen Reader Support
- All buttons have title attributes
- Tool descriptions in tooltips
- Semantic HTML structure

### Keyboard Navigation
- Tab through all buttons
- Enter to activate
- Keyboard shortcuts for common actions
- Focus indicators on buttons

### Color Contrast
- Light mode: Dark text on light background
- Dark mode: Light text on dark background
- Blue highlight for active state
- Red for delete actions

---

**Toolbar Reference Version:** 1.0
**Last Updated:** October 24, 2026
