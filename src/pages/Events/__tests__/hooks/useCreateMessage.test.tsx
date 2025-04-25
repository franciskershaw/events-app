import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Event } from "@/types/globalTypes";

import { CATEGORY_FREE } from "../../../../constants/app";
import useCreateMessage from "../../hooks/useCreateMessage";

const mockEvent: Event = {
  _id: "event1",
  title: "Test Event",
  date: {
    start: "2023-05-15T14:00:00",
    end: "2023-05-15T16:00:00",
  },
  category: {
    _id: "category1",
    name: "Social",
    icon: "👋",
  },
  location: {
    venue: "Test Venue",
    city: "Test City",
  },
  description: "Test description",
  createdBy: { _id: "user123", name: "Test User" },
  createdAt: new Date(),
  updatedAt: new Date(),
  unConfirmed: false,
  private: false,
};

const mockFreeEvent: Event = {
  ...mockEvent,
  _id: "freeEvent1",
  title: "Free Day",
  category: {
    _id: "categoryFree",
    name: CATEGORY_FREE,
    icon: "🆓",
  },
};

describe("useCreateMessage", () => {
  it("should return an empty string when there are no events", () => {
    const { result } = renderHook(() =>
      useCreateMessage({
        filteredEvents: [],
        startDate: null,
        endDate: null,
        selectedCategory: "",
        selectedLocation: "",
        showEventsFree: false,
      })
    );

    expect(result.current).toBe("");
  });

  it("should generate a basic message with events", () => {
    const { result } = renderHook(() =>
      useCreateMessage({
        filteredEvents: [mockEvent],
        startDate: null,
        endDate: null,
        selectedCategory: "",
        selectedLocation: "",
        showEventsFree: false,
      })
    );

    expect(result.current).toContain("I have 1 plan between");
    expect(result.current).toContain("Test Event");
    expect(result.current).toContain("Test Venue");
  });

  it("should generate a message with specified category", () => {
    const { result } = renderHook(() =>
      useCreateMessage({
        filteredEvents: [mockEvent, mockEvent],
        startDate: null,
        endDate: null,
        selectedCategory: "social",
        selectedLocation: "",
        showEventsFree: false,
      })
    );

    expect(result.current).toContain("I have 2 socials between");
  });

  it("should generate a message with category and location", () => {
    const { result } = renderHook(() =>
      useCreateMessage({
        filteredEvents: [mockEvent, mockEvent],
        startDate: null,
        endDate: null,
        selectedCategory: "social",
        selectedLocation: "Test City",
        showEventsFree: false,
      })
    );

    expect(result.current).toContain("I have 2 socials in Test City between");
  });

  it("should generate a free days message when showEventsFree is true", () => {
    const { result } = renderHook(() =>
      useCreateMessage({
        filteredEvents: [mockFreeEvent],
        startDate: null,
        endDate: null,
        selectedCategory: "",
        selectedLocation: "",
        showEventsFree: true,
      })
    );

    expect(result.current).toContain("I am free on 1 day between");
  });

  it("should format messages correctly with multiple free days", () => {
    const { result } = renderHook(() =>
      useCreateMessage({
        filteredEvents: [
          mockFreeEvent,
          {
            ...mockFreeEvent,
            _id: "freeEvent2",
            date: {
              start: "2023-05-16T14:00:00",
              end: "2023-05-16T16:00:00",
            },
          },
        ],
        startDate: null,
        endDate: null,
        selectedCategory: "",
        selectedLocation: "",
        showEventsFree: true,
      })
    );

    expect(result.current).toContain("I am free on 2 days between");
  });

  it("should respect custom date range when provided", () => {
    const startDate = new Date("2023-05-10");
    const endDate = new Date("2023-05-20");

    const { result } = renderHook(() =>
      useCreateMessage({
        filteredEvents: [mockEvent],
        startDate,
        endDate,
        selectedCategory: "",
        selectedLocation: "",
        showEventsFree: false,
      })
    );

    // Check that the custom date range is used instead of event dates
    expect(result.current).toContain("10");
    expect(result.current).toContain("May");
    expect(result.current).toContain("20");
  });
});
