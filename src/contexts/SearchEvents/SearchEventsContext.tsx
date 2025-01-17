import { createContext, useContext, useMemo, useState } from "react";

import { Event, EventFree } from "../../types/globalTypes";
import { createCategoryLookup, getUniqueLocations } from "./helpers";
import { useEventsFree } from "./hooks/useEventsFree";
import { useFilterEvents } from "./hooks/useFilterEvents";

interface DateFilters {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

interface SearchContextProps extends DateFilters {
  query: string;
  setQuery: (query: string) => void;
  filteredEvents: Event[] | EventFree[];
  showEventsFree: boolean;
  setShowEventsFree: (value: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  locations: { label: string; value: string }[];
}

interface SearchProviderProps {
  children: React.ReactNode;
  eventsDb: Event[];
  categories: { _id: string; name: string }[];
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

export const SearchProvider = ({
  children,
  eventsDb,
  categories,
}: SearchProviderProps) => {
  // State management
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEventsFree, setShowEventsFree] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");

  // Derived values
  const categoryLookup = useMemo(
    () => createCategoryLookup(categories),
    [categories]
  );
  const locations = useMemo(() => getUniqueLocations(eventsDb), [eventsDb]);

  // Calculate free events
  const eventsFree = useEventsFree({
    eventsDb,
    startDate,
    endDate,
    query,
  });

  // Filter events based on all criteria
  const filteredEvents = useFilterEvents({
    events: showEventsFree ? eventsFree : eventsDb,
    query,
    startDate,
    endDate,
    showEventsFree,
    selectedCategory,
    selectedLocation,
    categoryLookup,
  });

  const contextValue = useMemo(
    () => ({
      query,
      setQuery,
      filteredEvents,
      startDate,
      setStartDate,
      endDate,
      setEndDate,
      showEventsFree,
      setShowEventsFree,
      selectedCategory,
      setSelectedCategory,
      selectedLocation,
      setSelectedLocation,
      locations,
    }),
    [
      query,
      filteredEvents,
      startDate,
      endDate,
      showEventsFree,
      selectedCategory,
      selectedLocation,
      locations,
    ]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
