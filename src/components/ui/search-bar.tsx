import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

const predefinedOptions = [
  { label: "Today", value: "Today" },
  { label: "Tomorrow", value: "Tomorrow" },
  { label: "This week", value: "This week" },
  { label: "This month", value: "This month" },
  { label: "This year", value: "This year" },
  { label: "Next week", value: "Next week" },
  { label: "Next month", value: "Next month" },
  { label: "Next year", value: "Next year" },
];

const SearchBar = ({
  query,
  setQuery,
  clearFilters,
  activeFilterCount,
}: SearchBarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const skipFocusRef = useRef(false);

  const placeholder = activeFilterCount
    ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} applied`
    : "Search by title, venue, city, category or date";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleOptionSelect = (value: string) => {
    setQuery(value);
    setIsDropdownOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    skipFocusRef.current = true;
    setIsDropdownOpen(false);
  };

  const handleFocus = () => {
    if (!skipFocusRef.current) {
      setIsDropdownOpen(true);
    }
    skipFocusRef.current = false;
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      !dropdownRef.current?.contains(e.target as Node) &&
      !searchBarRef.current?.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchBarRef} className="relative w-full" onFocus={handleFocus}>
      {/* Search bar */}
      <div
        className={cn(
          "relative flex h-9 items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-ring"
        )}
      >
        <input
          type="text"
          placeholder={placeholder}
          className="flex-grow bg-transparent outline-none"
          value={query}
          onChange={handleInputChange}
          id="search-bar"
        />
        {(query || activeFilterCount > 0) && (
          <button
            type="button"
            onClick={
              query && activeFilterCount === 0 ? handleClear : clearFilters
            }
            className="ml-2 text-muted-foreground hover:text-foreground focus:outline-none font-sm="
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10"
        >
          {predefinedOptions.map((option) => (
            <button
              key={option.value}
              className="w-full text-left text-sm px-3 py-2 hover:bg-gray-100 focus:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleOptionSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export { SearchBar };
