import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { getDate, getDay, getMonth, getYear, parse } from "date-fns";

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

  // Mappings for months and weekdays
  const monthMap = {
    jan: 0,
    january: 0,
    feb: 1,
    february: 1,
    mar: 2,
    march: 2,
    apr: 3,
    april: 3,
    may: 4,
    jun: 5,
    june: 5,
    jul: 6,
    july: 6,
    aug: 7,
    august: 7,
    sep: 8,
    september: 8,
    oct: 9,
    october: 9,
    nov: 10,
    november: 10,
    dec: 11,
    december: 11,
  };

  const dayMap = {
    sun: 0,
    sunday: 0,
    mon: 1,
    monday: 1,
    tue: 2,
    tuesday: 2,
    wed: 3,
    wednesday: 3,
    thu: 4,
    thursday: 4,
    fri: 5,
    friday: 5,
    sat: 6,
    saturday: 6,
  };

  // Helper to normalize query date components
  const parseDateComponents = (input: string) => {
    const dayPattern = /^(\d{1,2})(st|nd|rd|th)?$/; // Match days like 1, 2nd, 3rd
    const yearPattern = /^\d{2,4}$/; // Match years like 25 or 2025
    const queryParts = input.toLowerCase().split(/\s+/);

    const components = {
      day: null as number | null,
      month: null as number | null,
      year: null as number | null,
      weekday: null as number | null,
    };

    queryParts.forEach((part) => {
      if (dayPattern.test(part)) {
        // Match day numbers like 3, 3rd
        components.day = parseInt(part.replace(/(st|nd|rd|th)/, ""), 10);
      } else if (part in monthMap) {
        // Match months (e.g., Jan, January) - Explicit type assertion
        components.month = monthMap[part as keyof typeof monthMap]; // FIXED
      } else if (part in dayMap) {
        // Match weekdays (e.g., Fri, Friday) - Explicit type assertion
        components.weekday = dayMap[part as keyof typeof dayMap]; // FIXED
      } else if (yearPattern.test(part)) {
        // Match years like 25 or 2025
        const year = parseInt(part, 10);
        components.year = year < 100 ? 2000 + year : year; // Infer 20XX for short years
      }
    });

    return components;
  };

  useEffect(() => {
    const lowerQuery = query.toLowerCase();
    const queryComponents = parseDateComponents(lowerQuery);

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
      const matchesCategory = categoryName && categoryName.includes(lowerQuery);

      // Match event date components
      const eventDate = parse(
        event.date.start, // Extract the ISO string
        "yyyy-MM-dd'T'HH:mm:ss.SSSX",
        new Date()
      );

      const matchesDay =
        queryComponents.day !== null
          ? queryComponents.day === getDate(eventDate) // Match day only if specified
          : true;

      const matchesMonth =
        queryComponents.month !== null
          ? queryComponents.month === getMonth(eventDate) // Match month only if specified
          : true;

      const matchesYear =
        queryComponents.year !== null
          ? queryComponents.year === getYear(eventDate) // Match year only if specified
          : true;

      const matchesWeekday =
        queryComponents.weekday !== null
          ? queryComponents.weekday === getDay(eventDate) // Match weekday only if specified
          : true;

      const matchesDate =
        matchesDay && matchesMonth && matchesYear && matchesWeekday; // Ensure ALL components match

      // Return true if query matches text fields, category name, or date
      return matchesQuery || matchesCategory || matchesDate;
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
