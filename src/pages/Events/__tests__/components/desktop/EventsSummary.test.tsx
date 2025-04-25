import { render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useActiveDay } from "@/contexts/ActiveDay/ActiveDayContext";
import { EventsSummary } from "@/pages/Events/components/desktop/EventsSummary/EventsSummary";
import { Event } from "@/types/globalTypes";

// Mock dependencies
vi.mock("@/contexts/ActiveDay/ActiveDayContext");
// Mock dayjs with minimal implementation
vi.mock("dayjs", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      format: vi.fn().mockReturnValue("Monday 1st May"),
      isAfter: vi.fn().mockReturnValue(true),
      isBefore: vi.fn().mockReturnValue(true),
      diff: vi.fn().mockReturnValue(0),
      add: vi.fn().mockImplementation(() => ({
        format: vi.fn().mockReturnValue("Tuesday 9th May"),
        isAfter: vi.fn().mockReturnValue(true),
        isBefore: vi.fn().mockReturnValue(true),
        diff: vi.fn().mockReturnValue(0),
      })),
    })),
  };
});

vi.mock("@/pages/Events/components/desktop/EventCard/EventCard", () => ({
  __esModule: true,
  default: ({ event }: { event: Event }) => (
    <div data-testid="event-card">{event.title}</div>
  ),
}));
vi.mock(
  "@/pages/Events/components/desktop/AddEventButton/AddEventButton",
  () => ({
    AddEventButton: () => (
      <button data-testid="add-event-button">Add Event</button>
    ),
  })
);
vi.mock(
  "@/pages/Events/components/desktop/EmptyStateNoEvents/EmptyStateNoEvents",
  () => ({
    EmptyStateNoEvents: () => (
      <div data-testid="empty-state-no-events">No events found</div>
    ),
  })
);
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

vi.mock("@/hooks/useActiveDay", () => ({
  useActiveDay: vi.fn().mockReturnValue({
    activeDay: "2023-05-01" as string,
    setActiveDay: vi.fn() as (day: string) => void,
  }),
}));

describe("EventsSummary", () => {
  // Create mock events
  const mockEvents: Record<string, Event[]> = {
    "2023-05-01": [
      {
        _id: "today-event-1",
        title: "Today Event 1",
        date: {
          start: "2023-05-01T10:00:00Z",
          end: "2023-05-01T12:00:00Z",
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
        _id: "today-event-2",
        title: "Today Event 2",
        date: {
          start: "2023-05-01T14:00:00Z",
          end: "2023-05-01T16:00:00Z",
        },
        category: {
          _id: "cat2",
          name: "Workshop",
          icon: "calendar-workshop",
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
    "2023-05-03": [
      {
        _id: "upcoming-event-1",
        title: "Upcoming Event 1",
        date: {
          start: "2023-05-03T10:00:00Z",
          end: "2023-05-03T12:00:00Z",
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
    "2023-05-07": [
      {
        _id: "upcoming-event-2",
        title: "Upcoming Event 2",
        date: {
          start: "2023-05-07T10:00:00Z",
          end: "2023-05-07T12:00:00Z",
        },
        category: {
          _id: "cat3",
          name: "Meetup",
          icon: "calendar-meetup",
        },
        createdBy: {
          _id: "user3",
          name: "Alice Johnson",
        },
        location: {
          venue: "Test Venue 4",
          city: "Test City",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        unConfirmed: false,
        private: false,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default active day
    vi.mocked(useActiveDay).mockReturnValue({
      activeDay: {
        format: vi.fn((format) => {
          if (format === "YYYY-MM-DD") return "2023-05-01";
          return "Monday 1st May";
        }),
        add: vi.fn().mockReturnValue({
          format: vi.fn().mockReturnValue("Tuesday 9th May"),
          isAfter: vi.fn().mockReturnValue(true),
          isBefore: vi.fn().mockReturnValue(true),
          diff: vi.fn().mockReturnValue(0),
        }),
      } as unknown as dayjs.Dayjs,
      setActiveDay: vi.fn(),
    });
  });

  it("displays empty state when there are no events", () => {
    render(<EventsSummary eventsByDay={{}} />);

    expect(screen.getByTestId("empty-state-no-events")).toBeInTheDocument();
    expect(screen.queryByTestId("event-card")).not.toBeInTheDocument();
  });

  it("displays events for the active day", () => {
    render(<EventsSummary eventsByDay={mockEvents} />);

    // Should show header for the active day - use a more specific query
    expect(
      screen.getByRole("heading", { level: 2, name: /Monday 1st May/i })
    ).toBeInTheDocument();

    // Should show today's events
    expect(screen.getAllByTestId("event-card").length).toBe(2);

    // Should show the add event button
    expect(screen.getByTestId("add-event-button")).toBeInTheDocument();
  });

  it("displays 'No events on this day' message when there are no events for active day", () => {
    // Mock active day to return a different date format for a day with no events
    vi.mocked(useActiveDay).mockReturnValue({
      activeDay: {
        format: vi.fn().mockReturnValue("Tuesday 2nd May"),
        add: vi.fn().mockReturnValue({
          format: vi.fn().mockReturnValue("Tuesday 9th May"),
          isAfter: vi.fn().mockReturnValue(true),
          isBefore: vi.fn().mockReturnValue(true),
          diff: vi.fn().mockReturnValue(0),
        }),
      } as unknown as dayjs.Dayjs,
      setActiveDay: vi.fn(),
    });

    render(<EventsSummary eventsByDay={mockEvents} />);

    expect(screen.getByText("No events on this day.")).toBeInTheDocument();
    expect(screen.getByTestId("add-event-button")).toBeInTheDocument();
  });
});
