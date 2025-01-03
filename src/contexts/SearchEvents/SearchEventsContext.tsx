import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { parse } from "date-fns";

import { Event } from "../../types/globalTypes";
import {
  createCategoryLookup,
  matchesDateComponents,
  parseDateComponents,
  splitQueryParts,
} from "./helpers";

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

  // Create category lookup
  const categoryLookup = createCategoryLookup(categories);

  useEffect(() => {
    // Split query into text and date parts
    const { textQuery, dateQuery } = splitQueryParts(query);

    // Parse date components
    const queryComponents = parseDateComponents(dateQuery);

    // Split text query into keywords
    const textKeywords = textQuery.split(/\s+/).filter(Boolean); // Split and remove empty strings

    const filtered = initialEvents.filter((event) => {
      // Match text fields (title, venue, city) against each keyword
      const matchesTextQuery = textKeywords.some((keyword) =>
        ["title", "location.venue", "location.city"].some((key) => {
          const value = key
            .split(".")
            .reduce(
              (obj, k) => obj?.[k as keyof typeof obj],
              event as Record<string, any>
            );
          return value?.toString().toLowerCase().includes(keyword);
        })
      );

      // Match categories against each keyword
      const categoryId = event.category._id; // Extract category ID
      const categoryName = categoryLookup[categoryId]; // Get category name
      const matchesCategory = textKeywords.some((keyword) =>
        categoryName.includes(keyword)
      );

      // Match event dates
      const eventDate = parse(
        event.date.start, // Ensure ISO string format
        "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        new Date()
      );

      const matchesDate = matchesDateComponents(queryComponents, eventDate);

      // Combine matches - ALL conditions must be true
      const matchesAll =
        (textKeywords.length === 0 || matchesTextQuery || matchesCategory) &&
        matchesDate;

      return matchesAll;
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
