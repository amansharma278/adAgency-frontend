# Multi-Select Dropdown Component Documentation

## Overview

The `MultiSelectDropdown` component provides an advanced, searchable multi-select dropdown with a clean and interactive UI. It's built with React hooks and Tailwind CSS, without external UI libraries.

## Component Features

### ✨ Key Features

1. **Searchable Dropdown** - Case-insensitive search filtering
2. **Multi-Select with Tags** - Selected items display as removable tags in the input area
3. **Select All Functionality** - Select/deselect all filtered items at once
4. **Indeterminate State** - Shows when some (but not all) items are selected
5. **Smart Filtering** - Filters items by name and description
6. **Click Outside Detection** - Dropdown closes when clicking outside
7. **Light/Dark Mode** - Full Tailwind dark mode support
8. **Keyboard Accessible** - Proper ARIA labels and form inputs
9. **Scrollable List** - Configurable max-height with overflow
10. **No Duplicates** - Prevents duplicate selections automatically
11. **Empty State** - Shows "No items found" message when no matches

## File Location

- Component: `src/app/components/multi-select-dropdown.tsx`
- Integration: `src/app/pages/device-management.tsx`

## Component Props

```typescript
interface MultiSelectDropdownProps {
  items: SelectItem[];           // Array of items to select from
  selectedIds: (string | number)[]; // Array of currently selected item IDs
  onSelectionChange: (selectedIds: (string | number)[]) => void; // Callback when selection changes
  placeholder?: string;          // Placeholder text (default: 'Search and select items...')
  label?: string;               // Label above the dropdown (default: 'Select Items')
  maxHeight?: string;           // Max height of dropdown (default: '192px')
}

interface SelectItem {
  id: string | number;          // Unique identifier
  title?: string;               // Display name (preferred over 'name')
  name?: string;                // Alternative display name
  description?: string;         // Additional description text
}
```

## Usage Example

### Basic Implementation

```tsx
import { MultiSelectDropdown } from '../components/multi-select-dropdown';

function MyComponent() {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  
  const items = [
    { id: 1, title: 'Item One', description: 'First item' },
    { id: 2, title: 'Item Two', description: 'Second item' },
    { id: 3, title: 'Item Three', description: 'Third item' },
  ];

  const handleSubmit = async () => {
    // Use selectedIds for API call
    const response = await fetch('/api/save', {
      method: 'POST',
      body: JSON.stringify({ ids: selectedIds })
    });
  };

  return (
    <form>
      <MultiSelectDropdown
        items={items}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        label="Choose Items"
        placeholder="Search items..."
      />
      <button type="submit" onClick={handleSubmit}>Save</button>
    </form>
  );
}
```

### Advanced Implementation (As Used in Device Management)

```tsx
const [storedAds, setStoredAds] = useState<(string | number)[]>([]);
const [adsList, setAdsList] = useState<VideoRes[]>([]);

<MultiSelectDropdown
  items={adsList}
  selectedIds={storedAds}
  onSelectionChange={setStoredAds}
  label="Select Advertisements to Assign"
  placeholder="Search advertisements..."
  maxHeight="240px"
/>

const handleAssignAd = async () => {
  const response = await makePostAuthrized(
    `/device/${selectedDevice?.id}/assign-ad/`,
    {
      ads: storedAds.map((id) => Number(id))
    }
  );
};
```

## Component Structure

### Input Container (Line 165-201)
- Displays selected items as interactive tags
- Search input field integrated seamlessly
- Shows chevron icon when no items selected
- Responsive flex layout

### Tag Display (Line 171-187)
- Blue-colored tags for selected items
- X icon button for removing individual tags
- Smooth hover effects
- Click propagation stops when removing tags

### Dropdown Menu (Line 203-249)
- Select All section at top (when items exist)
- Main list of filtered items
- Checkbox + description for each item
- Empty state message when no matches
- Scrollable with configurable max-height

### Select All Logic (Line 71-91)
```typescript
// Checks if ALL filtered items are selected
const allFilteredSelected = filteredItems.every((item) =>
  localSelectedIds.includes(item.id)
);

// Checks if SOME filtered items are selected
const someFilteredSelected = 
  filteredItems.some((item) => localSelectedIds.includes(item.id)) &&
  !allFilteredSelected;
```

### Search Filtering (Line 40-47)
```typescript
const filteredItems = items.filter((item) => {
  const searchTerm = searchValue.toLowerCase();
  const itemName = (item.title || item.name || '').toLowerCase();
  const itemDescription = (item.description || '').toLowerCase();
  return itemName.includes(searchTerm) || itemDescription.includes(searchTerm);
});
```

### Click Outside Detection (Line 53-65)
Uses `useRef` to detect clicks outside the component and close the dropdown.

## Event Handlers

### `handleItemToggle(itemId)`
- Adds or removes item from selection
- Calls `onSelectionChange` callback
- Line 102-109

### `handleSelectAllToggle()`
- Toggles all filtered items
- Respects current filter state
- Deselects if all are selected, selects otherwise
- Line 111-131

### `handleRemoveTag(itemId, e)`
- Removes tag when X clicked
- Stops event propagation
- Line 133-138

### `handleClickOutside(event)`
- Closes dropdown when clicking outside
- Registered only when dropdown is open
- Cleanup on component unmount
- Line 53-65

## Styling Details

### Color Scheme
- **Light Mode**: White backgrounds, gray text
- **Dark Mode**: Gray-800 backgrounds, white text
- **Hover**: Gray-50 (light) / Gray-700 (dark)
- **Selected Tags**: Blue-100 (light) / Blue-900 (dark)

### Responsive Behavior
- Flex layout adapts to content width
- Tags wrap automatically
- Input expands to fill available space
- Modal overlay for dropdown (z-50)

### Accessibility
- ARIA labels on buttons and inputs
- Keyboard navigation support
- Semantic HTML with proper labels
- Clear visual feedback (checkboxes, hover states)

## Type Safety

The component is fully typed with TypeScript:

```typescript
interface SelectItem {
  id: string | number;
  title?: string;
  name?: string;
  description?: string;
}

interface MultiSelectDropdownProps {
  items: SelectItem[];
  selectedIds: (string | number)[];
  onSelectionChange: (selectedIds: (string | number)[]) => void;
  placeholder?: string;
  label?: string;
  maxHeight?: string;
}
```

## Edge Cases Handled

1. **Duplicate Prevention**: `Set` used in Select All logic
2. **Empty Results**: "No items found" message displayed
3. **Large Lists**: Configurable scrolling with max-height
4. **Null Values**: Safe fallbacks for missing title/name
5. **Type Coercion**: IDs can be string or number
6. **Indeterminate State**: Visual indicator for partial selection
7. **Event Bubbling**: Proper event propagation control

## State Management

### Local Component State
```typescript
const [isOpen, setIsOpen] = useState(false);           // Dropdown visibility
const [searchValue, setSearchValue] = useState('');    // Search input
const [localSelectedIds, setLocalSelectedIds] = useState<(string | number)[]>(selectedIds);
```

### Props Sync
```typescript
useEffect(() => {
  setLocalSelectedIds(selectedIds);
}, [selectedIds]);
```

This ensures the component stays in sync if parent updates selection.

## Performance Considerations

1. **Filtered List**: Uses `.filter()` - O(n) complexity
2. **Lookup Operations**: Uses `.includes()` - O(n) for array, consider using Set for large lists
3. **Event Listeners**: Properly cleaned up in useEffect
4. **Re-renders**: Optimized through careful state management

## Dark Mode Support

The component fully supports Tailwind's dark mode:

```tsx
className="bg-white dark:bg-gray-800"
className="text-gray-900 dark:text-white"
className="border-gray-300 dark:border-gray-600"
```

## Common Use Cases

### Use Case 1: Advertisement Selection (Current Implementation)
```tsx
<MultiSelectDropdown
  items={adsList}
  selectedIds={storedAds}
  onSelectionChange={setStoredAds}
  label="Select Advertisements to Assign"
/>
```

### Use Case 2: User/Team Selection
```tsx
<MultiSelectDropdown
  items={users}
  selectedIds={assignedUsers}
  onSelectionChange={setAssignedUsers}
  label="Assign Team Members"
  placeholder="Search users..."
/>
```

### Use Case 3: Category/Tag Selection
```tsx
<MultiSelectDropdown
  items={categories}
  selectedIds={selectedCategories}
  onSelectionChange={setSelectedCategories}
  label="Select Categories"
  maxHeight="300px"
/>
```

## Troubleshooting

### Issue: Dropdown not opening
- Check if `isOpen` state is being updated
- Verify click handler is attached to input container

### Issue: Search not filtering
- Ensure `title`, `name`, or `description` fields exist in items
- Check if search is case-insensitive (it is)

### Issue: Type errors with ID types
- Ensure IDs match `string | number` type
- Convert IDs if needed: `Number(id)` or `String(id)`

### Issue: Click outside not closing
- Verify ref is properly attached to container
- Check if event listener is registered

### Issue: Selection not updating
- Verify `onSelectionChange` callback is properly defined
- Check parent state management

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported (uses modern JavaScript)

## Dependencies

- React 16.8+ (for hooks)
- Tailwind CSS 3.0+ (for styling)
- lucide-react (for icons: X, ChevronDown)

## Future Enhancement Ideas

1. **Virtual Scrolling** - For very large lists (1000+ items)
2. **Keyboard Navigation** - Arrow keys to navigate items
3. **Custom Rendering** - Custom render functions for items
4. **Async Search** - Support for API-based search
5. **Keyboard Shortcuts** - Ctrl/Cmd + A to select all
6. **Custom Themes** - CSS variable support for colors
7. **Animations** - Smooth transitions for dropdown
8. **Touch Support** - Mobile-friendly interactions

## Code Quality

- ✅ No external UI libraries (except lucide-react icons)
- ✅ Full TypeScript support
- ✅ Comprehensive comments
- ✅ Clean code structure
- ✅ Proper error handling
- ✅ Dark mode support
- ✅ Accessibility features
- ✅ Performance optimized

---

**Last Updated**: March 2026  
**Component Version**: 1.0.0  
**Status**: Production Ready
