import { createContext, useContext, useMemo, useState } from "react";

import { isEventTypeguard } from "../../pages/Events/helpers/helpers";
import { Event, EventFree } from "../../types/globalTypes";
import { createCategoryLookup } from "./helpers";
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
  categories: { label: string; value: string }[];
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  locations: { label: string; value: string }[];
  offset: number;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  activeButton: string | null;
  setActiveButton: (activeButton: string | null) => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
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

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const validEvents = filteredEvents.filter(isEventTypeguard);

    const categoriesInFilteredEvents = new Set(
      validEvents.map((event) => event.category._id)
    );

    return categories
      .filter((category) => categoriesInFilteredEvents.has(category._id))
      .map((category) => ({
        value: category.name,
        label: category.name,
      }));
  }, [filteredEvents, categories]);

  // Filtered locations
  const filteredLocations = useMemo(() => {
    const validEvents = filteredEvents.filter(isEventTypeguard);

    const locationsInFilteredEvents = new Set(
      validEvents.flatMap((event) =>
        [event.location?.city, event.location?.venue].filter(Boolean)
      )
    );

    return Array.from(locationsInFilteredEvents).map((location) => ({
      value: location!,
      label: location!,
    }));
  }, [filteredEvents]);

  // Set offset and active buttons in filter drawer
  const [offset, setOffset] = useState(0);
  const [activeButton, setActiveButton] = useState<string | null>(null);

  // Clear all filters
  const clearAllFilters = () => {
    setQuery("");
    setStartDate(null);
    setEndDate(null);
    setSelectedCategory("");
    setSelectedLocation("");
    setShowEventsFree(false);
    setOffset(0);
    setActiveButton(null);
  };

  // Counts number of active filters for search bar placeholder
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (query) count++;
    if (startDate) count++;
    if (endDate) count++;
    if (selectedCategory) count++;
    if (selectedLocation) count++;
    if (showEventsFree) count++;
    return count;
  }, [
    query,
    startDate,
    endDate,
    selectedCategory,
    selectedLocation,
    showEventsFree,
  ]);

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
      categories: filteredCategories,
      selectedLocation,
      setSelectedLocation,
      locations: filteredLocations,
      offset,
      setOffset,
      activeButton,
      setActiveButton,
      clearAllFilters,
      activeFilterCount,
    }),
    [
      query,
      filteredEvents,
      startDate,
      endDate,
      showEventsFree,
      selectedCategory,
      selectedLocation,
      filteredLocations,
      filteredCategories,
      offset,
      activeButton,
    ]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
