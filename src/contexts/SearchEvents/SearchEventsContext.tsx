import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
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
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
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
  categories: { _id: string; name: string }[];
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

  const categoryLookup = useMemo(
    () => createCategoryLookup(categories),
    [categories]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("");

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

      // Match categories
      const categoryId = event.category._id;
      const categoryName = categoryLookup[categoryId];
      const matchesCategoryQuery = textKeywords.some((keyword) =>
        categoryName.toLowerCase().includes(keyword.toLowerCase())
      );
      const matchesCategorySelect =
        !selectedCategory ||
        categoryName.toLowerCase() === selectedCategory.toLowerCase();

      // Match event date range
      const eventStartDate = new Date(event.date.start);
      const eventEndDate = new Date(event.date.end || event.date.start);

      // Match parsed date range from query (e.g., "today")
      const matchesQueryDateRange =
        endDateComponents && startDateComponents
          ? isDateInRange(
              eventStartDate,
              startDateComponents,
              endDateComponents
            ) || // Start date falls in range
            isDateInRange(
              eventEndDate,
              startDateComponents,
              endDateComponents
            ) || // End date falls in range
            (eventStartDate <= new Date(dateQuery.end) &&
              eventEndDate >= new Date(dateQuery.start)) // Event overlaps query range
          : matchesDateComponents(startDateComponents, eventStartDate) ||
            matchesDateComponents(startDateComponents, eventEndDate);

      // Match manual date range (e.g., Start and End selected manually)
      const matchesManualDateRange =
        (!startDate || eventEndDate >= startDate) && // Event still ongoing after startDate
        (!endDate || eventStartDate <= endDate); // Event starts before endDate

      // Combine all match conditions
      const matchesAll =
        (textKeywords.length === 0 ||
          matchesTextQuery ||
          matchesCategoryQuery) &&
        matchesCategorySelect &&
        matchesQueryDateRange &&
        matchesManualDateRange;

      return matchesAll;
    });

    setFilteredEvents(filtered);
  }, [
    query,
    startDate,
    endDate,
    initialEvents,
    categories,
    categoryLookup,
    selectedCategory,
  ]);

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
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
