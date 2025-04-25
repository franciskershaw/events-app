import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";
import { EventsSearch } from "@/pages/Events/components/desktop/EventsSearch/EventsSearch";
import { Event } from "@/types/globalTypes";

// Mock dependencies
vi.mock("@/contexts/SearchEvents/SearchEventsContext");
vi.mock("dayjs", () => ({
  default: () => ({
    format: () => "Monday 1st January",
  }),
}));
vi.mock("@/pages/Events/components/global/Filters/Filters", () => ({
  default: () => <div data-testid="filters-component">Filters Component</div>,
}));
vi.mock(
  "@/pages/Events/components/global/EmptyStateNoSearch/EmptyStateNoSearch",
  () => ({
    EmptyStateNoSearch: () => (
      <div data-testid="empty-state-no-search">Start searching for events</div>
    ),
  })
);
vi.mock(
  "@/pages/Events/components/global/EmptyStateNoResults/EmptyStateNoResults",
  () => ({
    EmptyStateNoResults: () => (
      <div data-testid="empty-state-no-results">No results found</div>
    ),
  })
);
vi.mock("@/components/ui/search-bar", () => ({
  SearchBar: ({
    query,
    setQuery,
    clearFilters,
    activeFilterCount,
  }: {
    query: string;
    setQuery: (value: string) => void;
    clearFilters: () => void;
    activeFilterCount: number;
  }) => (
    <div data-testid="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        data-testid="search-input"
      />
      <button onClick={clearFilters} data-testid="clear-filters-button">
        Clear Filters ({activeFilterCount})
      </button>
    </div>
  ),
}));
vi.mock(
  "@/pages/Events/components/global/UserEventInitials/UserEventInitials",
  () => ({
    UserEventInitials: ({ event }: { event: Event }) => (
      <div data-testid="user-initials">{event.createdBy.name}</div>
    ),
  })
);
vi.mock("@/lib/utils", () => ({
  formatTime: vi.fn().mockImplementation(() => "10:00 AM"),
}));

describe("EventsSearch", () => {
  // Common mock data used across tests
  const mockEvents: Record<string, Event[]> = {
    "2023-01-01": [
      {
        _id: "event1",
        title: "Test Event 1",
        date: {
          start: "2023-01-01T10:00:00Z",
          end: "2023-01-01T12:00:00Z",
        },
        category: {
          _id: "cat1",
          name: "Conference",
          icon: "calendar",
        },
        createdBy: {
          _id: "user1",
          name: "John Doe",
        },
        location: {
          venue: "Test Venue 1",
          city: "Test City",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        unConfirmed: false,
        private: false,
      },
      {
        _id: "event2",
        title: "Test Event 2",
        date: {
          start: "2023-01-01T14:00:00Z",
          end: "2023-01-01T16:00:00Z",
        },
        category: {
          _id: "cat2",
          name: "Free",
          icon: "calendar-free",
        },
        createdBy: {
          _id: "user2",
          name: "Jane Smith",
        },
        location: {
          venue: "Test Venue 2",
          city: "Test City",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        unConfirmed: false,
        private: false,
      },
    ],
    "2023-01-02": [
      {
        _id: "event3",
        title: "Test Event 3",
        date: {
          start: "2023-01-02T10:00:00Z",
          end: "2023-01-02T12:00:00Z",
        },
        category: {
          _id: "cat1",
          name: "Conference",
          icon: "calendar",
        },
        createdBy: {
          _id: "user1",
          name: "John Doe",
        },
        location: {
          venue: "Test Venue 3",
          city: "Test City",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        unConfirmed: true,
        private: false,
      },
    ],
  };

  // Create a complete mock for SearchContextProps
  const mockSearch = {
    // The values we use in our tests
    activeFilterCount: 0,
    clearAllFilters: vi.fn(),
    query: "",
    setQuery: vi.fn(),

    // Additional required values from SearchContextProps
    allEvents: [],
    filteredEvents: [],
    showEventsFree: false,
    setShowEventsFree: vi.fn(),
    selectedCategory: "",
    setSelectedCategory: vi.fn(),
    categories: [],
    selectedLocation: "",
    setSelectedLocation: vi.fn(),
    locations: [],
    startDate: null,
    setStartDate: vi.fn(),
    endDate: null,
    setEndDate: vi.fn(),
    offset: 0,
    setOffset: vi.fn(),
    activeButton: null,
    setActiveButton: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSearch).mockReturnValue(mockSearch);
  });

  it("renders the search bar correctly", () => {
    render(<EventsSearch eventsByDay={mockEvents} filters={true} />);

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByTestId("clear-filters-button")).toBeInTheDocument();
  });

  it("shows results when filters are enabled and there are events", () => {
    render(<EventsSearch eventsByDay={mockEvents} filters={true} />);

    // Check for date headers (use getAllByText since dayjs mock returns the same date for all entries)
    const dateHeaders = screen.getAllByText("Monday 1st January");
    expect(dateHeaders.length).toBeGreaterThan(0);

    // Check for event titles (not showing Free category events)
    expect(screen.getByText(/Test Event 1/)).toBeInTheDocument();
    expect(screen.queryByText(/Test Event 2/)).not.toBeInTheDocument(); // Free category filtered out
    expect(screen.getByText(/Test Event 3\(\?\)/)).toBeInTheDocument(); // With unconfirmed marker

    // Check for location info
    expect(screen.getByText(/@ Test Venue 1/)).toBeInTheDocument();

    // Check for user initials
    expect(screen.getAllByTestId("user-initials").length).toBe(2);

    // Filters component should be rendered
    expect(screen.getByTestId("filters-component")).toBeInTheDocument();
  });

  it("does not show results section when filters is false", () => {
    render(<EventsSearch eventsByDay={mockEvents} filters={false} />);

    // Results section should not appear
    expect(screen.queryByText("Results")).not.toBeInTheDocument();
    expect(screen.queryByText("Monday 1st January")).not.toBeInTheDocument();

    // Filters should still be shown
    expect(screen.getByTestId("filters-component")).toBeInTheDocument();
  });

  it("shows EmptyStateNoSearch when no filters are active", () => {
    vi.mocked(useSearch).mockReturnValue({
      ...mockSearch,
      activeFilterCount: 0,
    });

    render(<EventsSearch eventsByDay={{}} filters={true} />);

    expect(screen.getByTestId("empty-state-no-search")).toBeInTheDocument();
    expect(
      screen.queryByTestId("empty-state-no-results")
    ).not.toBeInTheDocument();
  });

  it("shows EmptyStateNoResults when filters are active but no results", () => {
    vi.mocked(useSearch).mockReturnValue({
      ...mockSearch,
      activeFilterCount: 2,
    });

    render(<EventsSearch eventsByDay={{}} filters={true} />);

    expect(
      screen.queryByTestId("empty-state-no-search")
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("empty-state-no-results")).toBeInTheDocument();
  });

  it("calls setQuery when the search input changes", () => {
    render(<EventsSearch eventsByDay={mockEvents} filters={true} />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "new search" } });

    expect(mockSearch.setQuery).toHaveBeenCalledWith("new search");
  });

  it("calls clearAllFilters when clear button is clicked", () => {
    render(<EventsSearch eventsByDay={mockEvents} filters={true} />);

    const clearButton = screen.getByTestId("clear-filters-button");
    fireEvent.click(clearButton);

    expect(mockSearch.clearAllFilters).toHaveBeenCalled();
  });
});
