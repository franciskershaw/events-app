import { fireEvent, render, screen } from "@testing-library/react";
import dayjs, { Dayjs } from "dayjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  SidebarContentContextType,
  useSidebarContent,
} from "@/contexts/Sidebar/desktop/SidebarContentContext";

import { useActiveDay } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import useUser from "../../../../../hooks/user/useUser";
import { Event, User } from "../../../../../types/globalTypes";
import { DayCell } from "../../../components/desktop/DayCell/DayCell";

// Mock hooks
vi.mock("@/contexts/Sidebar/desktop/SidebarContentContext");
vi.mock("../../../../../contexts/ActiveDay/ActiveDayContext");
vi.mock("../../../../../hooks/user/useUser");

// Type safety for mocked hooks
const mockedUseSidebarContent = vi.mocked(useSidebarContent);
const mockedUseActiveDay = vi.mocked(useActiveDay);
const mockedUseUser = vi.mocked(useUser);

describe("DayCell", () => {
  // Default mock implementations
  const mockSetActiveDay = vi.fn<(date: Dayjs) => void>();
  const mockSetSidebarContent =
    vi.fn<(content: SidebarContentContextType["sidebarContent"]) => void>();
  const mockSetSidebarOpenNavClick = vi.fn<(open: boolean) => void>();
  const mockUpdateUser = vi.fn<(newUser: User) => void>();
  const mockClearUser = vi.fn<() => Promise<void>>();
  const defaultUser: User = {
    _id: "user1",
    name: "Test User",
    email: "test@example.com",
    connections: [],
    accessToken: "fake-token",
  };
  const defaultActiveDay = dayjs();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseSidebarContent.mockReturnValue({
      sidebarContent: "events",
      setSidebarContent: mockSetSidebarContent,
      sidebarOpenNavClick: false,
      setSidebarOpenNavClick: mockSetSidebarOpenNavClick,
    });

    mockedUseActiveDay.mockReturnValue({
      activeDay: defaultActiveDay,
      setActiveDay: mockSetActiveDay,
    });

    mockedUseUser.mockReturnValue({
      user: defaultUser,
      fetchingUser: false,
      updateUser: mockUpdateUser,
      clearUser: mockClearUser,
    });
  });

  it("renders the correct date format", () => {
    const testDate = dayjs("2024-07-15");
    render(
      <DayCell
        currentDate={testDate}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    const dateElement = screen.getByText((_, element) => {
      return (
        element?.textContent === "Mon 15" &&
        element?.classList.contains("event-date")
      );
    });
    expect(dateElement).toBeInTheDocument();
  });

  it("applies 'event--today' class when date is today and filters are false", () => {
    const today = dayjs();
    const { container } = render(
      <DayCell
        currentDate={today}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    expect(container.firstChild).toHaveClass("event--today");
    expect(container.firstChild).not.toHaveClass("event--past");
    expect(container.firstChild).not.toHaveClass("event--weekend");
    expect(container.firstChild).not.toHaveClass("event--weekend-past");
    expect(container.firstChild).not.toHaveClass("event--default");
  });

  it("applies 'event--past' class for past dates", () => {
    const pastDate = dayjs().subtract(2, "day");
    const finalPastDate =
      pastDate.day() === 0 || pastDate.day() === 6
        ? pastDate.subtract(2, "day")
        : pastDate;
    const { container } = render(
      <DayCell
        currentDate={finalPastDate}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    expect(container.firstChild).toHaveClass("event--past");
    if (finalPastDate.day() !== 0 && finalPastDate.day() !== 6) {
      expect(container.firstChild).toHaveClass("event--default");
    }
  });

  it("applies 'event--weekend' class for future weekend dates", () => {
    // Use const for variables not reassigned
    const futureWeekend = dayjs().add(1, "week").day(6);
    const { container } = render(
      <DayCell
        currentDate={futureWeekend}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    expect(container.firstChild).toHaveClass("event--weekend");
    expect(container.firstChild).not.toHaveClass("event--past");
  });

  it("applies 'event--weekend-past' class for past weekend dates", () => {
    // Use const
    const pastWeekend = dayjs().subtract(1, "week").day(0);
    const { container } = render(
      <DayCell
        currentDate={pastWeekend}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    expect(container.firstChild).toHaveClass("event--weekend-past");
    expect(container.firstChild).toHaveClass("event--past");
  });

  it("applies 'event--selected' and 'font-bold' class when date is selected", () => {
    const testDate = dayjs("2024-07-16");
    mockedUseActiveDay.mockReturnValue({
      activeDay: testDate,
      setActiveDay: mockSetActiveDay,
    });
    const { container } = render(
      <DayCell
        currentDate={testDate}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    expect(container.firstChild).toHaveClass("event--selected");
    expect(container.firstChild).toHaveClass("font-bold");
  });

  it("calls setActiveDay with the correct date on click", () => {
    const testDate = dayjs("2024-07-17");
    const { container } = render(
      <DayCell
        currentDate={testDate}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    fireEvent.click(container.firstChild!);
    expect(mockSetActiveDay).toHaveBeenCalledTimes(1);
    expect(mockSetActiveDay).toHaveBeenCalledWith(testDate);
    expect(mockSetSidebarContent).not.toHaveBeenCalled();
  });

  it("calls setActiveDay and setSidebarContent when sidebar is 'search' on click", () => {
    const testDate = dayjs("2024-07-18");
    mockedUseSidebarContent.mockReturnValue({
      sidebarContent: "search",
      setSidebarContent: mockSetSidebarContent,
      sidebarOpenNavClick: false,
      setSidebarOpenNavClick: mockSetSidebarOpenNavClick,
    });
    const { container } = render(
      <DayCell
        currentDate={testDate}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    fireEvent.click(container.firstChild!);
    expect(mockSetActiveDay).toHaveBeenCalledTimes(1);
    expect(mockSetActiveDay).toHaveBeenCalledWith(testDate);
    expect(mockSetSidebarContent).toHaveBeenCalledTimes(1);
    expect(mockSetSidebarContent).toHaveBeenCalledWith("events");
  });

  // --- Tests for eventData Prop ---

  // Helper function to create event objects - CORRECTED SIGNATURE
  const createEvent = (
    id: string,
    title: string,
    userId: string,
    userName: string,
    categoryName = "Meeting",
    unConfirmed = false,
    locationCity?: string,
    categoryIcon = "default_icon", // Added icon default
    locationVenue = "Default Venue" // Added venue default
  ): Event => ({
    _id: id,
    title: title,
    date: { start: dayjs().toISOString(), end: dayjs().toISOString() }, // Provide valid ISO strings
    category: {
      _id: "cat-" + categoryName,
      name: categoryName,
      icon: categoryIcon,
    }, // Added icon
    createdBy: { _id: userId, name: userName }, // Corrected structure
    unConfirmed: unConfirmed,
    // Corrected location structure
    ...(locationCity && {
      location: { city: locationCity, venue: locationVenue },
    }),
    // Add required fields with defaults
    createdAt: new Date(),
    updatedAt: new Date(),
    private: false,
  });

  it("displays user events correctly", () => {
    const testDate = dayjs();
    const userEvent = createEvent(
      "evt1",
      "User Meeting",
      defaultUser._id,
      defaultUser.name
    );
    render(
      <DayCell
        currentDate={testDate}
        eventData={[userEvent]}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    expect(screen.getByText("User Meeting")).toBeInTheDocument();
    // Check it's not italic
    expect(screen.getByText("User Meeting").tagName).not.toBe("I");
    expect(screen.getByText("User Meeting")).not.toHaveClass("italic");
  });

  it("displays user reminder events correctly (italic)", () => {
    const testDate = dayjs();
    const reminderEvent = createEvent(
      "evt2",
      "User Reminder",
      defaultUser._id,
      defaultUser.name,
      "Reminder"
    );
    render(
      <DayCell
        currentDate={testDate}
        eventData={[reminderEvent]}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    // Reminder text should be wrapped in <i>
    const reminderText = screen.getByText("User Reminder");
    expect(reminderText).toBeInTheDocument();
    expect(reminderText.tagName).toBe("I");
  });

  it("displays unconfirmed user events correctly", () => {
    const testDate = dayjs();
    const unconfirmedEvent = createEvent(
      "evt3",
      "User Task",
      defaultUser._id,
      defaultUser.name,
      "Task",
      true
    );
    render(
      <DayCell
        currentDate={testDate}
        eventData={[unconfirmedEvent]}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    expect(screen.getByText("User Task(?)")).toBeInTheDocument();
  });

  it("displays unconfirmed user reminder events correctly", () => {
    const testDate = dayjs();
    const unconfirmedReminder = createEvent(
      "evt4",
      "User Check",
      defaultUser._id,
      defaultUser.name,
      "Reminder",
      true
    );
    render(
      <DayCell
        currentDate={testDate}
        eventData={[unconfirmedReminder]}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    // Reminder text should be wrapped in <i>
    const reminderText = screen.getByText("User Check?"); // Note the ? inside the italics
    expect(reminderText).toBeInTheDocument();
    expect(reminderText.tagName).toBe("I");
  });

  it("displays other users' events correctly (italic)", () => {
    const testDate = dayjs();
    const otherUserEvent = createEvent(
      "evt5",
      "Team Sync",
      "user2",
      "Other User"
    );
    render(
      <DayCell
        currentDate={testDate}
        eventData={[otherUserEvent]}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    const eventText = screen.getByText("Team Sync");
    expect(eventText).toBeInTheDocument();
    expect(eventText).toHaveClass("italic");
  });

  it("displays unconfirmed other users' events correctly (italic)", () => {
    const testDate = dayjs();
    const otherUnconfirmed = createEvent(
      "evt6",
      "Guest Talk",
      "user3",
      "Guest User",
      "Meeting",
      true
    );
    render(
      <DayCell
        currentDate={testDate}
        eventData={[otherUnconfirmed]}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    const eventText = screen.getByText("Guest Talk?"); // Note the ?
    expect(eventText).toBeInTheDocument();
    expect(eventText).toHaveClass("italic");
  });

  it("displays a mix of user and other events correctly", () => {
    const testDate = dayjs();
    const userEvt = createEvent(
      "evt7",
      "My Event",
      defaultUser._id,
      defaultUser.name
    );
    const otherEvt = createEvent("evt8", "Their Event", "user2", "Other User");
    render(
      <DayCell
        currentDate={testDate}
        eventData={[userEvt, otherEvt]}
        showLocations={false}
        defaultLocation="Default City"
        filters={false}
      />
    );
    // Check both texts are present, separated by comma
    const container = screen.getByText((_, node) => {
      const hasText = (node: Element | null) =>
        node?.textContent === "My Event, Their Event";
      const nodeHasText = hasText(node);
      const childrenDontHaveText = Array.from(node?.children || []).every(
        (child) => !hasText(child)
      );
      return nodeHasText && childrenDontHaveText;
    });
    expect(container).toBeInTheDocument();
    expect(screen.getByText("My Event").tagName).not.toBe("I"); // User event not italic
    expect(screen.getByText("Their Event")).toHaveClass("italic"); // Other event italic
  });

  it("displays event locations when showLocations is true", () => {
    const testDate = dayjs();
    const eventWithLocation = createEvent(
      "evt9",
      "Offsite",
      defaultUser._id,
      defaultUser.name,
      "Meeting",
      false,
      "Remote City"
    );
    const eventWithDefaultLocation = createEvent(
      "evt10",
      "Onsite",
      defaultUser._id,
      defaultUser.name,
      "Meeting",
      false,
      "Default City"
    );
    const eventUnconfirmedLocation = createEvent(
      "evt11",
      "Workshop",
      defaultUser._id,
      defaultUser.name,
      "Meeting",
      true,
      "Another City"
    );
    const otherUserLocation = createEvent(
      "evt12",
      "Conf",
      "user2",
      "Other",
      "Meeting",
      false,
      "Other Remote"
    ); // Should not show

    render(
      <DayCell
        currentDate={testDate}
        eventData={[
          eventWithLocation,
          eventWithDefaultLocation,
          eventUnconfirmedLocation,
          otherUserLocation,
        ]}
        showLocations={true}
        defaultLocation="Default City"
        filters={false}
      />
    );

    // Should show non-default and unconfirmed locations for the logged-in user
    const locationElement = screen.getByText("Remote City, Another City(?)");
    expect(locationElement).toBeInTheDocument();
    expect(locationElement).toHaveClass("truncate"); // Check location specific styling
    expect(screen.queryByText("Default City")).not.toBeInTheDocument(); // Default location hidden
    expect(screen.queryByText("Other Remote")).not.toBeInTheDocument(); // Other user location hidden
  });

  it("does not display locations when showLocations is false", () => {
    const testDate = dayjs();
    const eventWithLocation = createEvent(
      "evt13",
      "Offsite",
      defaultUser._id,
      defaultUser.name,
      "Meeting",
      false,
      "Remote City"
    );
    render(
      <DayCell
        currentDate={testDate}
        eventData={[eventWithLocation]}
        showLocations={false} // Explicitly false
        defaultLocation="Default City"
        filters={false}
      />
    );
    expect(screen.queryByText("Remote City")).not.toBeInTheDocument();
  });

  // --- Tests for filters Prop ---

  it("applies 'event--today' class when filters=true and events exist", () => {
    const testDate = dayjs().add(5, "day"); // A non-today date
    const event1 = createEvent(
      "evt14",
      "Filtered Event",
      defaultUser._id,
      defaultUser.name
    );
    const { container } = render(
      <DayCell
        currentDate={testDate}
        eventData={[event1]}
        showLocations={false}
        defaultLocation="Default City"
        filters={true} // Filters are on
      />
    );
    expect(container.firstChild).toHaveClass("event--today"); // Special filter class
    expect(container.firstChild).not.toHaveClass("event--default");
    expect(container.firstChild).not.toHaveClass("event--past");
  });

  it("applies 'event--past' class when filters=true and no events exist", () => {
    const testDate = dayjs().add(5, "day"); // A non-today date
    const { container } = render(
      <DayCell
        currentDate={testDate}
        eventData={[]} // No events
        showLocations={false}
        defaultLocation="Default City"
        filters={true} // Filters are on
      />
    );
    expect(container.firstChild).toHaveClass("event--past"); // Special filter class
    expect(container.firstChild).not.toHaveClass("event--default");
    expect(container.firstChild).not.toHaveClass("event--today");
  });
});
