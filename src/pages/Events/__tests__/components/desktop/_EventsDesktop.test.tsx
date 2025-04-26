import { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Import the component to test
import { EventsDesktop } from "@/pages/Events/components/desktop/EventsDesktop";

// Mock useSearch
const mockUseSearch = vi.fn();
vi.mock("@/contexts/SearchEvents/SearchEventsContext", () => ({
  useSearch: () => mockUseSearch(),
}));

// Mock useSidebarContent
const mockUseSidebarContent = vi.fn();
vi.mock("@/contexts/Sidebar/desktop/SidebarContentContext", () => ({
  useSidebarContent: () => mockUseSidebarContent(),
  SidebarContentProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="sidebar-content-provider">{children}</div>
  ),
}));

// Mock useUser
vi.mock("@/hooks/user/useUser", () => ({
  default: () => ({ user: { _id: "user1", name: "User 1" } }),
}));

// Mock useGetPastMonthEvents
vi.mock("@/pages/Events/hooks/useGetPastMonthEvents", () => ({
  default: () => ({ eventsPastMonth: [] }),
}));

// Mock the sidebar components
vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children }: { children: ReactNode }) => (
    <div data-testid="sidebar">{children}</div>
  ),
  SidebarContent: ({ children }: { children: ReactNode }) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  SidebarTrigger: () => <div data-testid="sidebar-trigger">Trigger</div>,
}));

// Mock ActiveDayProvider
vi.mock("@/contexts/ActiveDay/ActiveDayContext", () => ({
  ActiveDayProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="active-day-provider">{children}</div>
  ),
}));

// Mock helper functions
vi.mock("@/pages/Events/helpers/filterUserEvents", () => ({
  filterUserEvents: (events: unknown[]) => events,
}));

vi.mock("@/pages/Events/helpers/getFirstAndLastEventDates", () => ({
  getFirstAndLastEventDates: () => ({
    firstEventDate: {
      format: () => "June 2023",
      month: () => 5,
      year: () => 2023,
    },
    lastEventDate: {
      format: () => "July 2023",
      month: () => 6,
      year: () => 2023,
    },
  }),
}));

vi.mock("@/pages/Events/helpers/generateMonthColumns", () => ({
  generateMonthColumns: () => [
    {
      format: (fmt: string) => (fmt === "MMMM YYYY" ? "June 2023" : "2023-06"),
      month: () => 5,
      year: () => 2023,
    },
    {
      format: (fmt: string) => (fmt === "MMMM YYYY" ? "July 2023" : "2023-07"),
      month: () => 6,
      year: () => 2023,
    },
  ],
}));

vi.mock("@/pages/Events/helpers/helpers", () => ({
  getEventsByDay: () => ({
    "2023-06-01": [{ _id: "event-1" }],
    "2023-06-15": [{ _id: "event-2" }],
  }),
}));

// Mock the constants
vi.mock("@/constants/app", () => ({
  LOCATION_DEFAULT: "All Locations",
  LOCATION_SHOW: true,
}));

// Mock child components
vi.mock("@/pages/Events/components/desktop/EventsSearch/EventsSearch", () => ({
  EventsSearch: ({ filters }: { filters: boolean }) => (
    <div data-testid="events-search" data-filters={String(filters || false)}>
      Events Search
    </div>
  ),
}));

vi.mock(
  "@/pages/Events/components/desktop/EventsSummary/EventsSummary",
  () => ({
    EventsSummary: () => <div data-testid="events-summary">Events Summary</div>,
  })
);

vi.mock("@/pages/Events/components/desktop/MonthColumn/MonthColumn", () => ({
  MonthColumn: ({
    month,
    filters,
  }: {
    month: { format: (fmt: string) => string };
    filters: boolean;
  }) => (
    <div
      data-testid="month-column"
      data-month={month?.format("MMMM YYYY")}
      data-filters={String(filters || false)}
    >
      Month Column
    </div>
  ),
}));

describe("EventsDesktop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock values
    mockUseSearch.mockReturnValue({
      filteredEvents: [
        {
          _id: "event-1",
          date: {
            start: "2023-06-01T10:00:00Z",
            end: "2023-06-01T11:00:00Z",
          },
        },
        {
          _id: "event-2",
          date: {
            start: "2023-06-15T14:00:00Z",
            end: "2023-06-15T15:00:00Z",
          },
        },
      ],
      activeFilterCount: 0,
    });

    mockUseSidebarContent.mockReturnValue({
      sidebarContent: "events",
      setSidebarContent: vi.fn(),
    });
  });

  it("renders the correct structure with providers", () => {
    render(<EventsDesktop />);

    // Check high-level structure
    expect(screen.getByTestId("active-day-provider")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-provider")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
  });

  it("shows EventsSummary when sidebarContent is 'events'", () => {
    mockUseSidebarContent.mockReturnValue({
      sidebarContent: "events",
      setSidebarContent: vi.fn(),
    });

    render(<EventsDesktop />);

    expect(screen.getByTestId("events-summary")).toBeInTheDocument();
    expect(screen.queryByTestId("events-search")).not.toBeInTheDocument();
  });

  it("shows EventsSearch when sidebarContent is 'search'", () => {
    mockUseSidebarContent.mockReturnValue({
      sidebarContent: "search",
      setSidebarContent: vi.fn(),
    });

    render(<EventsDesktop />);

    expect(screen.getByTestId("events-search")).toBeInTheDocument();
    expect(screen.queryByTestId("events-summary")).not.toBeInTheDocument();
  });

  it("renders multiple month columns", () => {
    render(<EventsDesktop />);

    const monthColumns = screen.getAllByTestId("month-column");
    expect(monthColumns).toHaveLength(2);
    expect(monthColumns[0]).toHaveAttribute("data-month", "June 2023");
    expect(monthColumns[1]).toHaveAttribute("data-month", "July 2023");
  });

  it("passes filters flag to components when there are active filters", () => {
    mockUseSearch.mockReturnValue({
      filteredEvents: [
        {
          _id: "event-1",
          date: {
            start: "2023-06-01T10:00:00Z",
            end: "2023-06-01T11:00:00Z",
          },
        },
      ],
      activeFilterCount: 2,
    });

    mockUseSidebarContent.mockReturnValue({
      sidebarContent: "search",
      setSidebarContent: vi.fn(),
    });

    render(<EventsDesktop />);

    // Check that filters flag is passed to the search component
    expect(screen.getByTestId("events-search")).toHaveAttribute(
      "data-filters",
      "true"
    );

    // Check that filters flag is passed to month columns
    const monthColumns = screen.getAllByTestId("month-column");
    expect(monthColumns[0]).toHaveAttribute("data-filters", "true");
    expect(monthColumns[1]).toHaveAttribute("data-filters", "true");
  });
});
