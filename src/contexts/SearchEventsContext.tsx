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
}

export const SearchProvider = ({
  children,
  initialEvents,
}: SearchProviderProps) => {
  const [query, setQuery] = useState("");

  const [filteredEvents, setFilteredEvents] = useState<Event[]>(initialEvents);

  useEffect(() => {
    const lowerQuery = query.toLowerCase();

    const filtered = initialEvents.filter((event) =>
      ["title", "location.venue", "location.city"].some((key) => {
        const value = key
          .split(".")
          .reduce(
            (obj, k) => obj?.[k as keyof typeof obj],
            event as Record<string, any>
          );
        return value?.toString().toLowerCase().includes(lowerQuery);
      })
    );

    setFilteredEvents(filtered);
  }, [query, initialEvents]);

  return (
    <SearchContext.Provider
      value={{ query, setQuery, filteredEvents, setFilteredEvents }}
    >
      {children}
    </SearchContext.Provider>
  );
};
