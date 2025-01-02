import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Event } from "../types/globalTypes";

interface SearchContextProps {
  query: string;
  setQuery: (query: string) => void;
  filteredEvents: Event[];
  setFilteredEvents: (events: Event[]) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

interface SearchProviderProps {
  children: ReactNode;
  initialEvents: Event[];
  categories: { _id: { $oid: string }; name: string }[];
}

export const SearchProvider = ({
  children,
  initialEvents,
  categories,
}: SearchProviderProps) => {
  const [query, setQuery] = useState("");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(initialEvents);

  // Create a lookup table for category IDs to names
  const categoryLookup = categories.reduce(
    (acc, category) => {
      acc[category._id.$oid] = category.name.toLowerCase(); // Map ID -> lowercase name
      return acc;
    },
    {} as Record<string, string>
  );

  useEffect(() => {
    const lowerQuery = query.toLowerCase();

    const filtered = initialEvents.filter((event) => {
      // Check for query match in title, venue, and city
      const matchesQuery = ["title", "location.venue", "location.city"].some(
        (key) => {
          const value = key
            .split(".")
            .reduce(
              (obj, k) => obj?.[k as keyof typeof obj],
              event as Record<string, any>
            );
          return value?.toString().toLowerCase().includes(lowerQuery);
        }
      );

      // Lookup the category name using the event's category ID
      const categoryId = event.category._id; // Extract category ID
      const categoryName = categoryLookup[categoryId]; // Get category name

      // Check if the query matches the category name
      const matchesCategory = categoryName && categoryName.includes(lowerQuery);

      // Return true if query matches text fields or category name
      return matchesQuery || matchesCategory;
    });

    setFilteredEvents(filtered);
  }, [query, initialEvents, categories]);

  return (
    <SearchContext.Provider
      value={{ query, setQuery, filteredEvents, setFilteredEvents }}
    >
      {children}
    </SearchContext.Provider>
  );
};
