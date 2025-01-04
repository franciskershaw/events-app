import {
  addDays,
  addMonths,
  addYears,
  endOfMonth,
  endOfWeek,
  endOfYear,
  getDate,
  getDay,
  getMonth,
  getYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

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
    start: new Date(),
    end: new Date(),
  },
  tomorrow: {
    start: addDays(new Date(), 1),
    end: addDays(new Date(), 1),
  },
  "this week": {
    start: startOfWeek(new Date(), { weekStartsOn: 1 }),
    end: endOfWeek(new Date(), { weekStartsOn: 1 }),
  },
  "next week": {
    start: startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }),
    end: endOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 }),
  },
  "this month": {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  },
  "next month": {
    start: startOfMonth(addMonths(new Date(), 1)),
    end: endOfMonth(addMonths(new Date(), 1)),
  },
  "this year": {
    start: startOfYear(new Date()),
    end: endOfYear(new Date()),
  },
  "next year": {
    start: startOfYear(addYears(new Date(), 1)),
    end: endOfYear(addYears(new Date(), 1)),
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
      const currentYear = new Date().getFullYear();
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
  const startDate = new Date(
    startComponents.year!,
    startComponents.month!,
    startComponents.day!
  );

  const endDate = new Date(
    endComponents.year!,
    endComponents.month!,
    endComponents.day!
  );

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
  categories: { _id: { $oid: string }; name: string }[]
) =>
  categories.reduce(
    (acc, category) => {
      acc[category._id.$oid] = category.name.toLowerCase();
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

  let skipNext = false; // Used to skip the second word in multi-word phrases

  queryParts.forEach((part, index) => {
    if (skipNext) {
      skipNext = false; // Skip the second word in multi-word phrases
      return;
    }

    // Check for multi-word phrases (e.g., "next week")
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
      dateParts.start.push(part); // Keep explicit date as string
    } else {
      textParts.push(part); // Treat as text keyword
    }
  });

  console.log("textParts:", textParts);
  console.log("dateParts:", dateParts);

  return {
    textQuery: textParts.join(" "),
    dateQuery: {
      start: dateParts.start.join(" "),
      end: dateParts.end.join(" "),
    },
  };
};

// Utility to get nested values from an object
export const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((o, k) => o?.[k], obj);
};
