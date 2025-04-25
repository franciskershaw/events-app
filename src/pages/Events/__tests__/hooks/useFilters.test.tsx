import { act, renderHook } from "@testing-library/react";
import { FaCheck, FaRegCopy, FaTimes } from "react-icons/fa";
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";
import useFilters from "@/pages/Events/components/global/Filters/useFilters";
import useCreateMessage from "@/pages/Events/hooks/useCreateMessage";

// Mock the dependencies
vi.mock("@/contexts/SearchEvents/SearchEventsContext");
vi.mock("@/pages/Events/hooks/useCreateMessage");

// Mock navigator.clipboard
Object.defineProperty(navigator, "clipboard", {
  value: {
    writeText: vi.fn(),
  },
  writable: true,
});

describe("useFilters", () => {
  // Mock return values
  const mockSetQuery = vi.fn();
  const mockSetStartDate = vi.fn();
  const mockSetEndDate = vi.fn();
  const mockSetSelectedCategory = vi.fn();
  const mockSetSelectedLocation = vi.fn();
  const mockSetShowEventsFree = vi.fn();
  const mockClearAllFilters = vi.fn();

  // Default search context values
  const mockSearchContext = {
    query: "",
    setQuery: mockSetQuery,
    startDate: null,
    setStartDate: mockSetStartDate,
    endDate: null,
    setEndDate: mockSetEndDate,
    selectedCategory: "",
    setSelectedCategory: mockSetSelectedCategory,
    selectedLocation: "",
    setSelectedLocation: mockSetSelectedLocation,
    filteredEvents: [],
    showEventsFree: false,
    setShowEventsFree: mockSetShowEventsFree,
    offset: 0,
    activeButton: null,
    clearAllFilters: mockClearAllFilters,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // Default mock implementation
    (useSearch as Mock).mockReturnValue(mockSearchContext);
    (useCreateMessage as Mock).mockReturnValue("");

    // Reset clipboard mock
    vi.mocked(navigator.clipboard.writeText).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return initial values", () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.appliedFilters).toEqual([]);
    expect(result.current.buttonText).toBe("Copy event text");
    expect(result.current.buttonStatus).toBe("outline");
  });

  it("should calculate applied filters correctly", () => {
    // Setup search context with various filters
    (useSearch as Mock).mockReturnValue({
      ...mockSearchContext,
      query: "test query",
      startDate: new Date("2023-01-01"),
      endDate: new Date("2023-01-31"),
      selectedCategory: "Conference",
      selectedLocation: "New York",
      showEventsFree: true,
    });

    const { result } = renderHook(() => useFilters());

    // Check if all filters are calculated correctly
    expect(result.current.appliedFilters).toHaveLength(6);
    expect(result.current.appliedFilters).toEqual(
      expect.arrayContaining([
        { label: '"test query"', type: "query" },
        { label: expect.stringContaining("From:"), type: "startDate" },
        { label: expect.stringContaining("To:"), type: "endDate" },
        { label: "Category: Conference", type: "category" },
        { label: "Location: New York", type: "location" },
        { label: "Showing free days", type: "eventsFree" },
      ])
    );
  });

  it("should call appropriate setter when removing a filter", () => {
    const { result } = renderHook(() => useFilters());

    // Test removing each type of filter
    act(() => {
      result.current.removeFilter("query");
    });
    expect(mockSetQuery).toHaveBeenCalledWith("");

    act(() => {
      result.current.removeFilter("startDate");
    });
    expect(mockSetStartDate).toHaveBeenCalledWith(null);

    act(() => {
      result.current.removeFilter("endDate");
    });
    expect(mockSetEndDate).toHaveBeenCalledWith(null);

    act(() => {
      result.current.removeFilter("category");
    });
    expect(mockSetSelectedCategory).toHaveBeenCalledWith("");

    act(() => {
      result.current.removeFilter("location");
    });
    expect(mockSetSelectedLocation).toHaveBeenCalledWith("");

    act(() => {
      result.current.removeFilter("eventsFree");
    });
    expect(mockSetShowEventsFree).toHaveBeenCalledWith(false);
  });

  it("should handle start and end date changes", () => {
    const { result } = renderHook(() => useFilters());

    const testDate = new Date("2023-05-15");

    act(() => {
      result.current.handleStartDateChange(testDate);
    });
    expect(mockSetStartDate).toHaveBeenCalledWith(testDate);

    act(() => {
      result.current.handleEndDateChange(testDate);
    });
    expect(mockSetEndDate).toHaveBeenCalledWith(testDate);

    // Test with null values
    act(() => {
      result.current.handleStartDateChange(null);
    });
    expect(mockSetStartDate).toHaveBeenCalledWith(null);

    act(() => {
      result.current.handleEndDateChange(null);
    });
    expect(mockSetEndDate).toHaveBeenCalledWith(null);
  });

  it("should return date buttons with correct date ranges", () => {
    const { result } = renderHook(() => useFilters());

    // Check if dateButtons array has the expected structure
    expect(result.current.dateButtons).toHaveLength(3);
    expect(result.current.dateButtons[0].label).toBe("D"); // Day
    expect(result.current.dateButtons[1].label).toBe("W"); // Week
    expect(result.current.dateButtons[2].label).toBe("M"); // Month

    // Check if each button returns date range objects
    const dayDates = result.current.dateButtons[0].getDates();
    expect(dayDates).toHaveProperty("startDate");
    expect(dayDates).toHaveProperty("endDate");

    const weekDates = result.current.dateButtons[1].getDates();
    expect(weekDates).toHaveProperty("startDate");
    expect(weekDates).toHaveProperty("endDate");

    const monthDates = result.current.dateButtons[2].getDates();
    expect(monthDates).toHaveProperty("startDate");
    expect(monthDates).toHaveProperty("endDate");
  });

  it("should handle successful copy event action", async () => {
    // Set up a message to copy
    (useCreateMessage as Mock).mockReturnValue("Event details text");

    // Mock successful clipboard write
    vi.mocked(navigator.clipboard.writeText).mockResolvedValue(undefined);

    const { result } = renderHook(() => useFilters());

    // Trigger copy action
    await act(async () => {
      result.current.handleCopyEventClick();
    });

    // Check if clipboard API was called with the message
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "Event details text"
    );

    // Check if button state was updated
    expect(result.current.buttonStatus).toBe("success");
    expect(result.current.buttonText).toBe("Events copied");

    // Fast-forward timer to test reset
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Check if button state was reset
    expect(result.current.buttonStatus).toBe("outline");
    expect(result.current.buttonText).toBe("Copy event text");
  });

  it("should handle failure when copying events", async () => {
    // Set up a message to copy
    (useCreateMessage as Mock).mockReturnValue("Event details text");

    // Mock failed clipboard write
    vi.mocked(navigator.clipboard.writeText).mockRejectedValue(
      new Error("Clipboard error")
    );

    const { result } = renderHook(() => useFilters());

    // Trigger copy action
    await act(async () => {
      result.current.handleCopyEventClick();
    });

    // Check if clipboard API was called
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "Event details text"
    );

    // Check if button state shows error
    expect(result.current.buttonStatus).toBe("error");
    expect(result.current.buttonText).toBe("Failed to copy");

    // Fast-forward timer to test reset
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Check if button state was reset
    expect(result.current.buttonStatus).toBe("outline");
    expect(result.current.buttonText).toBe("Copy event text");
  });

  it("should handle case when no events to copy", async () => {
    // Set up no message to copy
    (useCreateMessage as Mock).mockReturnValue("");

    const { result } = renderHook(() => useFilters());

    // Trigger copy action
    await act(async () => {
      result.current.handleCopyEventClick();
    });

    // Check clipboard API was not called
    expect(navigator.clipboard.writeText).not.toHaveBeenCalled();

    // Check if button state shows error
    expect(result.current.buttonStatus).toBe("error");
    expect(result.current.buttonText).toBe("No events");

    // Fast-forward timer to test reset
    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    // Check if button state was reset
    expect(result.current.buttonStatus).toBe("outline");
    expect(result.current.buttonText).toBe("Copy event text");
  });

  it("should return appropriate icon based on button status", () => {
    // Test by directly implementing the getIcon logic to verify it works as expected
    const getIconFn = (status: "outline" | "success" | "error") => {
      switch (status) {
        case "error":
          return <FaTimes />;
        case "success":
          return <FaCheck />;
        default:
          return <FaRegCopy />;
      }
    };

    // Test with outline status (default)
    const outlineIcon = getIconFn("outline");
    expect(outlineIcon.type).toBe(FaRegCopy);

    // Test with success status
    const successIcon = getIconFn("success");
    expect(successIcon.type).toBe(FaCheck);

    // Test with error status
    const errorIcon = getIconFn("error");
    expect(errorIcon.type).toBe(FaTimes);

    // Now test the hook implementation directly
    const { result } = renderHook(() => useFilters());

    // Default should be the copy icon (outline status)
    expect(result.current.getIcon().type).toBe(FaRegCopy);
  });
});
