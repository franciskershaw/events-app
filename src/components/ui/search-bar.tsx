import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  query: string;
  setQuery: (query: string) => void;
}

const SearchBar = ({
  placeholder = "Search...",
  query,
  setQuery,
}: SearchBarProps) => {
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
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="ml-2 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export { SearchBar };
