import { ReactNode } from "react";

import { act, renderHook } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";

import { CATEGORY_FREE } from "../../../constants/app";
import { Event } from "../../../types/globalTypes";
import { SearchProvider, useSearch } from "../SearchEventsContext";

// Define the parameter type for useFilterEvents mock
interface FilterEventsParams {
  events: Event[];
  query: string;
  startDate: Date | null;
  endDate: Date | null;
  showEventsFree: boolean;
  selectedCategory: string;
  selectedLocation: string;
  categoryLookup: Record<string, string>;
}

// Mock dependencies
vi.mock("../hooks/useFilterEvents", () => ({
  useFilterEvents: ({
    events,
    showEventsFree,
    selectedCategory,
    selectedLocation,
  }: FilterEventsParams) => {
    // Simple mock implementation that applies basic filters
    return events.filter((event: Event) => {
      if (!showEventsFree && event.category._id === CATEGORY_FREE) {
        return false;
      }

      if (selectedCategory && event.category.name !== selectedCategory) {
        return false;
      }

      if (
        selectedLocation &&
        event.location?.city !== selectedLocation &&
        event.location?.venue !== selectedLocation
      ) {
        return false;
      }

      return true;
    });
  },
}));

describe("SearchEventsContext", () => {
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

  // Test categories
  const testCategories = [
    { _id: "category-1", name: "Test Category" },
    { _id: "category-2", name: "Another Category" },
    { _id: CATEGORY_FREE, name: "Free" },
  ];

  // Test events
  const testEvents = [
    createEvent({
      title: "Regular Event",
      category: { _id: "category-1", name: "Test Category", icon: "test-icon" },
    }),
    createEvent({
      title: "Another Event",
      category: { _id: "category-2", name: "Another Category", icon: "icon-2" },
      location: { city: "City B", venue: "Venue B" },
    }),
    createEvent({
      title: "Free Day",
      category: { _id: CATEGORY_FREE, name: "Free", icon: "" },
    }),
  ];

  // Test wrapper
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SearchProvider eventsDb={testEvents} categories={testCategories}>
      {children}
    </SearchProvider>
  );

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.query).toBe("");
    expect(result.current.startDate).toBeNull();
    expect(result.current.endDate).toBeNull();
    expect(result.current.showEventsFree).toBe(false);
    expect(result.current.selectedCategory).toBe("");
    expect(result.current.selectedLocation).toBe("");
    expect(result.current.offset).toBe(0);
    expect(result.current.activeButton).toBeNull();
    expect(result.current.activeFilterCount).toBe(0);
    expect(result.current.allEvents).toEqual(testEvents);
    expect(result.current.filteredEvents.length).toBe(2); // Free events are excluded by default
  });

  it("should update query when setQuery is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setQuery("test query");
    });

    expect(result.current.query).toBe("test query");
    expect(result.current.activeFilterCount).toBe(1);
  });

  it("should update startDate when setStartDate is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });
    const testDate = new Date(2024, 5, 15);

    act(() => {
      result.current.setStartDate(testDate);
    });

    expect(result.current.startDate).toEqual(testDate);
    expect(result.current.activeFilterCount).toBe(1);
  });

  it("should update endDate when setEndDate is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });
    const testDate = new Date(2024, 5, 20);

    act(() => {
      result.current.setEndDate(testDate);
    });

    expect(result.current.endDate).toEqual(testDate);
    expect(result.current.activeFilterCount).toBe(1);
  });

  it("should toggle showEventsFree when setShowEventsFree is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setShowEventsFree(true);
    });

    expect(result.current.showEventsFree).toBe(true);
    expect(result.current.activeFilterCount).toBe(1);
    expect(result.current.filteredEvents.length).toBe(3); // Now includes free events
  });

  it("should update selectedCategory when setSelectedCategory is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSelectedCategory("Test Category");
    });

    expect(result.current.selectedCategory).toBe("Test Category");
    expect(result.current.activeFilterCount).toBe(1);
    expect(result.current.filteredEvents.length).toBe(1); // Only events with Test Category
  });

  it("should update selectedLocation when setSelectedLocation is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setSelectedLocation("City B");
    });

    expect(result.current.selectedLocation).toBe("City B");
    expect(result.current.activeFilterCount).toBe(1);
    expect(result.current.filteredEvents.length).toBe(1); // Only events in City B
  });

  it("should update offset when setOffset is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setOffset(2);
    });

    expect(result.current.offset).toBe(2);
  });

  it("should update activeButton when setActiveButton is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    act(() => {
      result.current.setActiveButton("Today");
    });

    expect(result.current.activeButton).toBe("Today");
  });

  it("should reset all filters when clearAllFilters is called", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    // Set various filters
    act(() => {
      result.current.setQuery("test");
      result.current.setStartDate(new Date());
      result.current.setSelectedCategory("Test Category");
      result.current.setShowEventsFree(true);
      result.current.setOffset(2);
      result.current.setActiveButton("Today");
    });

    expect(result.current.activeFilterCount).toBeGreaterThan(0);

    // Clear all filters
    act(() => {
      result.current.clearAllFilters();
    });

    expect(result.current.query).toBe("");
    expect(result.current.startDate).toBeNull();
    expect(result.current.endDate).toBeNull();
    expect(result.current.showEventsFree).toBe(false);
    expect(result.current.selectedCategory).toBe("");
    expect(result.current.selectedLocation).toBe("");
    expect(result.current.offset).toBe(0);
    expect(result.current.activeButton).toBeNull();
    expect(result.current.activeFilterCount).toBe(0);
  });

  it("should properly track activeFilterCount", () => {
    const { result } = renderHook(() => useSearch(), { wrapper });

    expect(result.current.activeFilterCount).toBe(0);

    act(() => {
      result.current.setQuery("test");
    });
    expect(result.current.activeFilterCount).toBe(1);

    act(() => {
      result.current.setStartDate(new Date());
    });
    expect(result.current.activeFilterCount).toBe(2);

    act(() => {
      result.current.setEndDate(new Date());
    });
    expect(result.current.activeFilterCount).toBe(3);

    act(() => {
      result.current.setSelectedCategory("Test Category");
    });
    expect(result.current.activeFilterCount).toBe(4);

    act(() => {
      result.current.setSelectedLocation("Test City");
    });
    expect(result.current.activeFilterCount).toBe(5);

    act(() => {
      result.current.setShowEventsFree(true);
    });
    expect(result.current.activeFilterCount).toBe(6);
  });

  it("should throw error if useSearch is used outside of provider", () => {
    const consoleSpy = vi.spyOn(console, "error");
    consoleSpy.mockImplementation(() => {});

    expect(() => {
      const { result } = renderHook(() => useSearch());
      return result.current;
    }).toThrow("useSearch must be used within a SearchProvider");

    consoleSpy.mockRestore();
  });
});
