import { createContext, ReactNode, useContext, useMemo, useState } from "react";

import { eachDayOfInterval, isSameDay } from "date-fns";

import { isEventTypeguard } from "../../pages/Events/helpers/helpers";
import { Event, EventFree } from "../../types/globalTypes";
import {
  createCategoryLookup,
  getNestedValue,
  getUniqueLocations,
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
  filteredEvents: Event[] | EventFree[];
  setFilteredEvents: (events: Event[] | EventFree[]) => void;
  showEventsFree: boolean;
  setShowEventsFree: (value: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  locations: { label: string; value: string }[];
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
  eventsDb: Event[];
  categories: { _id: string; name: string }[];
}

export const SearchProvider = ({
  children,
  eventsDb,
  categories,
}: SearchProviderProps) => {
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showEventsFree, setShowEventsFree] = useState(false);

  const categoryLookup = useMemo(
    () => createCategoryLookup(categories),
    [categories]
  );

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const locations = getUniqueLocations(eventsDb);

  // Calculate eventsFree based on eventsDb
  const eventsFree = useMemo(() => {
    const today = new Date();

    const furthestDate = eventsDb.reduce(
      (latest, event) =>
        new Date(event.date.end || event.date.start) > latest
          ? new Date(event.date.end || event.date.start)
          : latest,
      today
    );

    const rangeEndDate =
      endDate && endDate > furthestDate ? endDate : furthestDate;

    const allDays = eachDayOfInterval({ start: today, end: rangeEndDate });

    const eventDays = eventsDb.flatMap((event) => {
      const eventStart = new Date(event.date.start);
      const eventEnd = new Date(event.date.end || event.date.start);
      return eachDayOfInterval({ start: eventStart, end: eventEnd });
    });

    let eventFreeDays = allDays.filter(
      (day) => !eventDays.some((eventDay) => isSameDay(day, eventDay))
    );

    if (startDate) {
      eventFreeDays = eventFreeDays.filter((day) => day >= startDate);
    }

    return eventFreeDays.map((day) => ({
      _id: `free-${day.toISOString()}`,
      date: { start: day.toISOString(), end: day.toISOString() },
    }));
  }, [eventsDb, startDate, endDate]);

  const events = useMemo(() => {
    const { textQuery, dateQuery } = splitQueryParts(query);
    const startDateComponents = parseDateComponents(dateQuery.start);
    const endDateComponents = dateQuery.end
      ? parseDateComponents(dateQuery.end)
      : null;
    const textKeywords = textQuery.split(/\s+/).filter(Boolean);

    const eventsInitial = showEventsFree === false ? eventsDb : eventsFree;

    return eventsInitial.filter((event) => {
      // Match text fields (title, venue, city) against each keyword
      const matchesTextQuery = textKeywords.every((keyword) =>
        ["title", "location.venue", "location.city"].some((key) => {
          const value = getNestedValue(event, key);
          return value?.toString().toLowerCase().includes(keyword);
        })
      );

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

      if (showEventsFree === true) {
        return (
          (textKeywords.length === 0 || matchesTextQuery) &&
          matchesQueryDateRange &&
          matchesManualDateRange
        );
      } else {
        if (!isEventTypeguard(event)) return false;

        // Match categories
        const categoryId = event.category._id;
        const categoryName = categoryLookup[categoryId];
        const matchesCategoryQuery = textKeywords.some((keyword) =>
          categoryName.toLowerCase().includes(keyword.toLowerCase())
        );
        const matchesCategorySelect =
          !selectedCategory ||
          categoryName.toLowerCase() === selectedCategory.toLowerCase();

        // Match location
        const eventCity = event.location?.city?.toLowerCase() || "";
        const eventVenue = event.location?.venue?.toLowerCase() || "";
        const matchesLocation =
          !selectedLocation ||
          eventCity === selectedLocation.toLowerCase() ||
          eventVenue === selectedLocation.toLowerCase();

        // Combine all match conditions
        return (
          (textKeywords.length === 0 ||
            matchesTextQuery ||
            matchesCategoryQuery) &&
          matchesCategorySelect &&
          matchesLocation &&
          matchesQueryDateRange &&
          matchesManualDateRange
        );
      }
    });
  }, [
    showEventsFree,
    eventsFree,
    eventsDb,
    query,
    categoryLookup,
    selectedCategory,
    selectedLocation,
    startDate,
    endDate,
  ]);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        filteredEvents: events,
        setFilteredEvents: () => {},
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
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
