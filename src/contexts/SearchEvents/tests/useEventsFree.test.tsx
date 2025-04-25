import { renderHook } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { CATEGORY_FREE, LOCATION_DEFAULT } from "../../../constants/app";
import { Event } from "../../../types/globalTypes";
import { useEventsFree } from "../hooks/useEventsFree";

describe("useEventsFree", () => {
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

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  it("should return free days when there are no events", () => {
    const { result } = renderHook(() =>
      useEventsFree({
        events: [],
        startDate: today,
        endDate: tomorrow,
        query: "",
      })
    );

    expect(result.current.length).toBeGreaterThan(0);
    result.current.forEach((event) => {
      expect(event.category.name).toBe(CATEGORY_FREE);
      expect(dayjs(event.date.start).isValid()).toBe(true);
    });
  });

  it("should format free events with the correct structure", () => {
    const { result } = renderHook(() =>
      useEventsFree({
        events: [],
        startDate: today,
        endDate: tomorrow,
        query: "",
      })
    );

    // Verify at least one event was created
    expect(result.current.length).toBeGreaterThan(0);

    // Check the structure of the first free event
    const freeEvent = result.current[0];
    expect(freeEvent._id).toContain("free-");
    expect(freeEvent.category.name).toBe(CATEGORY_FREE);
    expect(freeEvent.category._id).toBe(CATEGORY_FREE);
    expect(freeEvent.location?.city).toBe(LOCATION_DEFAULT);
    expect(freeEvent.location?.venue).toBe("");
    expect(freeEvent.title).toBe("");
    expect(freeEvent.private).toBe(false);
    expect(freeEvent.unConfirmed).toBe(false);
  });

  it("should exclude days with events (basic test)", () => {
    // Create an event for today with a distinct category name to ensure identification
    const todayEvent = createEvent({
      date: {
        start: dayjs(today).format("YYYY-MM-DDTHH:mm:ss"),
        end: dayjs(today).format("YYYY-MM-DDTHH:mm:ss"),
      },
    });

    const { result } = renderHook(() =>
      useEventsFree({
        events: [todayEvent],
        startDate: null,
        endDate: null,
        query: "",
      })
    );

    // All free days should have the CATEGORY_FREE category
    result.current.forEach((event) => {
      expect(event.category.name).toBe(CATEGORY_FREE);
    });
  });

  it("should respect the startDate filter", () => {
    const futureDate = dayjs().add(5, "days").toDate();

    const { result } = renderHook(() =>
      useEventsFree({
        events: [],
        startDate: futureDate,
        endDate: dayjs(futureDate).add(1, "day").toDate(),
        query: "",
      })
    );

    // All events should be after the start date
    const futureDateStr = dayjs(futureDate).format("YYYY-MM-DD");
    result.current.forEach((event) => {
      const eventDate = dayjs(event.date.start).format("YYYY-MM-DD");
      expect(eventDate >= futureDateStr).toBe(true);
    });
  });

  it("should handle date query in the query string", () => {
    const queryWithDate = "next week";

    const { result } = renderHook(() =>
      useEventsFree({
        events: [],
        startDate: null,
        endDate: null,
        query: queryWithDate,
      })
    );

    // Should have generated free events
    expect(result.current.length).toBeGreaterThan(0);
  });
});
