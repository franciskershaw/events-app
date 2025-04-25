import { render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";

import { MonthColumn } from "@/pages/Events/components/desktop/MonthColumn/MonthColumn";
import { Event } from "@/types/globalTypes";

// Mock dependencies
vi.mock("dayjs", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      format: vi.fn().mockReturnValue("January 2023"),
      daysInMonth: vi.fn().mockReturnValue(31),
      date: vi.fn().mockImplementation((day) => ({
        format: vi
          .fn()
          .mockReturnValue(`2023-01-${day.toString().padStart(2, "0")}`),
      })),
    })),
  };
});

// Mock the DayCell component
vi.mock("@/pages/Events/components/desktop/DayCell/DayCell", () => ({
  DayCell: ({
    currentDate,
    eventData,
    showLocations,
    defaultLocation,
    filters,
  }: {
    currentDate: { format: () => string };
    eventData?: Event[];
    showLocations: boolean;
    defaultLocation: string;
    filters: boolean;
  }) => (
    <div
      data-testid="day-cell"
      data-date={currentDate.format()}
      data-has-events={Boolean(eventData?.length)}
    >
      <span>Day Cell: {currentDate.format()}</span>
      {eventData && (
        <span data-testid="event-count">{eventData.length} events</span>
      )}
      {showLocations && (
        <span data-testid="show-locations">Shows locations</span>
      )}
      {defaultLocation && (
        <span data-testid="default-location">{defaultLocation}</span>
      )}
      {filters && <span data-testid="has-filters">Has filters</span>}
    </div>
  ),
}));

describe("MonthColumn", () => {
  // Create mock events
  const mockEvents: Record<string, Event[]> = {
    "2023-01-01": [
      {
        _id: "event-1",
        title: "New Year's Day Event",
        date: {
          start: "2023-01-01T10:00:00Z",
          end: "2023-01-01T12:00:00Z",
        },
        category: {
          _id: "cat1",
          name: "Holiday",
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
    ],
    "2023-01-15": [
      {
        _id: "event-2",
        title: "Mid-Month Event",
        date: {
          start: "2023-01-15T14:00:00Z",
          end: "2023-01-15T16:00:00Z",
        },
        category: {
          _id: "cat2",
          name: "Meeting",
          icon: "calendar-meeting",
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
  };

  it("renders the month header correctly", () => {
    render(
      <MonthColumn
        month={dayjs()}
        eventsByDay={mockEvents}
        showLocations={false}
        defaultLocation=""
        filters={false}
      />
    );

    expect(
      screen.getByRole("heading", { level: 2, name: /January 2023/i })
    ).toBeInTheDocument();
  });

  it("renders the correct number of day cells", () => {
    render(
      <MonthColumn
        month={dayjs()}
        eventsByDay={mockEvents}
        showLocations={false}
        defaultLocation=""
        filters={false}
      />
    );

    expect(screen.getAllByTestId("day-cell").length).toBe(31);
  });

  it("passes event data to day cells", () => {
    render(
      <MonthColumn
        month={dayjs()}
        eventsByDay={mockEvents}
        showLocations={false}
        defaultLocation=""
        filters={false}
      />
    );

    // We expect to find 2 DayCells with event data (based on our mockEvents)
    expect(screen.getAllByTestId("event-count").length).toBe(2);
  });

  it("passes showLocations prop to day cells", () => {
    render(
      <MonthColumn
        month={dayjs()}
        eventsByDay={mockEvents}
        showLocations={true}
        defaultLocation=""
        filters={false}
      />
    );

    // All 31 day cells should show locations
    expect(screen.getAllByTestId("show-locations").length).toBe(31);
  });

  it("passes defaultLocation prop to day cells", () => {
    const defaultLocation = "Default Test Location";

    render(
      <MonthColumn
        month={dayjs()}
        eventsByDay={mockEvents}
        showLocations={false}
        defaultLocation={defaultLocation}
        filters={false}
      />
    );

    // All day cells should have the default location
    const locationElements = screen.getAllByTestId("default-location");
    expect(locationElements.length).toBe(31);
    expect(locationElements[0].textContent).toBe(defaultLocation);
  });

  it("passes filters prop to day cells", () => {
    render(
      <MonthColumn
        month={dayjs()}
        eventsByDay={mockEvents}
        showLocations={false}
        defaultLocation=""
        filters={true}
      />
    );

    // All day cells should have filters
    expect(screen.getAllByTestId("has-filters").length).toBe(31);
  });
});
