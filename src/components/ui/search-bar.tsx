import { cn } from "@/lib/utils";

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  clearFilters: () => void;
  activeFilterCount: number;
}

const SearchBar = ({
  query,
  setQuery,
  clearFilters,
  activeFilterCount,
}: SearchBarProps) => {
  const placeholder = activeFilterCount
    ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} applied`
    : "Search by title, venue, city, category or date";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div
      className={cn(
        "relative flex h-9 w-full items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-ring"
      )}
    >
      <input
        type="text"
        placeholder={placeholder}
        className="flex-grow bg-transparent outline-none"
        value={query}
        onChange={handleChange}
        id="search-bar"
      />
      {(query || activeFilterCount > 0) && (
        <button
          type="button"
          onClick={
            query && activeFilterCount === 0 ? handleClear : clearFilters
          }
          className="ml-2 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export { SearchBar };
