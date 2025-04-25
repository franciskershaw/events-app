import { renderHook } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";

import { CATEGORY_FREE } from "../../../constants/app";
import { Event } from "../../../types/globalTypes";
import { useFilterEvents } from "../hooks/useFilterEvents";

// Mock the useUser hook
vi.mock("../../../hooks/user/useUser", () => ({
  default: () => ({
    user: {
      _id: "user-1",
      name: "Test User",
    },
  }),
}));

describe("useFilterEvents", () => {
  // Helper to create test events
  const createEvent = (overrides: Partial<Event> = {}): Event => ({
    _id: `event-${Math.random().toString(36).substring(2, 7)}`,
    title: "Test Event",
    date: {
      start: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      end: dayjs().add(1, "hour").format("YYYY-MM-DDTHH:mm:ss"),
    },
    category: {
      _id: "category-1",
      name: "Test Category",
      icon: "test-icon",
    },
    location: { city: "Test City", venue: "Test Venue" },
    createdBy: {
      _id: "user-1",
      name: "Test User",
    },
    description: "Test Description",
    createdAt: new Date(),
    updatedAt: new Date(),
    unConfirmed: false,
    private: false,
    ...overrides,
  });

  const defaultCategoryLookup = {
    "category-1": "Test Category",
    "category-2": "Another Category",
    [CATEGORY_FREE]: "Free",
  };

  it("should return all events when no filters are applied", () => {
    const testEvents = [
      createEvent({ title: "Event 1" }),
      createEvent({ title: "Event 2" }),
    ];

    const { result } = renderHook(() =>
      useFilterEvents({
        events: testEvents,
        query: "",
        startDate: null,
        endDate: null,
        showEventsFree: true,
        selectedCategory: "",
        selectedLocation: "",
        categoryLookup: defaultCategoryLookup,
      })
    );

    expect(result.current.length).toBe(2);
  });

  it("should filter out events that don't match text query", () => {
    const testEvents = [
      createEvent({ title: "Meeting with Team" }),
      createEvent({ title: "Coffee Break" }),
      createEvent({ title: "Team Lunch" }),
    ];

    const { result } = renderHook(() =>
      useFilterEvents({
        events: testEvents,
        query: "team",
        startDate: null,
        endDate: null,
        showEventsFree: true,
        selectedCategory: "",
        selectedLocation: "",
        categoryLookup: defaultCategoryLookup,
      })
    );

    expect(result.current.length).toBe(2);
    expect(result.current[0].title).toContain("Team");
    expect(result.current[1].title).toContain("Team");
  });

  it("should filter events by free category when showEventsFree is false", () => {
    const freeEvent = createEvent({
      title: "Free Day",
      category: {
        _id: CATEGORY_FREE,
        name: "Free",
        icon: "",
      },
    });

    const nonFreeEvent = createEvent({
      title: "Normal Event",
    });

    const { result } = renderHook(() =>
      useFilterEvents({
        events: [freeEvent, nonFreeEvent],
        query: "",
        startDate: null,
        endDate: null,
        showEventsFree: false,
        selectedCategory: "",
        selectedLocation: "",
        categoryLookup: defaultCategoryLookup,
      })
    );

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("Normal Event");
  });

  it("should filter events by date range", () => {
    // Define fixed dates for testing
    const dateToday = dayjs().startOf("day");
    const dateTomorrow = dateToday.add(1, "day");
    const dateYesterday = dateToday.subtract(1, "day");
    const dateDayAfterTomorrow = dateToday.add(2, "day");

    const pastEvent = createEvent({
      title: "Past Event",
      date: {
        start: dateYesterday.format("YYYY-MM-DDTHH:mm:ss"),
        end: dateYesterday.format("YYYY-MM-DDTHH:mm:ss"),
      },
    });

    const todayEvent = createEvent({
      title: "Current Event",
      date: {
        start: dateToday.format("YYYY-MM-DDTHH:mm:ss"),
        end: dateToday.format("YYYY-MM-DDTHH:mm:ss"),
      },
    });

    const futureEvent = createEvent({
      title: "Future Event",
      date: {
        start: dateDayAfterTomorrow.format("YYYY-MM-DDTHH:mm:ss"),
        end: dateDayAfterTomorrow.format("YYYY-MM-DDTHH:mm:ss"),
      },
    });

    const { result } = renderHook(() =>
      useFilterEvents({
        events: [pastEvent, todayEvent, futureEvent],
        query: "",
        startDate: dateToday.toDate(),
        endDate: dateTomorrow.toDate(),
        showEventsFree: true,
        selectedCategory: "",
        selectedLocation: "",
        categoryLookup: defaultCategoryLookup,
      })
    );

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("Current Event");
  });

  it("should filter events by selected category", () => {
    const event1 = createEvent({
      title: "Event 1",
      category: {
        _id: "category-1",
        name: "Test Category",
        icon: "test-icon",
      },
    });

    const event2 = createEvent({
      title: "Event 2",
      category: {
        _id: "category-2",
        name: "Another Category",
        icon: "another-icon",
      },
    });

    const { result } = renderHook(() =>
      useFilterEvents({
        events: [event1, event2],
        query: "",
        startDate: null,
        endDate: null,
        showEventsFree: true,
        selectedCategory: "Another Category",
        selectedLocation: "",
        categoryLookup: defaultCategoryLookup,
      })
    );

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("Event 2");
  });

  it("should filter events by selected location", () => {
    const event1 = createEvent({
      title: "Event in City A",
      location: { city: "City A", venue: "Venue 1" },
    });

    const event2 = createEvent({
      title: "Event in City B",
      location: { city: "City B", venue: "Venue 2" },
    });

    const event3 = createEvent({
      title: "Event at Special Venue",
      location: { city: "City A", venue: "Special Venue" },
    });

    const { result } = renderHook(() =>
      useFilterEvents({
        events: [event1, event2, event3],
        query: "",
        startDate: null,
        endDate: null,
        showEventsFree: true,
        selectedCategory: "",
        selectedLocation: "City A",
        categoryLookup: defaultCategoryLookup,
      })
    );

    expect(result.current.length).toBe(2);
    expect(
      result.current.some((e) => e.title === "Event in City A")
    ).toBeTruthy();
    expect(
      result.current.some((e) => e.title === "Event at Special Venue")
    ).toBeTruthy();
  });

  it("should search by venue name when provided in location", () => {
    const event1 = createEvent({
      title: "Event 1",
      location: { city: "City A", venue: "Conference Hall" },
    });

    const event2 = createEvent({
      title: "Event 2",
      location: { city: "City B", venue: "Park" },
    });

    const { result } = renderHook(() =>
      useFilterEvents({
        events: [event1, event2],
        query: "conference",
        startDate: null,
        endDate: null,
        showEventsFree: true,
        selectedCategory: "",
        selectedLocation: "",
        categoryLookup: defaultCategoryLookup,
      })
    );

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("Event 1");
  });

  it("should handle date queries in the search text", () => {
    const januaryEvent = createEvent({
      title: "January Event",
      date: {
        start: "2024-01-15T10:00:00",
        end: "2024-01-15T11:00:00",
      },
    });

    const februaryEvent = createEvent({
      title: "February Event",
      date: {
        start: "2024-02-15T10:00:00",
        end: "2024-02-15T11:00:00",
      },
    });

    const { result } = renderHook(() =>
      useFilterEvents({
        events: [januaryEvent, februaryEvent],
        query: "january",
        startDate: null,
        endDate: null,
        showEventsFree: true,
        selectedCategory: "",
        selectedLocation: "",
        categoryLookup: defaultCategoryLookup,
      })
    );

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("January Event");
  });

  it("should find events by category name in query", () => {
    const event1 = createEvent({
      title: "Event 1",
      category: {
        _id: "category-1",
        name: "Meeting",
        icon: "test-icon",
      },
    });

    const event2 = createEvent({
      title: "Event 2",
      category: {
        _id: "category-2",
        name: "Conference",
        icon: "another-icon",
      },
    });

    const customCategoryLookup = {
      "category-1": "Meeting",
      "category-2": "Conference",
    };

    const { result } = renderHook(() =>
      useFilterEvents({
        events: [event1, event2],
        query: "conf",
        startDate: null,
        endDate: null,
        showEventsFree: true,
        selectedCategory: "",
        selectedLocation: "",
        categoryLookup: customCategoryLookup,
      })
    );

    expect(result.current.length).toBe(1);
    expect(result.current[0].title).toBe("Event 2");
  });
});
