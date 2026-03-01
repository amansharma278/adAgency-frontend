import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';

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

export function MultiSelectDropdown({
  items,
  selectedIds,
  onSelectionChange,
  placeholder = 'Search and select items...',
  label = 'Select Items',
  maxHeight = '192px',
}: MultiSelectDropdownProps) {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [localSelectedIds, setLocalSelectedIds] = useState<(string | number)[]>(selectedIds);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update local state when selectedIds prop changes
  useEffect(() => {
    setLocalSelectedIds(selectedIds);
  }, [selectedIds]);

  // Filter items based on search value (case-insensitive)
  const filteredItems = items.filter((item) => {
    const searchTerm = searchValue.toLowerCase();
    const itemName = (item.title || item.name || '').toLowerCase();
    const itemDescription = (item.description || '').toLowerCase();
    return itemName.includes(searchTerm) || itemDescription.includes(searchTerm);
  });

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Check if all filtered items are selected
  const allFilteredSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => localSelectedIds.includes(item.id));

  // Check if some filtered items are selected (for indeterminate state)
  const someFilteredSelected =
    filteredItems.length > 0 &&
    filteredItems.some((item) => localSelectedIds.includes(item.id)) &&
    !allFilteredSelected;

  // Get selected item objects for tag display
  const selectedItems = items.filter((item) => localSelectedIds.includes(item.id));

  // Handle item selection toggle
  const handleItemToggle = (itemId: string | number) => {
    const newSelectedIds = localSelectedIds.includes(itemId)
      ? localSelectedIds.filter((id) => id !== itemId)
      : [...localSelectedIds, itemId];

    setLocalSelectedIds(newSelectedIds);
    onSelectionChange(newSelectedIds);
  };

  // Handle Select All / Deselect All
  const handleSelectAllToggle = () => {
    if (allFilteredSelected) {
      // Deselect all filtered items
      const newSelectedIds = localSelectedIds.filter(
        (id) => !filteredItems.map((item) => item.id).includes(id)
      );
      setLocalSelectedIds(newSelectedIds);
      onSelectionChange(newSelectedIds);
    } else {
      // Select all filtered items
      const newIds = [
        ...new Set([
          ...localSelectedIds,
          ...filteredItems.map((item) => item.id),
        ]),
      ];
      setLocalSelectedIds(newIds);
      onSelectionChange(newIds);
    }
  };

  // Handle tag removal
  const handleRemoveTag = (itemId: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    handleItemToggle(itemId);
  };

  // Get display name for an item
  const getItemName = (item: SelectItem): string => {
    return item.title || item.name || String(item.id);
  };

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {/* Input Container with Tags */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 cursor-pointer min-h-[42px] flex items-center flex-wrap gap-2 transition-colors hover:border-gray-400 dark:hover:border-gray-500"
      >
        {/* Selected Tags */}
        {selectedItems.length > 0 ? (
          <>
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm font-medium"
              >
                <span>{getItemName(item)}</span>
                <button
                  onClick={(e) => handleRemoveTag(item.id, e)}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  type="button"
                  aria-label={`Remove ${getItemName(item)}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <input
              ref={inputRef}
              type="text"
              placeholder=""
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="flex-1 min-w-[120px] outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
            />
          </>
        ) : (
          <>
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
            />
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          {/* Select All */}
          {filteredItems.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700 p-3">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={handleSelectAllToggle}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    aria-label="Select all items"
                  />
                  {/* Indeterminate visual indicator */}
                  {someFilteredSelected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select All
                </span>
              </label>
            </div>
          )}

          {/* Items List */}
          <div
            className="overflow-y-auto"
            style={{ maxHeight }}
          >
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={localSelectedIds.includes(item.id)}
                    onChange={() => handleItemToggle(item.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {getItemName(item)}
                    </p>
                    {item.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                </label>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No items found
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
