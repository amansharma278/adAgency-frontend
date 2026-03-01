# Multi-Select Dropdown - Feature Walkthrough

## Component Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│         MultiSelectDropdown Component                    │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    ┌────────┐      ┌──────────┐      ┌──────────┐
    │ Input  │      │  Search  │      │   Tags   │
    │ Field  │      │ Filter   │      │(Display) │
    └────────┘      └──────────┘      └──────────┘
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
            ┌─────────────▼─────────────┐
            │   Dropdown Menu Open?     │
            └─────────────┬─────────────┘
                    │           │
                Yes │           │ No
                    ▼           ▼
            ┌─────────────┐  (Closed)
            │             │
        ┌───┴──┬──────────┘
        │      │
        ▼      ▼
    ┌──────────────────┐
    │  Select All Row  │
    │  (Checkbox)      │
    └──────────────────┘
            │
            ▼
    ┌──────────────────┐
    │ Filtered Items   │
    │ List (Scrollable)│
    │ - Item 1 ☑      │
    │ - Item 2 ☐      │
    │ - Item 3 ☑      │
    └──────────────────┘
            │
        ┌───┴──────────────────┐
        │                      │
        ▼                      ▼
    Click Item           Click Outside
        │                      │
        ▼                      ▼
    Update Selection      Close Dropdown
        │                      │
        └──────────┬───────────┘
                   │
                   ▼
        Display as Tags in Input
        [Tag 1 ✕] [Tag 2 ✕] [Search...]
```

## State Management Flow

```
Component Mounts
      │
      ▼
Initialize States:
  - isOpen = false
  - searchValue = ''
  - localSelectedIds = selectedIds (from props)
      │
      ├─────────────────────────────────────────┐
      │                                         │
      ▼                                         ▼
User Types in Search            User Clicks Tag X
  ▼                                ▼
Update searchValue            Remove from localSelectedIds
  ▼                                ▼
Filter items (case-insensitive)  Re-render with updated tags
  ▼                                │
Re-render dropdown list           ▼
  │                          Call onSelectionChange
  │                               │
  └────────────────┬──────────────┘
                   │
                   ▼
            User Clicks Item
              │
              ├─────────────────────┐
              │                     │
         Already Selected?      Not Selected?
              │                     │
              ▼                     ▼
          Remove ID            Add ID
              │                     │
              └──────────┬──────────┘
                         │
                         ▼
                Update localSelectedIds
                         │
                         ▼
                Call onSelectionChange
                         │
                         ▼
                Parent updates selectedIds
                         │
                         ▼
                Sync with local state
                (useEffect triggered)
```

## Event Pipeline

```
USER INTERACTION → EVENT HANDLER → STATE UPDATE → RE-RENDER

┌─────────────────────────────────────────────────────────────┐
│ INPUT AREA CLICK                                            │
├─────────────────────────────────────────────────────────────┤
│ onClick → setIsOpen(!isOpen) → Dropdown toggles           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SEARCH INPUT CHANGE                                         │
├─────────────────────────────────────────────────────────────┤
│ onChange → setSearchValue(e.target.value)                 │
│         → filteredItems update (re-render)                │
│         → Dropdown auto-opens                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SELECT ALL CHECKBOX                                         │
├─────────────────────────────────────────────────────────────┤
│ onChange → handleSelectAllToggle()                         │
│         → If all selected: remove all filtered             │
│         → If not all: add all filtered                     │
│         → setLocalSelectedIds()                            │
│         → onSelectionChange()                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ITEM CHECKBOX                                               │
├─────────────────────────────────────────────────────────────┤
│ onChange → handleItemToggle(itemId)                        │
│         → Toggle item in array                             │
│         → setLocalSelectedIds()                            │
│         → onSelectionChange()                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ TAG REMOVE (X BUTTON)                                      │
├─────────────────────────────────────────────────────────────┤
│ onClick → handleRemoveTag(itemId, e)                       │
│         → e.stopPropagation() [prevent dropdown toggle]   │
│         → handleItemToggle(itemId)                         │
│         → setLocalSelectedIds()                            │
│         → onSelectionChange()                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CLICK OUTSIDE                                               │
├─────────────────────────────────────────────────────────────┤
│ mousedown (document) → handleClickOutside()               │
│                    → Compare target vs dropdownRef         │
│                    → If outside: setIsOpen(false)          │
└─────────────────────────────────────────────────────────────┘
```

## Data Structure Examples

### Input Data

```typescript
const adsList = [
  {
    id: 1,
    title: 'Summer Campaign 2026',
    description: 'Promotional campaign for summer season'
  },
  {
    id: 2,
    title: 'Back to School',
    description: 'Educational ads targeting students'
  },
  {
    id: 3,
    title: 'Holiday Special',
    description: 'Festive season advertisements'
  }
];
```

### State After Selection

```typescript
// Initial State
selectedIds: [] // nothing selected
searchValue: '' // empty search
isOpen: false   // dropdown closed

// After Search
searchValue: 'sum' // user typed 'sum'
filteredItems: [
  { id: 1, title: 'Summer Campaign 2026', ... }
]

// After Selecting Items
selectedIds: [1, 3]
storedAds: [1, 3]

// Tags Display
[Summer Campaign 2026 ✕] [Holiday Special ✕]

// Select All State
allFilteredSelected: false (only 1 of 1 filtered selected? depends on search)
someFilteredSelected: false (either 0 or all)

// Sent to API
{
  ads: [1, 3] // converted to numbers
}
```

## Styling Breakdown

### Input Container
```
┌─────────────────────────────────────────────────────────┐
│ [Tag1 ✕] [Tag2 ✕] [Search input... ▼]                 │
├─────────────────────────────────────────────────────────┤
│ Border: gray-300 (light), gray-600 (dark)              │
│ Padding: 8px (p-2)                                      │
│ Min-height: 42px                                        │
│ Flex: wrap items, center align                          │
│ Gap: 8px between items                                  │
└─────────────────────────────────────────────────────────┘
```

### Tags
```
┌──────────────────────┐
│ [Tag Name ✕]         │
├──────────────────────┤
│ Background: Blue-100 (light), Blue-900 (dark)         │
│ Color: Blue-800 (light), Blue-200 (dark)              │
│ Padding: 2px 8px                                       │
│ Border-radius: 4px                                     │
│ Font-weight: medium                                    │
│ Close-icon hover: Blue-600 (light), Blue-400 (dark)   │
└──────────────────────┘
```

### Dropdown Container
```
┌─────────────────────────────────────────────────────────┐
│ Select All                                              │
│ [☑] Select All (indeterminate: ▮)                      │
├─────────────────────────────────────────────────────────┤
│ Items (scrollable, max-height: 240px)                  │
│ ┌───────────────────────────────────────────────────┐  │
│ │ [☑] Item 1 Name          Item 1 Description       │  │
│ │ [☐] Item 2 Name          Item 2 Description       │  │
│ │ [☑] Item 3 Name          Item 3 Description       │  │
│ │ [☐] Item 4 Name          Item 4 Description       │  │
│ └───────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│ Background: white (light), gray-800 (dark)             │
│ Border: gray-300 (light), gray-600 (dark)              │
│ Shadow: lg (box-shadow-lg)                             │
│ Z-index: 50 (popup layer)                              │
└─────────────────────────────────────────────────────────┘
```

## Usage in Device Management Modal

### Before (Old Implementation)
```tsx
{adsList.slice(0, 6).map((ad) => (
  <label key={ad.id} className="flex items-center gap-3 p-2">
    <input
      type="checkbox"
      className="rounded"
      onChange={adCheckHandler}
      value={ad.id}
    />
    <span className="text-sm">{ad.title}</span>
    <span className="text-xs ml-auto">{ad.description}</span>
  </label>
))}
```

### After (New Component)
```tsx
<MultiSelectDropdown
  items={adsList}
  selectedIds={storedAds}
  onSelectionChange={setStoredAds}
  label="Select Advertisements to Assign"
  placeholder="Search advertisements..."
  maxHeight="240px"
/>
```

## Advantages of the New Component

| Feature | Before | After |
|---------|--------|-------|
| **Search** | Manual filtering | Built-in, case-insensitive |
| **Select All** | No | Yes, with indeterminate state |
| **Visual Tags** | Checkboxes in list | Interactive tags with X |
| **Scrolling** | Manual | Auto, configurable |
| **Empty State** | Plain list | "No items found" message |
| **Reusability** | Hard-coded | Props-based, reusable |
| **Limit** | Max 6 items shown | All items searchable |
| **UX** | Basic | Advanced, interactive |

## Configuration Examples

### Minimal Configuration
```tsx
<MultiSelectDropdown
  items={items}
  selectedIds={selected}
  onSelectionChange={setSelected}
/>
```

### Full Configuration
```tsx
<MultiSelectDropdown
  items={items}
  selectedIds={selected}
  onSelectionChange={setSelected}
  label="Choose Your Items"
  placeholder="Type to search..."
  maxHeight="400px"
/>
```

## Integration Checklist

- ✅ Component created: `multi-select-dropdown.tsx`
- ✅ Imported in `device-management.tsx`
- ✅ Replaced old checkbox list with component
- ✅ Removed old `adCheckHandler` function
- ✅ Updated state type: `number[]` → `(string | number)[]`
- ✅ Modal dialog properly configured
- ✅ API integration maintained
- ✅ No TypeScript errors
- ✅ Dark mode support included
- ✅ Responsive design implemented

---

**Component Ready for Production** ✓
