import { ReactNode } from "react";

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Event } from "@/types/globalTypes";

import Events from "../Events";

// Mock the user hook
const mockUser = { _id: "user1", name: "Test User" };
vi.mock("@/hooks/user/useUser", () => ({
  default: () => ({ user: mockUser }),
}));

// Mock the isMobile hook
const mockIsMobile = vi.fn();
vi.mock("@/hooks/utility/use-mobile", () => ({
  useIsMobile: () => mockIsMobile(),
}));

// Mock usePageTitle
vi.mock("@/hooks/utility/usePageTitle", () => ({
  default: () => vi.fn(),
}));

// Mock the events hook
let mockEvents: Event[] = [
  {
    _id: "event1",
    title: "Test Event 1",
    date: {
      start: "2023-06-15T10:00:00Z",
      end: "2023-06-15T11:00:00Z",
    },
    createdBy: { _id: "user1", name: "Test User" },
    category: { _id: "cat1", name: "Meeting", icon: "calendar" },
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-01T00:00:00Z"),
    unConfirmed: false,
    private: false,
  },
  {
    _id: "event2",
    title: "Test Event 2",
    date: {
      start: "2023-07-20T14:00:00Z",
      end: "2023-07-20T16:00:00Z",
    },
    createdBy: { _id: "user2", name: "Another User" },
    category: { _id: "cat2", name: "Party", icon: "party" },
    createdAt: new Date("2023-01-01T00:00:00Z"),
    updatedAt: new Date("2023-01-01T00:00:00Z"),
    unConfirmed: false,
    private: false,
  },
];

let mockFetchingEvents = false;

vi.mock("@/pages/Events/hooks/useGetEvents", () => ({
  default: () => ({
    events: mockEvents,
    fetchingEvents: mockFetchingEvents,
  }),
}));

// Mock categories hook
const mockCategories = [
  { _id: "cat1", name: "Meeting", icon: "calendar" },
  { _id: "cat2", name: "Party", icon: "party" },
];
vi.mock("@/pages/Events/hooks/useGetEventCategories", () => ({
  default: () => ({
    eventCategories: mockCategories,
  }),
}));

// Mock useEventsFree
const mockEventsFree: Event[] = [];
vi.mock("@/contexts/SearchEvents/hooks/useEventsFree", () => ({
  useEventsFree: () => mockEventsFree,
}));

// Mock helper functions
vi.mock("@/pages/Events/helpers/getFirstAndLastEventDates", () => ({
  getFirstAndLastEventDates: () => ({
    firstEventDate: new Date("2023-06-15"),
    lastEventDate: new Date("2023-07-20"),
  }),
}));

vi.mock("@/pages/Events/helpers/generateRecurringEvents", () => ({
  generateRecurringEvents: (event: Event) => [event],
}));

// Mock child components
vi.mock("@/pages/Events/components/desktop/EventsDesktop", () => ({
  EventsDesktop: () => <div data-testid="events-desktop">Desktop View</div>,
}));

vi.mock("@/pages/Events/components/mobile/EventsMobile", () => ({
  EventsMobile: () => <div data-testid="events-mobile">Mobile View</div>,
}));

// Mock SearchProvider
vi.mock("@/contexts/SearchEvents/SearchEventsContext", () => ({
  SearchProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="search-provider">{children}</div>
  ),
}));

// Mock loading overlay
vi.mock("@/components/ui/loading-overlay", () => ({
  LoadingOverlay: () => <div data-testid="loading-overlay">Loading...</div>,
}));

describe("Events Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchingEvents = false;
  });

  it("renders the desktop view when not on mobile", () => {
    mockIsMobile.mockReturnValue(false);

    render(<Events />);

    expect(screen.getByTestId("search-provider")).toBeInTheDocument();
    expect(screen.getByTestId("events-desktop")).toBeInTheDocument();
    expect(screen.queryByTestId("events-mobile")).not.toBeInTheDocument();
  });

  it("renders the mobile view when on mobile", () => {
    mockIsMobile.mockReturnValue(true);

    render(<Events />);

    expect(screen.getByTestId("search-provider")).toBeInTheDocument();
    expect(screen.getByTestId("events-mobile")).toBeInTheDocument();
    expect(screen.queryByTestId("events-desktop")).not.toBeInTheDocument();
  });

  it("shows loading overlay when fetchingEvents is true and no events yet", () => {
    // Set fetchingEvents to true and clear events for this test only
    mockFetchingEvents = true;
    const originalEvents = [...mockEvents];
    mockEvents = [];

    render(<Events />);

    expect(screen.getByTestId("loading-overlay")).toBeInTheDocument();
    expect(screen.queryByTestId("search-provider")).not.toBeInTheDocument();

    // Restore the original events after the test
    mockEvents = originalEvents;
  });
});
