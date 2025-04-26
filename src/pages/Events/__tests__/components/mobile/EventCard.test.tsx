import { act } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EventCard from "@/pages/Events/components/mobile/EventCards/EventCard";
import { Event } from "@/types/globalTypes";

// Mock dependencies
vi.mock("@/hooks/user/useIsUserEvent", () => ({
  default: vi.fn(() => true),
}));

vi.mock("@/lib/utils", () => ({
  formatDate: () => "Jan 1, 2023",
  formatTime: () => "3:00 PM",
  isWeekend: () => false,
  cn: (...inputs: unknown[]) => inputs.join(" "),
}));

vi.mock("date-fns", () => ({
  isToday: () => false,
}));

vi.mock("@/lib/icons", () => ({
  getCategoryIcon: () => <span data-testid="category-icon" />,
}));

// Mock SwipeableIndicator component
vi.mock(
  "../../../../../components/utility/SwipeableIndicator/SwipeableIndicator",
  () => ({
    default: ({
      orientation,
      alignment,
    }: {
      orientation: string;
      alignment?: string;
    }) => (
      <div
        data-testid={`swipeable-indicator-${orientation}${alignment ? `-${alignment}` : ""}`}
      />
    ),
  })
);

// Mock EventCardActions component
vi.mock(
  "@/pages/Events/components/global/EventCardActions/EventCardActions",
  () => ({
    default: ({ event }: { event: Event }) => (
      <div data-testid="event-card-actions">{event.title}</div>
    ),
  })
);

// Mock UserEventInitials component
vi.mock(
  "@/pages/Events/components/global/UserEventInitials/UserEventInitials",
  () => ({
    UserEventInitials: ({ event }: { event: Event }) => (
      <div data-testid="user-event-initials">{event.title.substring(0, 2)}</div>
    ),
  })
);

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      onClick,
      initial,
      animate,
      ...props
    }: React.HTMLProps<HTMLDivElement> & {
      onClick?: () => void;
      initial?: unknown;
      animate?: unknown;
      transition?: unknown;
    }) => (
      <div
        data-testid="motion-div"
        onClick={onClick}
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        {...props}
      >
        {children}
      </div>
    ),
  },
}));

// Create a mock for useSwipeable that properly mocks the handlers
const swipeHandlersMock = {
  onSwipedLeft: vi.fn(),
  onSwipedRight: vi.fn(),
};

// Mock useSwipeable to return a ref and event handlers object
vi.mock("react-swipeable", () => ({
  useSwipeable: vi.fn(({ onSwipedLeft, onSwipedRight }) => {
    // Store the handlers for tests to access
    swipeHandlersMock.onSwipedLeft = onSwipedLeft;
    swipeHandlersMock.onSwipedRight = onSwipedRight;

    // Return an empty object that's safe to spread
    return {};
  }),
}));

describe("EventCard (mobile)", () => {
  const mockEvent: Event = {
    _id: "123",
    title: "Test Event",
    date: {
      start: "2023-01-01T15:00:00",
      end: "2023-01-01T17:00:00",
    },
    category: {
      _id: "1",
      name: "Social",
      icon: "social-icon",
    },
    location: {
      city: "Test City",
      venue: "Test Venue",
    },
    description: "Test description",
    createdBy: {
      _id: "user123",
      name: "Test User",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    unConfirmed: false,
    private: false,
  };

  it("renders basic event information", () => {
    render(<EventCard event={mockEvent} />);

    // Use more specific selectors to avoid ambiguity
    expect(
      screen.getByRole("heading", { name: "Test Event" })
    ).toBeInTheDocument();
    expect(screen.getByText("Test City")).toBeInTheDocument();
    expect(screen.getByText("Jan 1, 2023")).toBeInTheDocument();
    expect(screen.getByText("Social")).toBeInTheDocument();
    expect(screen.getByTestId("category-icon")).toBeInTheDocument();
  });

  it("shows user event initials", () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByTestId("user-event-initials")).toBeInTheDocument();
    expect(screen.getByTestId("user-event-initials")).toHaveTextContent("Te");
  });

  it("shows swipeable indicators", () => {
    render(<EventCard event={mockEvent} />);

    expect(
      screen.getByTestId("swipeable-indicator-vertical-right")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("swipeable-indicator-horizontal")
    ).toBeInTheDocument();
  });

  it("expands when clicked if there's additional information", () => {
    render(<EventCard event={mockEvent} />);

    // Get the main clickable area and click it
    const mainContent = screen
      .getByRole("heading", { name: "Test Event" })
      .closest("div")?.parentElement?.parentElement;
    fireEvent.click(mainContent!);

    // The expanded view should show additional information
    expect(screen.getByText("Test Venue")).toBeInTheDocument();
    expect(screen.getByText("3:00 PM")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("handles swipe left to show actions", () => {
    render(<EventCard event={mockEvent} />);

    act(() => {
      // Call the onSwipedLeft handler directly
      swipeHandlersMock.onSwipedLeft();
    });

    // Action buttons should be visible
    expect(screen.getByTestId("event-card-actions")).toBeInTheDocument();
  });

  it("applies different styling for unconfirmed events", () => {
    const unconfirmedEvent: Event = {
      ...mockEvent,
      unConfirmed: true,
    };

    render(<EventCard event={unconfirmedEvent} />);

    // Find the main card wrapper by looking for the container with proper classes
    const rootContainer = document.querySelector(".event");
    expect(rootContainer).toHaveClass("border-dashed");

    // Find the content container with opacity class
    const contentContainer = document.querySelector(
      ".relative.flex.flex-col.gap-2.px-4.py-3"
    );
    expect(contentContainer).toHaveClass("opacity-50");
  });
});
