import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Import after mocks
import EventFreeCard from "@/pages/Events/components/mobile/EventCards/EventFreeCard";
import { Event } from "@/types/globalTypes";

// Mock the ModalsContext
const openEventModalMock = vi.fn();
vi.mock("../../../../../contexts/Modals/ModalsContext", () => ({
  useModals: () => ({
    openEventModal: openEventModalMock,
  }),
}));

// Mock utils
vi.mock("@/lib/utils", () => ({
  formatDate: () => "March 15, 2023",
  isWeekend: vi.fn(
    (date) => date.includes("Saturday") || date.includes("Sunday")
  ),
  cn: (...inputs: unknown[]) => inputs.join(" "),
}));

// Mock date-fns
vi.mock("date-fns", () => ({
  isToday: vi.fn((date) => date.includes("today")),
}));

describe("EventFreeCard", () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createMockEvent = (overrides = {}): Event => ({
    _id: "free1",
    title: "Free Event",
    date: {
      start: "2023-03-15T10:00:00",
      end: "2023-03-15T12:00:00",
    },
    category: {
      _id: "free-cat",
      name: "Free",
      icon: "free-icon",
    },
    location: {
      city: "Test City",
      venue: "Test Venue",
    },
    createdBy: {
      _id: "user1",
      name: "Test User",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    unConfirmed: false,
    private: false,
    ...overrides,
  });

  it("renders the formatted date", () => {
    const mockEvent = createMockEvent();
    render(<EventFreeCard event={mockEvent} />);

    expect(screen.getByText("March 15, 2023")).toBeInTheDocument();
  });

  it("renders the location city when provided", () => {
    const mockEvent = createMockEvent();
    render(<EventFreeCard event={mockEvent} />);

    expect(screen.getByText("Test City")).toBeInTheDocument();
  });

  it("does not render location when city is not provided", () => {
    const mockEvent = createMockEvent({ location: undefined });
    render(<EventFreeCard event={mockEvent} />);

    expect(screen.queryByText("Test City")).not.toBeInTheDocument();
  });

  it("applies weekend styling for weekend dates", () => {
    const mockEvent = createMockEvent({
      date: {
        start: "2023-03-18T10:00:00 Saturday", // Ensure isWeekend returns true
        end: "2023-03-18T12:00:00",
      },
    });

    const { container } = render(<EventFreeCard event={mockEvent} />);

    expect(container.firstChild).toHaveClass("event--weekend");
  });

  it("applies today styling for today's dates", () => {
    const mockEvent = createMockEvent({
      date: {
        start: "2023-03-15T10:00:00 today", // Ensure isToday returns true
        end: "2023-03-15T12:00:00",
      },
    });

    const { container } = render(<EventFreeCard event={mockEvent} />);

    expect(container.firstChild).toHaveClass("event--today");
    expect(container.firstChild).not.toHaveClass("mx-2");
  });

  it("applies margin styling for non-today dates", () => {
    const mockEvent = createMockEvent();

    const { container } = render(<EventFreeCard event={mockEvent} />);

    expect(container.firstChild).toHaveClass("mx-2");
    expect(container.firstChild).not.toHaveClass("event--today");
  });

  it("opens the event modal with correct parameters when clicked", () => {
    const mockEvent = createMockEvent();
    render(<EventFreeCard event={mockEvent} />);

    // Click the card
    fireEvent.click(screen.getByText("March 15, 2023").closest("div")!);

    // Verify the modal was opened with the right parameters
    expect(openEventModalMock).toHaveBeenCalledTimes(1);

    // Check that first argument contains the expected structure
    const firstArg = openEventModalMock.mock.calls[0][0];
    expect(firstArg.date.start).toBe(mockEvent.date.start);

    // Safely check location if it exists
    if (mockEvent.location) {
      expect(firstArg.location.city).toBe(mockEvent.location.city);
    }

    // Check that the second argument is the right mode
    expect(openEventModalMock.mock.calls[0][1]).toBe("addFromFreeEvent");
  });
});
