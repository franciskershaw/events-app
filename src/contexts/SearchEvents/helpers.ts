import { getDate, getDay, getMonth, getYear } from "date-fns";
import dayjs from "dayjs";

import { Event } from "../../types/globalTypes";

interface DateRange {
  start: Date;
  end: Date;
}

// Maps for weekdays
export const dayMap: Record<string, number> = {
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

// Maps for months
export const monthMap: Record<string, number> = {
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

// Explicitly define the type for relativeDateMap
export const relativeDateMap: Record<string, DateRange> = {
  today: {
    start: dayjs().startOf("day").toDate(),
    end: dayjs().endOf("day").toDate(),
  },
  tomorrow: {
    start: dayjs().add(1, "day").startOf("day").toDate(),
    end: dayjs().add(1, "day").endOf("day").toDate(),
  },
  "this week": {
    start: dayjs().startOf("week").add(1, "day").toDate(), // Week starts on Monday
    end: dayjs().endOf("week").add(1, "day").toDate(), // Week ends on Sunday
  },
  "next week": {
    start: dayjs().add(1, "week").startOf("week").add(1, "day").toDate(),
    end: dayjs().add(1, "week").endOf("week").add(1, "day").toDate(),
  },
  "this month": {
    start: dayjs().startOf("month").toDate(),
    end: dayjs().endOf("month").toDate(),
  },
  "next month": {
    start: dayjs().add(1, "month").startOf("month").toDate(),
    end: dayjs().add(1, "month").endOf("month").toDate(),
  },
  "this year": {
    start: dayjs().startOf("year").toDate(),
    end: dayjs().endOf("year").toDate(),
  },
  "next year": {
    start: dayjs().add(1, "year").startOf("year").toDate(),
    end: dayjs().add(1, "year").endOf("year").toDate(),
  },
};

// Helper to normalise query date components
export const parseDateComponents = (input: string) => {
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
      // Match months (e.g., Jan, January)
      components.month = monthMap[part as keyof typeof monthMap];
    } else if (part in dayMap) {
      // Match weekdays (e.g., Fri, Friday)
      components.weekday = dayMap[part as keyof typeof dayMap];
    } else if (yearPattern.test(part)) {
      // Match years like 25 or 2025
      const year = parseInt(part, 10);
      const currentYear = dayjs().year();
      components.year =
        year < 100
          ? year + 2000 <= currentYear + 20
            ? 2000 + year
            : 1900 + year
          : year;
    }
  });

  return components;
};

// Helper to check if a date is within a specified range
export const isDateInRange = (
  eventDate: Date,
  startComponents: ReturnType<typeof parseDateComponents>,
  endComponents: ReturnType<typeof parseDateComponents>
) => {
  const startDate = dayjs()
    .year(startComponents.year!)
    .month(startComponents.month!)
    .date(startComponents.day!)
    .startOf("day")
    .toDate();

  const endDate = dayjs()
    .year(endComponents.year!)
    .month(endComponents.month!)
    .date(endComponents.day!)
    .endOf("day")
    .toDate();

  return eventDate >= startDate && eventDate <= endDate;
};

// Matches date components against query components
export const matchesDateComponents = (
  queryComponents: ReturnType<typeof parseDateComponents>,
  eventDate: Date
) => {
  const matchesDay =
    queryComponents.day !== null
      ? queryComponents.day === getDate(eventDate)
      : true;

  const matchesMonth =
    queryComponents.month !== null
      ? queryComponents.month === getMonth(eventDate)
      : true;

  const matchesYear =
    queryComponents.year !== null
      ? queryComponents.year === getYear(eventDate)
      : true;

  const matchesWeekday =
    queryComponents.weekday !== null
      ? queryComponents.weekday === getDay(eventDate)
      : true;

  return matchesDay && matchesMonth && matchesYear && matchesWeekday;
};

// Create a lookup table for categories
export const createCategoryLookup = (
  categories: { _id: string; name: string }[]
) =>
  categories.reduce(
    (acc, category) => {
      acc[category._id] = category.name.toLowerCase();
      return acc;
    },
    {} as Record<string, string>
  );

// Split query into text and date parts
export const splitQueryParts = (query: string) => {
  const queryParts = query.toLowerCase().split(/\s+/);

  const textParts: string[] = [];
  const dateParts: { start: (Date | string)[]; end: (Date | string)[] } = {
    start: [],
    end: [],
  };

  let skipNext = false;
  queryParts.forEach((part, index) => {
    if (skipNext) {
      skipNext = false;
      return;
    }

    const twoWordPhrase = `${part} ${queryParts[index + 1] || ""}`.trim();

    if (relativeDateMap[twoWordPhrase]) {
      // Handle multi-word relative dates
      const range = relativeDateMap[twoWordPhrase];
      dateParts.start.push(range.start);
      dateParts.end.push(range.end);
      skipNext = true; // Skip the next word
    } else if (relativeDateMap[part]) {
      // Handle single-word relative dates
      dateParts.start.push(relativeDateMap[part].start);
      dateParts.end.push(relativeDateMap[part].end);
    } else if (
      part in monthMap ||
      part in dayMap ||
      /^\d{1,4}(st|nd|rd|th)?$/.test(part)
    ) {
      dateParts.start.push(part);
    } else {
      textParts.push(part);
    }
  });

  return {
    textQuery: textParts.join(" "),
    dateQuery: {
      start: dateParts.start.join(" "),
      end: dateParts.end.join(" "),
    },
  };
};

// Utility to get nested values from an object
export const getNestedValue = <T extends object>(
  obj: T,
  path: string
): unknown => {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
};

export const getUniqueLocations = (
  events: Event[]
): { label: string; value: string }[] => {
  const locations = events.reduce((acc, event) => {
    if (event.location?.city) {
      acc.add(event.location.city);
    }
    if (event.location?.venue) {
      acc.add(event.location.venue);
    }
    return acc;
  }, new Set<string>());

  return Array.from(locations)
    .map((city) => ({
      label: city,
      value: city,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
};
