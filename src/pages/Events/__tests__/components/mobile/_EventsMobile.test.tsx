import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EventsMobile } from "@/pages/Events/components/mobile/EventsMobile";

// Mock the useSearch context
const mockUseSearch = vi.fn();
vi.mock("@/contexts/SearchEvents/SearchEventsContext", () => ({
  useSearch: () => mockUseSearch(),
}));

// Mock the child components
vi.mock(
  "@/pages/Events/components/mobile/EventsNavbarTop/EventsNavbarTop",
  () => ({
    default: () => <div data-testid="events-navbar-top">Events Navbar Top</div>,
  })
);

vi.mock(
  "@/pages/Events/components/global/EmptyStateNoResults/EmptyStateNoResults",
  () => ({
    EmptyStateNoResults: () => (
      <div data-testid="empty-state-no-results">No Results</div>
    ),
  })
);

vi.mock(
  "@/pages/Events/components/mobile/EmptyStateNoEvents/EmptyStateNoEvents",
  () => ({
    EmptyStateNoEvents: () => (
      <div data-testid="empty-state-no-events">No Events</div>
    ),
  })
);

vi.mock("@/pages/Events/components/mobile/EventCards/EventCards", () => ({
  default: () => <div data-testid="event-cards">Event Cards</div>,
}));

vi.mock("@/pages/Events/components/mobile/FiltersDrawer/FiltersDrawer", () => ({
  default: () => <div data-testid="filters-drawer">Filters Drawer</div>,
}));

describe("EventsMobile - Main Mobile Container", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders NavbarTop and FiltersDrawer in all cases", () => {
    // Setup mock to return events
    mockUseSearch.mockReturnValue({
      filteredEvents: [{ id: 1 }],
      activeFilterCount: 0,
    });

    render(<EventsMobile />);

    expect(screen.getByTestId("events-navbar-top")).toBeInTheDocument();
    expect(screen.getByTestId("filters-drawer")).toBeInTheDocument();
  });

  it("renders EventCards when filteredEvents exist", () => {
    // Setup mock to return events
    mockUseSearch.mockReturnValue({
      filteredEvents: [{ id: 1 }, { id: 2 }],
      activeFilterCount: 0,
    });

    render(<EventsMobile />);

    expect(screen.getByTestId("event-cards")).toBeInTheDocument();
    expect(
      screen.queryByTestId("empty-state-no-results")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("empty-state-no-events")
    ).not.toBeInTheDocument();
  });

  it("renders EmptyStateNoResults when no events but filters are active", () => {
    // Setup mock to return no events but active filters
    mockUseSearch.mockReturnValue({
      filteredEvents: [],
      activeFilterCount: 2,
    });

    render(<EventsMobile />);

    expect(screen.getByTestId("empty-state-no-results")).toBeInTheDocument();
    expect(screen.queryByTestId("event-cards")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("empty-state-no-events")
    ).not.toBeInTheDocument();
  });

  it("renders EmptyStateNoEvents when no events and no filters", () => {
    // Setup mock to return no events and no active filters
    mockUseSearch.mockReturnValue({
      filteredEvents: [],
      activeFilterCount: 0,
    });

    render(<EventsMobile />);

    expect(screen.getByTestId("empty-state-no-events")).toBeInTheDocument();
    expect(screen.queryByTestId("event-cards")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("empty-state-no-results")
    ).not.toBeInTheDocument();
  });
});
