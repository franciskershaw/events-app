import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { useModals } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";
import EventCardActions from "@/pages/Events/components/global/EventCardActions/EventCardActions";
import * as helpers from "@/pages/Events/helpers/helpers";
import useMakeEventPrivate from "@/pages/Events/hooks/useMakeEventPrivate";
import useToggleConfirmEvent from "@/pages/Events/hooks/useToggleConfirmEvent";
import { Event } from "@/types/globalTypes";

// Mock the hooks
vi.mock("@/contexts/Modals/ModalsContext");
vi.mock("@/hooks/user/useUser");
vi.mock("@/pages/Events/hooks/useToggleConfirmEvent");
vi.mock("@/pages/Events/hooks/useMakeEventPrivate");

// Mock the shareEvent helper function
vi.mock("@/pages/Events/helpers/helpers", () => ({
  shareEvent: vi.fn(() => "Test share message"),
}));

describe("EventCardActions", () => {
  // Mock functions
  const mockOpenEventModal = vi.fn();
  const mockOpenDeleteEventModal = vi.fn();
  const mockToggleEventConfirmation = vi.fn();
  const mockMakeEventPrivate = vi.fn();

  // Mock event data
  const mockEvent: Event = {
    _id: "event123",
    title: "Test Event",
    date: {
      start: "2023-01-01T12:00:00Z",
      end: "2023-01-01T14:00:00Z",
    },
    category: {
      _id: "cat1",
      name: "Test Category",
      icon: "test-icon",
    },
    createdBy: {
      _id: "user123",
      name: "Test User",
    },
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    unConfirmed: false,
    private: false,
  };

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();

    // Default hook implementations
    (useModals as Mock).mockReturnValue({
      openEventModal: mockOpenEventModal,
      openDeleteEventModal: mockOpenDeleteEventModal,
    });

    (useToggleConfirmEvent as Mock).mockReturnValue({
      mutate: mockToggleEventConfirmation,
    });

    (useMakeEventPrivate as Mock).mockReturnValue({
      mutate: mockMakeEventPrivate,
    });

    // Mock the clipboard API
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });

    // Mock localStorage if needed
    vi.spyOn(Storage.prototype, "getItem");
    vi.spyOn(Storage.prototype, "setItem");
  });

  it("renders all buttons when user owns the event", () => {
    // Set up the user as the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    render(<EventCardActions event={mockEvent} />);

    // Verify all buttons are present for event owner
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.getByText("Private")).toBeInTheDocument(); // Since event.private is false
    expect(screen.getByText("Draft")).toBeInTheDocument(); // Since event.unConfirmed is false
  });

  it("renders limited buttons when user does not own the event", () => {
    // Set up the user as NOT the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "different-user", name: "Different User" },
    });

    render(<EventCardActions event={mockEvent} />);

    // Verify only permitted buttons are present
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.getByText("Share")).toBeInTheDocument();
    expect(screen.queryByText("Private")).not.toBeInTheDocument();
    expect(screen.queryByText("Draft")).not.toBeInTheDocument();
  });

  it("calls openEventModal with edit mode when Edit button is clicked", () => {
    // Set up the user as the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    render(<EventCardActions event={mockEvent} />);

    // Click the Edit button
    fireEvent.click(screen.getByText("Edit"));

    // Verify openEventModal was called with correct parameters
    expect(mockOpenEventModal).toHaveBeenCalledWith(mockEvent, "edit");
  });

  it("calls openEventModal with copy mode when Copy button is clicked (owner)", () => {
    // Set up the user as the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    render(<EventCardActions event={mockEvent} />);

    // Click the Copy button
    fireEvent.click(screen.getByText("Copy"));

    // Verify openEventModal was called with correct parameters
    expect(mockOpenEventModal).toHaveBeenCalledWith(mockEvent, "copy");
  });

  it("calls openEventModal with copyFromConnection mode when Copy button is clicked (non-owner)", () => {
    // Set up the user as NOT the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "different-user", name: "Different User" },
    });

    render(<EventCardActions event={mockEvent} />);

    // Click the Copy button
    fireEvent.click(screen.getByText("Copy"));

    // Verify openEventModal was called with correct parameters
    expect(mockOpenEventModal).toHaveBeenCalledWith(
      mockEvent,
      "copyFromConnection"
    );
  });

  it("calls openDeleteEventModal when Delete button is clicked", () => {
    // Set up the user as the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    render(<EventCardActions event={mockEvent} />);

    // Click the Delete button
    fireEvent.click(screen.getByText("Delete"));

    // Verify openDeleteEventModal was called with correct parameters
    expect(mockOpenDeleteEventModal).toHaveBeenCalledWith(mockEvent);
  });

  it("shows 'Copied' message after successful share", async () => {
    // Set up the user
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    render(<EventCardActions event={mockEvent} />);

    // Click the Share button
    fireEvent.click(screen.getByText("Share"));

    // Verify clipboard API was called
    expect(navigator.clipboard.writeText).toHaveBeenCalled();

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText("Copied")).toBeInTheDocument();
    });
  });

  it("shows error message if clipboard fails", async () => {
    // Set up the user
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    // Mock clipboard failure
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: vi.fn().mockRejectedValue(new Error("Clipboard failed")),
      },
      configurable: true,
    });

    render(<EventCardActions event={mockEvent} />);

    // Click the Share button
    fireEvent.click(screen.getByText("Share"));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });
  });

  it("shows error message if shareEvent returns null", async () => {
    // Set up the user
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    // Mock shareEvent to return null
    (helpers.shareEvent as Mock).mockReturnValue(null);

    render(<EventCardActions event={mockEvent} />);

    // Click the Share button
    fireEvent.click(screen.getByText("Share"));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText("Error")).toBeInTheDocument();
    });
  });

  it("displays 'Public' option for a private event", () => {
    // Set up the user as the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    // Create a private event
    const privateEvent = { ...mockEvent, private: true };

    render(<EventCardActions event={privateEvent} />);

    // Verify Public button is shown for private events
    expect(screen.getByText("Public")).toBeInTheDocument();
  });

  it("displays 'Confirm' button for an unconfirmed event", () => {
    // Set up the user as the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    // Create an unconfirmed event
    const unconfirmedEvent = { ...mockEvent, unConfirmed: true };

    render(<EventCardActions event={unconfirmedEvent} />);

    // Verify Confirm button is shown for unconfirmed events
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("calls makeEventPrivate when Private/Public button is clicked", () => {
    // Set up the user as the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    render(<EventCardActions event={mockEvent} />);

    // Click the Private button (since event is public)
    fireEvent.click(screen.getByText("Private"));

    // Verify makeEventPrivate was called with correct parameter
    expect(mockMakeEventPrivate).toHaveBeenCalledWith(mockEvent._id);
  });

  it("calls toggleEventConfirmation when Confirm/Draft button is clicked", () => {
    // Set up the user as the event owner
    (useUser as Mock).mockReturnValue({
      user: { _id: "user123", name: "Test User" },
    });

    render(<EventCardActions event={mockEvent} />);

    // Click the Draft button (since event is confirmed)
    fireEvent.click(screen.getByText("Draft"));

    // Verify toggleEventConfirmation was called with correct parameters
    expect(mockToggleEventConfirmation).toHaveBeenCalledWith({
      eventId: mockEvent._id,
      unConfirmed: mockEvent.unConfirmed,
    });
  });
});
