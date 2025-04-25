import { describe, expect, it } from "vitest";

import { Event } from "../../../types/globalTypes";
import {
  createCategoryLookup,
  dayMap,
  getNestedValue,
  getUniqueLocations,
  isDateInRange,
  matchesDateComponents,
  monthMap,
  parseDateComponents,
  relativeDateMap,
  splitQueryParts,
} from "../helpers";

describe("parseDateComponents", () => {
  it("should parse days correctly", () => {
    expect(parseDateComponents("10")).toEqual({
      day: 10,
      month: null,
      year: null,
      weekday: null,
    });

    expect(parseDateComponents("21st")).toEqual({
      day: 21,
      month: null,
      year: null,
      weekday: null,
    });

    expect(parseDateComponents("3rd")).toEqual({
      day: 3,
      month: null,
      year: null,
      weekday: null,
    });
  });

  it("should parse months correctly", () => {
    expect(parseDateComponents("january")).toEqual({
      day: null,
      month: 0,
      year: null,
      weekday: null,
    });

    expect(parseDateComponents("jun")).toEqual({
      day: null,
      month: 5,
      year: null,
      weekday: null,
    });
  });

  it("should parse weekdays correctly", () => {
    expect(parseDateComponents("monday")).toEqual({
      day: null,
      month: null,
      year: null,
      weekday: 1,
    });

    expect(parseDateComponents("fri")).toEqual({
      day: null,
      month: null,
      year: null,
      weekday: 5,
    });
  });

  it("should parse years correctly", () => {
    // Clear 4-digit year
    expect(parseDateComponents("2024")).toEqual({
      day: null,
      month: null,
      year: 2024,
      weekday: null,
    });

    // Two-digit year test (25) is actually treated as a day first due to the regex patterns
    // Two-digit numbers match both day and year patterns
    const twoDigitYearResult = parseDateComponents("25");
    expect(twoDigitYearResult.day).toBe(25); // It's parsed as a day first
    expect(twoDigitYearResult.month).toBeNull();
    expect(twoDigitYearResult.weekday).toBeNull();

    // Test with a number that can only be a year (e.g., 2025)
    const fourDigitYearResult = parseDateComponents("2025");
    expect(fourDigitYearResult.day).toBeNull(); // Not a day
    expect(fourDigitYearResult.year).toBe(2025); // It's a year
  });

  it("should parse compound date strings", () => {
    expect(parseDateComponents("25 december 2024")).toEqual({
      day: 25,
      month: 11, // December is 11 in JS dates (0-indexed)
      year: 2024,
      weekday: null,
    });

    expect(parseDateComponents("friday 13th")).toEqual({
      day: 13,
      month: null,
      year: null,
      weekday: 5,
    });
  });
});

describe("isDateInRange", () => {
  it("should correctly identify dates within range", () => {
    const startComponents = {
      day: 10,
      month: 0, // January
      year: 2024,
      weekday: null,
    };

    const endComponents = {
      day: 20,
      month: 0, // January
      year: 2024,
      weekday: null,
    };

    // Date within range
    expect(
      isDateInRange(new Date(2024, 0, 15), startComponents, endComponents)
    ).toBe(true);

    // Date at start of range
    expect(
      isDateInRange(new Date(2024, 0, 10), startComponents, endComponents)
    ).toBe(true);

    // Date at end of range
    expect(
      isDateInRange(new Date(2024, 0, 20), startComponents, endComponents)
    ).toBe(true);

    // Date before range
    expect(
      isDateInRange(new Date(2024, 0, 5), startComponents, endComponents)
    ).toBe(false);

    // Date after range
    expect(
      isDateInRange(new Date(2024, 0, 25), startComponents, endComponents)
    ).toBe(false);
  });
});

describe("matchesDateComponents", () => {
  it("should match date when all components match", () => {
    const components = {
      day: 15,
      month: 6, // July
      year: 2024,
      weekday: null,
    };

    expect(matchesDateComponents(components, new Date(2024, 6, 15))).toBe(true);
  });

  it("should match date when only specified components exist", () => {
    // Only day specified
    const dayOnly = {
      day: 10,
      month: null,
      year: null,
      weekday: null,
    };

    expect(matchesDateComponents(dayOnly, new Date(2023, 5, 10))).toBe(true);
    expect(matchesDateComponents(dayOnly, new Date(2024, 0, 10))).toBe(true);
    expect(matchesDateComponents(dayOnly, new Date(2024, 0, 11))).toBe(false);

    // Only month specified
    const monthOnly = {
      day: null,
      month: 3, // April
      year: null,
      weekday: null,
    };

    expect(matchesDateComponents(monthOnly, new Date(2023, 3, 15))).toBe(true);
    expect(matchesDateComponents(monthOnly, new Date(2024, 3, 1))).toBe(true);
    expect(matchesDateComponents(monthOnly, new Date(2024, 4, 10))).toBe(false);

    // Only weekday specified
    const weekdayOnly = {
      day: null,
      month: null,
      year: null,
      weekday: 0, // Sunday
    };

    const sunday = new Date(2024, 0, 7); // January 7, 2024 is a Sunday
    const monday = new Date(2024, 0, 8); // January 8, 2024 is a Monday

    expect(matchesDateComponents(weekdayOnly, sunday)).toBe(true);
    expect(matchesDateComponents(weekdayOnly, monday)).toBe(false);
  });
});

describe("splitQueryParts", () => {
  it("should split text and date parts correctly", () => {
    const result = splitQueryParts("concert in london on 25th december");

    expect(result.textQuery).toBe("concert in london on");
    expect(result.dateQuery.start).toBe("25th december");
    expect(result.dateQuery.end).toBe("");
  });

  it("should handle relative dates", () => {
    const result = splitQueryParts("meeting today");

    expect(result.textQuery).toBe("meeting");
    // Since relativeDateMap contains Date objects, we don't check exact values
    expect(result.dateQuery.start).not.toBe("");
    expect(result.dateQuery.end).not.toBe("");
  });

  it("should handle two-word relative dates", () => {
    const result = splitQueryParts("conference next week");

    expect(result.textQuery).toBe("conference");
    // Since relativeDateMap contains Date objects, we don't check exact values
    expect(result.dateQuery.start).not.toBe("");
    expect(result.dateQuery.end).not.toBe("");
  });
});

describe("getNestedValue", () => {
  it("should retrieve values from nested objects", () => {
    const obj = {
      user: {
        name: "John",
        address: {
          city: "New York",
          zip: "10001",
        },
      },
      tags: ["important", "urgent"],
    };

    expect(getNestedValue(obj, "user.name")).toBe("John");
    expect(getNestedValue(obj, "user.address.city")).toBe("New York");
    expect(getNestedValue(obj, "tags")).toEqual(["important", "urgent"]);
  });

  it("should return undefined for non-existent paths", () => {
    const obj = { a: { b: 1 } };

    expect(getNestedValue(obj, "a.c")).toBeUndefined();
    expect(getNestedValue(obj, "d")).toBeUndefined();
    expect(getNestedValue(obj, "a.b.c")).toBeUndefined();
  });
});

describe("getUniqueLocations", () => {
  it("should extract unique locations from events", () => {
    const events = [
      {
        location: { city: "London", venue: "O2 Arena" },
      } as Event,
      {
        location: { city: "Paris", venue: "Eiffel Tower" },
      } as Event,
      {
        location: { city: "London", venue: "Wembley Stadium" },
      } as Event,
      {
        location: undefined,
      } as Event,
    ];

    const result = getUniqueLocations(events);

    // Should contain 5 unique locations (London, O2 Arena, Paris, Eiffel Tower, Wembley Stadium)
    expect(result).toHaveLength(5);

    // Check that all locations are included
    const locationValues = result.map((item) => item.value);
    expect(locationValues).toContain("London");
    expect(locationValues).toContain("O2 Arena");
    expect(locationValues).toContain("Paris");
    expect(locationValues).toContain("Eiffel Tower");
    expect(locationValues).toContain("Wembley Stadium");

    // Check that each item has matching label and value
    result.forEach((item) => {
      expect(item.label).toBe(item.value);
    });
  });

  it("should return empty array for events with no locations", () => {
    const events = [
      { location: undefined } as Event,
      { location: {} } as Event,
    ];

    const result = getUniqueLocations(events);
    expect(result).toHaveLength(0);
  });
});

describe("createCategoryLookup", () => {
  it("should create a lookup object from categories array", () => {
    const categories = [
      { _id: "cat1", name: "Music" },
      { _id: "cat2", name: "Sports" },
      { _id: "cat3", name: "Theater" },
    ];

    const result = createCategoryLookup(categories);

    expect(result).toEqual({
      cat1: "music",
      cat2: "sports",
      cat3: "theater",
    });
  });

  it("should handle empty categories array", () => {
    const result = createCategoryLookup([]);
    expect(result).toEqual({});
  });
});

describe("date mapping constants", () => {
  it("should have correct day mappings", () => {
    expect(dayMap.monday).toBe(1);
    expect(dayMap.mon).toBe(1);
    expect(dayMap.sunday).toBe(0);
    expect(dayMap.sun).toBe(0);
    expect(dayMap.saturday).toBe(6);
  });

  it("should have correct month mappings", () => {
    expect(monthMap.january).toBe(0);
    expect(monthMap.jan).toBe(0);
    expect(monthMap.december).toBe(11);
    expect(monthMap.dec).toBe(11);
  });

  it("should have valid relative date mappings", () => {
    // Check that all relative date entries have start and end dates
    Object.values(relativeDateMap).forEach((dateRange) => {
      expect(dateRange.start).toBeInstanceOf(Date);
      expect(dateRange.end).toBeInstanceOf(Date);
    });

    // Check specific entries
    expect(relativeDateMap.today.start.getDate()).toBe(new Date().getDate());
    expect(relativeDateMap.today.end.getDate()).toBe(new Date().getDate());
  });
});
