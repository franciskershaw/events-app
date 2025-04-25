import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import EventCard from "@/pages/Events/components/desktop/EventCard/EventCard";
import { Event } from "@/types/globalTypes";

// Mock dependencies
vi.mock(
  "@/pages/Events/components/global/UserEventInitials/UserEventInitials",
  () => ({
    UserEventInitials: ({ event }: { event: Event }) => (
      <div data-testid="user-event-initials">
        UserInitials-{event.createdBy.name}
      </div>
    ),
  })
);

vi.mock(
  "@/pages/Events/components/global/EventCardActions/EventCardActions",
  () => ({
    __esModule: true,
    default: ({ event }: { event: Event }) => (
      <div data-testid="event-card-actions">Actions-{event.title}</div>
    ),
  })
);

vi.mock("@/lib/utils", () => ({
  formatDate: vi.fn().mockImplementation(() => "January 1, 2023"),
  formatTime: vi.fn().mockImplementation(() => "10:00 AM"),
}));

vi.mock("@/lib/icons", () => ({
  getCategoryIcon: vi
    .fn()
    .mockImplementation(() => <span data-testid="category-icon">📅</span>),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className: string;
    }) => (
      <div className={className} data-testid="motion-div">
        {children}
      </div>
    ),
  },
}));

describe("EventCard", () => {
  // Mock event data
  const mockEvent: Event = {
    _id: "event123",
    title: "Test Event",
    date: {
      start: "2023-01-01T10:00:00Z",
      end: "2023-01-01T12:00:00Z",
    },
    location: {
      venue: "Test Venue",
      city: "Test City",
    },
    category: {
      _id: "category1",
      name: "Conference",
      icon: "calendar",
    },
    createdBy: {
      _id: "user1",
      name: "John Doe",
    },
    description: "This is a test event description",
    createdAt: new Date(),
    updatedAt: new Date(),
    unConfirmed: false,
    private: false,
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders event details correctly", () => {
    render(<EventCard event={mockEvent} />);

    // Check title (use a more specific selector)
    const titleElement = screen.getByText((content, element) => {
      return (
        content.includes("Test Event") &&
        element?.tagName.toLowerCase() === "span" &&
        !element?.getAttribute("data-testid")
      );
    });
    expect(titleElement).toBeInTheDocument();

    // Check time
    expect(screen.getByText(/10:00 AM:/)).toBeInTheDocument();

    // Check date
    expect(screen.getByText(/January 1, 2023 \|/)).toBeInTheDocument();

    // Check category
    expect(screen.getByText("Conference")).toBeInTheDocument();
    expect(screen.getByTestId("category-icon")).toBeInTheDocument();

    // Check location
    expect(screen.getByText(/\| Test Venue/)).toBeInTheDocument();
    expect(screen.getByText(/\| Test City/)).toBeInTheDocument();

    // Check description
    expect(
      screen.getByText("This is a test event description")
    ).toBeInTheDocument();

    // Check user initials
    expect(screen.getByTestId("user-event-initials")).toBeInTheDocument();
  });

  it("shows '(?)' for unconfirmed events", () => {
    // Create unconfirmed event
    const unconfirmedEvent = { ...mockEvent, unConfirmed: true };
    render(<EventCard event={unconfirmedEvent} />);

    const titleWithUnconfirmed = screen.getByText((content, element) => {
      return (
        content.includes("Test Event(?)") &&
        element?.tagName.toLowerCase() === "span" &&
        !element?.getAttribute("data-testid")
      );
    });
    expect(titleWithUnconfirmed).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    // Create event without description
    const eventWithoutDescription = { ...mockEvent, description: undefined };
    render(<EventCard event={eventWithoutDescription} />);

    expect(
      screen.queryByText("This is a test event description")
    ).not.toBeInTheDocument();
  });

  it("does not render location when not provided", () => {
    // Create event without location
    const eventWithoutLocation = { ...mockEvent, location: undefined };
    render(<EventCard event={eventWithoutLocation} />);

    expect(screen.queryByText(/\| Test Venue/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\| Test City/)).not.toBeInTheDocument();
  });

  it("shows event card actions", () => {
    render(<EventCard event={mockEvent} />);

    // The actions should be rendered (since we mocked framer-motion)
    expect(screen.getByTestId("event-card-actions")).toBeInTheDocument();
    expect(screen.getByTestId("motion-div")).toBeInTheDocument();

    // Check that it contains the correct content
    expect(screen.getByText(`Actions-${mockEvent.title}`)).toBeInTheDocument();
  });
});
