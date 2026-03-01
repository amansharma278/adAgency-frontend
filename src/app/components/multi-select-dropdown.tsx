import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

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
  maxHeight = '400px',
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
        className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 cursor-pointer min-h-[44px] flex items-start flex-wrap gap-2 transition-all hover:border-gray-400 dark:hover:border-gray-500 focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-500"
      >
        {/* Selected Tags Container - Scrollable for many items */}
        <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-700 whitespace-nowrap"
            >
              <span className="truncate max-w-xs">{getItemName(item)}</span>
              <button
                onClick={(e) => handleRemoveTag(item.id, e)}
                className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 p-0.5 rounded-full transition-colors"
                type="button"
                aria-label={`Remove ${getItemName(item)}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={selectedItems.length > 0 ? '' : placeholder}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="grow min-w-[60px] outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm py-1"
        />

        {/* Chevron Icon */}
        {selectedItems.length === 0 && (
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl overflow-hidden flex flex-col" style={{ maxHeight: '600px' }}>
          {/* Header with Counter - Sticky */}
          <div className="sticky top-0 z-40 bg-gray-50 dark:bg-gray-750 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Results
              </span>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Select All */}
            {filteredItems.length > 0 && (
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded transition-colors">
                <div className="relative flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={handleSelectAllToggle}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer accent-blue-600"
                    aria-label="Select all items"
                  />
                  {/* Indeterminate visual indicator */}
                  {someFilteredSelected && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-2 h-2 bg-blue-600 rounded-sm"></div>
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  {allFilteredSelected ? 'Deselect All' : 'Select All'}
                </span>
              </label>
            )}
          </div>

          {/* Items List - Scrollable */}
          <div className="overflow-y-auto flex-1">
            {filteredItems.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredItems.map((item, index) => {
                  const isSelected = localSelectedIds.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors group"
                    >
                      <div className="relative flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleItemToggle(item.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer accent-blue-600"
                        />
                        {isSelected && (
                          <Check className="absolute inset-0 w-4 h-4 text-blue-600 pointer-events-none" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {getItemName(item)}
                        </p>
                        {item.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Selection indicator */}
                      {isSelected && (
                        <div className="flex-shrink-0 hidden sm:flex items-center">
                          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                            Selected
                          </span>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    No items found
                  </p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </div>

          {/* Footer Summary - Sticky */}
          {filteredItems.length > 0 && localSelectedIds.length > 0 && (
            <div className="sticky bottom-0 z-40 bg-gray-50 dark:bg-gray-750 px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {localSelectedIds.length}
                </span>
                {' '}
                of
                {' '}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {items.length}
                </span>
                {' '}
                {items.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
