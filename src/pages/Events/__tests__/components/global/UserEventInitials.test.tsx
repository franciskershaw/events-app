import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getInitials } from "@/components/user/UserInitials/UserInitials";
import useIsUserEvent from "@/hooks/user/useIsUserEvent";
import { UserEventInitials } from "@/pages/Events/components/global/UserEventInitials/UserEventInitials";
import { Event } from "@/types/globalTypes";

// Mock the dependencies
vi.mock("@/hooks/user/useIsUserEvent");
vi.mock("@/components/user/UserInitials/UserInitials", () => ({
  getInitials: vi.fn(),
}));

describe("UserEventInitials", () => {
  // Mock event data
  const mockEvent: Event = {
    _id: "123",
    title: "Test Event",
    date: {
      start: "2023-01-01T10:00:00Z",
      end: "2023-01-01T12:00:00Z",
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
    createdAt: new Date(),
    updatedAt: new Date(),
    unConfirmed: false,
    private: false,
  };

  it("should not render anything when the event belongs to the user", () => {
    // Mock useIsUserEvent to return true
    vi.mocked(useIsUserEvent).mockReturnValue(true);

    const { container } = render(<UserEventInitials event={mockEvent} />);

    // Component should return nothing, so container should be empty
    expect(container).toBeEmptyDOMElement();
  });

  it("should render an Avatar with user initials when the event doesn't belong to the user", () => {
    // Mock useIsUserEvent to return false
    vi.mocked(useIsUserEvent).mockReturnValue(false);

    // Mock getInitials to return "JD"
    vi.mocked(getInitials).mockReturnValue("JD");

    render(<UserEventInitials event={mockEvent} />);

    // Check if avatar element is rendered (using class names since Avatar doesn't have an img role)
    const avatarElement = screen.getByText("JD");
    expect(avatarElement).toBeInTheDocument();
    expect(avatarElement.parentElement).toHaveClass(
      "bg-primary",
      "text-primary-foreground"
    );
  });

  it("should pass the correct user name to getInitials function", () => {
    // Mock useIsUserEvent to return false
    vi.mocked(useIsUserEvent).mockReturnValue(false);

    render(<UserEventInitials event={mockEvent} />);

    // Verify getInitials was called with the correct name
    expect(getInitials).toHaveBeenCalledWith("John Doe");
  });
});
