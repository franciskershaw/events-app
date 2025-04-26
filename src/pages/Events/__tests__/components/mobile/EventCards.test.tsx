import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";
import EventCards from "@/pages/Events/components/mobile/EventCards/EventCards";
import { Event } from "@/types/globalTypes";

import { useScrollVisibility } from "../../../../../hooks/utility/useScrollVisibility";

// Create a complete mock of the search context
const createMockSearchContext = (filteredEvents: Event[] = []) => ({
  allEvents: filteredEvents,
  query: "",
  setQuery: vi.fn(),
  filteredEvents,
  startDate: null,
  setStartDate: vi.fn(),
  endDate: null,
  setEndDate: vi.fn(),
  showEventsFree: false,
  setShowEventsFree: vi.fn(),
  selectedCategory: "",
  setSelectedCategory: vi.fn(),
  categories: [],
  selectedLocation: "",
  setSelectedLocation: vi.fn(),
  locations: [],
  offset: 0,
  setOffset: vi.fn(),
  activeButton: null,
  setActiveButton: vi.fn(),
  clearAllFilters: vi.fn(),
  activeFilterCount: 0,
});

// Mock the search context
vi.mock("@/contexts/SearchEvents/SearchEventsContext", () => ({
  useSearch: vi.fn(() => createMockSearchContext()),
}));

// Mock the scroll visibility hook
vi.mock("../../../../../hooks/utility/useScrollVisibility", () => ({
  useScrollVisibility: vi.fn(() => ({
    isVisible: true,
    isNearBottom: false,
  })),
}));

// Mock the DateScroller component
vi.mock("@/pages/Events/components/mobile/DateScroller/DateScroller", () => ({
  default: ({ label, date }: { label?: string; date?: string }) => (
    <div data-testid="date-scroller">
      {label || (date ? new Date(date).toLocaleDateString() : "")}
    </div>
  ),
}));

// Mock the EventCard component
vi.mock("@/pages/Events/components/mobile/EventCards/EventCard", () => ({
  default: ({ event }: { event: Event }) => (
    <div data-testid="event-card" data-id={event._id}>
      {event.title}
    </div>
  ),
}));

// Mock the EventFreeCard component
vi.mock("@/pages/Events/components/mobile/EventCards/EventFreeCard", () => ({
  default: ({ event }: { event: Event }) => (
    <div data-testid="event-free-card" data-id={event._id}>
      {event.title}
    </div>
  ),
}));

// Mock the helper functions
vi.mock("@/pages/Events/helpers/helpers", () => ({
  filterTodayEvents: vi.fn((events) =>
    events.filter((event: Event) => event.title.includes("Today"))
  ),
  groupEvents: vi.fn((events) => {
    const result: Record<string, Event[]> = {};

    // Group into March and April for testing
    const marchEvents = events.filter((event: Event) =>
      event.title.includes("March")
    );
    const aprilEvents = events.filter((event: Event) =>
      event.title.includes("April")
    );

    if (marchEvents.length > 0) {
      result["March 2023"] = marchEvents;
    }

    if (aprilEvents.length > 0) {
      result["April 2023"] = aprilEvents;
    }

    return result;
  }),
}));

// Mock the constants
vi.mock("../../../../../constants/app", () => ({
  NAV_HEIGHT: "60px",
  CATEGORY_FREE: "free-category-id",
}));

// Mock dayjs
vi.mock("dayjs", () => {
  const mockDayjs = () => ({
    startOf: () => mockDayjs(),
    isSameOrAfter: () => true,
    format: (fmt: string) => `Formatted: ${fmt}`,
  });
  mockDayjs.extend = vi.fn();
  mockDayjs.updateLocale = vi.fn();
  return {
    default: mockDayjs,
  };
});

// Mock dayjs plugins with default exports
vi.mock("dayjs/plugin/advancedFormat", () => ({
  default: {},
}));

vi.mock("dayjs/plugin/isSameOrAfter", () => ({
  default: {},
}));

vi.mock("dayjs/plugin/updateLocale", () => ({
  default: {},
}));

describe("EventCards", () => {
  // Create testing data
  const mockEvents = [
    {
      _id: "today1",
      title: "Today Event 1",
      date: {
        start: "2023-03-15T10:00:00",
        end: "2023-03-15T12:00:00",
      },
      category: {
        _id: "cat1",
        name: "Social",
        icon: "social-icon",
      },
      createdBy: {
        _id: "user1",
        name: "Test User",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      unConfirmed: false,
      private: false,
    },
    {
      _id: "today2",
      title: "Today Event 2",
      date: {
        start: "2023-03-15T14:00:00",
        end: "2023-03-15T16:00:00",
      },
      category: {
        _id: "free-category-id",
        name: "Free",
        icon: "free-icon",
      },
      createdBy: {
        _id: "user1",
        name: "Test User",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      unConfirmed: false,
      private: false,
    },
    {
      _id: "march1",
      title: "March Event 1",
      date: {
        start: "2023-03-20T10:00:00",
        end: "2023-03-20T12:00:00",
      },
      category: {
        _id: "cat1",
        name: "Social",
        icon: "social-icon",
      },
      createdBy: {
        _id: "user1",
        name: "Test User",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      unConfirmed: false,
      private: false,
    },
    {
      _id: "april1",
      title: "April Event 1",
      date: {
        start: "2023-04-05T10:00:00",
        end: "2023-04-05T12:00:00",
      },
      category: {
        _id: "cat1",
        name: "Social",
        icon: "social-icon",
      },
      createdBy: {
        _id: "user1",
        name: "Test User",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      unConfirmed: false,
      private: false,
    },
    {
      _id: "april2",
      title: "April Event 2",
      date: {
        start: "2023-04-10T10:00:00",
        end: "2023-04-10T12:00:00",
      },
      category: {
        _id: "free-category-id",
        name: "Free",
        icon: "free-icon",
      },
      createdBy: {
        _id: "user1",
        name: "Test User",
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      unConfirmed: false,
      private: false,
    },
  ];

  it("renders no events when filtered events is empty", () => {
    // Setup the search context mock to return empty events
    vi.mocked(useSearch).mockReturnValue(createMockSearchContext([]));

    render(<EventCards />);

    // Should not render any date scrollers or events
    expect(screen.queryByTestId("date-scroller")).not.toBeInTheDocument();
    expect(screen.queryByTestId("event-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("event-free-card")).not.toBeInTheDocument();
  });

  it("renders today events in a separate section", () => {
    // Setup the search context mock to return events including today's events
    vi.mocked(useSearch).mockReturnValue(createMockSearchContext(mockEvents));

    render(<EventCards />);

    // Should render a "Today" date scroller
    const dateScrollers = screen.getAllByTestId("date-scroller");
    expect(dateScrollers[0]).toHaveTextContent("Today");

    // Should render the today events - one regular, one free
    expect(screen.getAllByTestId("event-card")[0]).toHaveTextContent(
      "Today Event 1"
    );
    expect(screen.getAllByTestId("event-free-card")[0]).toHaveTextContent(
      "Today Event 2"
    );
  });

  it("renders upcoming events grouped by month", () => {
    // Setup the search context mock to return events
    vi.mocked(useSearch).mockReturnValue(createMockSearchContext(mockEvents));

    render(<EventCards />);

    // Should render date scrollers for each month
    const dateScrollers = screen.getAllByTestId("date-scroller");
    expect(dateScrollers.length).toBe(3); // Today, March, April

    // Should render the March and April events
    const eventCards = screen.getAllByTestId("event-card");
    const freeEventCards = screen.getAllByTestId("event-free-card");

    expect(eventCards.length).toBe(3); // Today1, March1, April1
    expect(freeEventCards.length).toBe(2); // Today2, April2

    // Verify March and April events are included
    expect(
      eventCards.some((card) => card.textContent === "March Event 1")
    ).toBe(true);
    expect(
      eventCards.some((card) => card.textContent === "April Event 1")
    ).toBe(true);
    expect(
      freeEventCards.some((card) => card.textContent === "April Event 2")
    ).toBe(true);
  });

  it("handles navbar visibility by adjusting transform style", () => {
    // Mock scroll visibility to show navbar hidden
    vi.mocked(useScrollVisibility).mockReturnValue({
      isVisible: false,
      isNearBottom: false,
    });

    vi.mocked(useSearch).mockReturnValue(createMockSearchContext(mockEvents));

    const { container } = render(<EventCards />);

    // Check transform style
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveStyle("transform: translateY(-60px)");

    // Update mock to show navbar visible
    vi.mocked(useScrollVisibility).mockReturnValue({
      isVisible: true,
      isNearBottom: false,
    });

    // Re-render with updated visibility
    const { container: newContainer } = render(<EventCards />);
    const updatedMainDiv = newContainer.firstChild as HTMLElement;
    expect(updatedMainDiv).toHaveStyle("transform: translateY(0px)");

    // Test near bottom case
    vi.mocked(useScrollVisibility).mockReturnValue({
      isVisible: false,
      isNearBottom: true,
    });

    const { container: bottomContainer } = render(<EventCards />);
    const bottomMainDiv = bottomContainer.firstChild as HTMLElement;
    expect(bottomMainDiv).toHaveStyle("transform: none");
  });
});
