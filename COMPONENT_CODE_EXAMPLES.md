# Multi-Select Dropdown - Code Reference Guide

## Quick Copy-Paste Examples

### Example 1: Basic Usage (Standalone)

```tsx
import React, { useState } from 'react';
import { MultiSelectDropdown } from '../components/multi-select-dropdown';

function SelectItemsPage() {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  
  const items = [
    { id: 1, title: 'Apple', description: 'Fruit' },
    { id: 2, title: 'Banana', description: 'Fruit' },
    { id: 3, title: 'Carrot', description: 'Vegetable' },
  ];

  const handleSubmit = () => {
    console.log('Selected IDs:', selectedIds);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Select Items</h1>
      
      <MultiSelectDropdown
        items={items}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        label="Choose Items"
        placeholder="Search items..."
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
}

export default SelectItemsPage;
```

### Example 2: Inside a Modal (Device Management Pattern)

```tsx
import { MultiSelectDropdown } from '../components/multi-select-dropdown';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Button } from '../components/ui/button';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [items, setItems] = useState([]);

  const handleAssign = async () => {
    // Make API call with selected IDs
    const response = await fetch('/api/assign', {
      method: 'POST',
      body: JSON.stringify({ ids: selectedIds.map(id => Number(id)) })
    });
    
    if (response.ok) {
      setIsModalOpen(false);
      setSelectedIds([]);
    }
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        Assign Items
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Items</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <MultiSelectDropdown
              items={items}
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              label="Select Items to Assign"
              placeholder="Search items..."
              maxHeight="300px"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign}>
              Assign ({selectedIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Example 3: With Async Data Loading

```tsx
import { useEffect } from 'react';

function AsyncDropdownExample() {
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/items');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to load items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <MultiSelectDropdown
      items={items}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      label="Choose from Server"
    />
  );
}
```

### Example 4: With Validation

```tsx
function ValidatedDropdown() {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [error, setError] = useState('');
  
  const items = [/* ... */];

  const handleValidate = () => {
    // Minimum selection required
    if (selectedIds.length === 0) {
      setError('Please select at least one item');
      return;
    }

    // Maximum selection allowed
    if (selectedIds.length > 5) {
      setError('You can select maximum 5 items');
      return;
    }

    setError('');
    console.log('Valid selection:', selectedIds);
  };

  return (
    <div>
      <MultiSelectDropdown
        items={items}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        label="Select Items (Min: 1, Max: 5)"
      />
      
      {error && (
        <p className="mt-2 text-red-600 text-sm">{error}</p>
      )}

      <button
        onClick={handleValidate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Validate
      </button>
    </div>
  );
}
```

### Example 5: Multi-Column Data with Better Display

```tsx
interface User {
  id: number;
  name: string;
  email: string;
}

function UserSelectionDropdown() {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  
  // Map User objects to component format
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
  ];

  const formattedUsers = users.map(user => ({
    id: user.id,
    title: user.name,
    description: user.email,
  }));

  return (
    <MultiSelectDropdown
      items={formattedUsers}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      label="Assign Users"
      placeholder="Search by name or email..."
    />
  );
}
```

### Example 6: Integrating with React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form';

function FormWithDropdown() {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      selectedItems: []
    }
  });

  const items = [/* ... */];

  const onSubmit = (data: any) => {
    console.log('Form data:', data.selectedItems);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="selectedItems"
        control={control}
        render={({ field: { value, onChange } }) => (
          <MultiSelectDropdown
            items={items}
            selectedIds={value}
            onSelectionChange={onChange}
            label="Required Selection"
          />
        )}
      />

      <button type="submit" className="mt-4">
        Submit
      </button>
    </form>
  );
}
```

## Hook Patterns

### Custom Hook for Dropdown State

```tsx
// useMultiSelect.ts
import { useState, useCallback } from 'react';

export function useMultiSelect(initialValues: (string | number)[] = []) {
  const [selectedIds, setSelectedIds] = useState(initialValues);

  const add = useCallback((id: string | number) => {
    setSelectedIds(prev => [...new Set([...prev, id])]);
  }, []);

  const remove = useCallback((id: string | number) => {
    setSelectedIds(prev => prev.filter(item => item !== id));
  }, []);

  const reset = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const toggle = useCallback((id: string | number) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  }, []);

  return { selectedIds, setSelectedIds, add, remove, reset, toggle };
}

// Usage
function Example() {
  const { selectedIds, setSelectedIds, add, remove, reset } = useMultiSelect();

  return (
    <>
      <MultiSelectDropdown
        items={items}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
      <button onClick={reset}>Clear All</button>
    </>
  );
}
```

### Custom Hook for Async Items

```tsx
// useAsyncItems.ts
import { useState, useEffect } from 'react';

export function useAsyncItems(apiUrl: string) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setItems(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [apiUrl]);

  return { items, loading, error };
}

// Usage
function DynamicDropdown() {
  const { items, loading } = useAsyncItems('/api/items');
  const { selectedIds, setSelectedIds } = useMultiSelect();

  if (loading) return <div>Loading...</div>;

  return (
    <MultiSelectDropdown
      items={items}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

## Common Patterns

### Pattern 1: Pre-selected Items

```tsx
const [selectedIds, setSelectedIds] = useState<(string | number)[]>([1, 3, 5]);

<MultiSelectDropdown
  items={items}
  selectedIds={selectedIds}
  onSelectionChange={setSelectedIds}
/>
```

### Pattern 2: Disable After Selection

```tsx
const [isComplete, setIsComplete] = useState(false);

<MultiSelectDropdown
  items={items}
  selectedIds={selectedIds}
  onSelectionChange={(ids) => {
    setSelectedIds(ids);
    if (ids.length > 0) setIsComplete(true);
  }}
/>

<button disabled={!isComplete}>Submit</button>
```

### Pattern 3: Dependent Dropdowns

```tsx
function TwoDependentDropdowns() {
  const [category, setCategory] = useState<(string | number)[]>([]);
  const [items, setItems] = useState<(string | number)[]>([]);

  const handleCategoryChange = async (ids: (string | number)[]) => {
    setCategory(ids);
    setItems([]); // Reset items when category changes
    
    // Fetch items for this category
    if (ids.length > 0) {
      const res = await fetch(`/api/items?category=${ids[0]}`);
      const data = await res.json();
      setItems(data);
    }
  };

  return (
    <>
      <MultiSelectDropdown
        items={categories}
        selectedIds={category}
        onSelectionChange={handleCategoryChange}
        label="Select Category"
      />

      {category.length > 0 && (
        <MultiSelectDropdown
          items={items}
          selectedIds={selectedItems}
          onSelectionChange={setSelectedItems}
          label="Select Items"
        />
      )}
    </>
  );
}
```

### Pattern 4: Search-Highlight Items

```tsx
// Extend component to highlight search term
const highlightText = (text: string, highlight: string) => {
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === highlight.toLowerCase()
      ? <mark key={i} className="bg-yellow-200">{part}</mark>
      : part
  );
};
```

### Pattern 5: Export Selection as CSV

```tsx
const exportAsCSV = (items: any[], selectedIds: (string | number)[]) => {
  const selected = items.filter(item => selectedIds.includes(item.id));
  const csv = selected.map(item => `${item.id},${item.title}`).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'selection.csv';
  a.click();
};
```

## Event Handling Patterns

### Custom Event Emitter

```tsx
const [events, setEvents] = useState<string[]>([]);

<MultiSelectDropdown
  items={items}
  selectedIds={selectedIds}
  onSelectionChange={(ids) => {
    setSelectedIds(ids);
    setEvents([...events, `Selection changed: ${ids.length} items`]);
  }}
/>
```

### Debounced Search Integration

```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback((query) => {
  console.log('Search query:', query);
  // Perform search operation
}, 300);
```

## Performance Optimization

### Memoization Pattern

```tsx
import { useMemo, useCallback } from 'react';

function OptimizedDropdown() {
  const items = useMemo(() => 
    largeDataset.map(item => ({
      id: item.id,
      title: item.name,
      description: item.desc
    })),
    [largeDataset]
  );

  const handleChange = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  return (
    <MultiSelectDropdown
      items={items}
      selectedIds={selectedIds}
      onSelectionChange={handleChange}
    />
  );
}
```

## Error Handling Patterns

### Try-Catch with API

```tsx
const assignItems = async () => {
  try {
    const response = await fetch('/api/assign', {
      method: 'POST',
      body: JSON.stringify({ ids: selectedIds })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Failed to assign:', error);
    toast.error(error.message || 'Failed to assign items');
  }
};
```

---

**Use these examples to quickly integrate the component into your project!**
