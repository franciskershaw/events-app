import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Event } from "../../types/globalTypes";
import {
  createCategoryLookup,
  getNestedValue,
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
    const { textQuery, dateQuery } = splitQueryParts(query);
    const queryComponents = parseDateComponents(dateQuery);
    const textKeywords = textQuery.split(/\s+/).filter(Boolean);

    const filtered = initialEvents.filter((event) => {
      // Match text fields (title, venue, city) against each keyword
      const matchesTextQuery = textKeywords.every((keyword) =>
        ["title", "location.venue", "location.city"].some((key) => {
          const value = getNestedValue(event, key);
          return value?.toString().toLowerCase().includes(keyword);
        })
      );

      // Match categories against each keyword
      const categoryId = event.category._id;
      const categoryName = categoryLookup[categoryId];
      const matchesCategory = textKeywords.some((keyword) =>
        categoryName.includes(keyword)
      );

      // Match event dates
      const eventDate = new Date(event.date.start);
      const matchesDate = matchesDateComponents(queryComponents, eventDate);

      // Combine matches - all conditions must be true
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
