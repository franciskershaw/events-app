import { getDate, getDay, getMonth, getYear } from "date-fns";

// Maps for months and weekdays
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

// Helper to normalize query date components
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

  return matchesDay && matchesMonth && matchesYear && matchesWeekday; // Ensure all match
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

  // Separate text-based and date-based parts
  const textParts: string[] = [];
  const dateParts: string[] = [];

  queryParts.forEach((part) => {
    if (
      part in monthMap ||
      part in dayMap ||
      /^\d{1,4}(st|nd|rd|th)?$/.test(part)
    ) {
      dateParts.push(part); // Add to date-based parts
    } else {
      textParts.push(part); // Add to text-based parts
    }
  });

  return { textQuery: textParts.join(" "), dateQuery: dateParts.join(" ") };
};
