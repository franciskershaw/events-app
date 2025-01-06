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
  isDateInRange,
  matchesDateComponents,
  parseDateComponents,
  splitQueryParts,
} from "./helpers";

interface DateFilters {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

interface SearchContextProps extends DateFilters {
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
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Create category lookup
  const categoryLookup = createCategoryLookup(categories);

  useEffect(() => {
    const { textQuery, dateQuery } = splitQueryParts(query);
    const startDateComponents = parseDateComponents(dateQuery.start);
    const endDateComponents = dateQuery.end
      ? parseDateComponents(dateQuery.end)
      : null;
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

      // Match parsed dates from query
      const matchesStartDate = matchesDateComponents(
        startDateComponents,
        eventDate
      );

      const matchesInRange =
        endDateComponents &&
        isDateInRange(eventDate, startDateComponents, endDateComponents);

      // Match manual start and end dates
      const matchesManualDateRange =
        (!startDate || eventDate >= startDate) &&
        (!endDate || eventDate <= endDate);

      // Combine matches - all conditions must be true
      const matchesAll =
        (textKeywords.length === 0 || matchesTextQuery || matchesCategory) &&
        (endDateComponents ? matchesInRange : matchesStartDate) &&
        matchesManualDateRange;

      return matchesAll;
    });

    setFilteredEvents(filtered);
  }, [query, startDate, endDate, initialEvents, categories]);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        filteredEvents,
        setFilteredEvents,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
