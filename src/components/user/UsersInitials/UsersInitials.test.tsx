import React from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useModals } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";

import UsersInitials from "./UsersInitials";

// Mock the dependencies
vi.mock("@/hooks/user/useUser", () => ({
  default: vi.fn(),
}));

vi.mock("@/contexts/Modals/ModalsContext", () => ({
  useModals: vi.fn(),
}));

// Mock the UserInitials component
vi.mock("../UserInitials/UserInitials", () => ({
  default: ({
    size,
    name,
    colour,
  }: {
    size?: string;
    name?: string;
    colour?: string;
  }) => (
    <div
      data-testid="user-initials"
      data-size={size}
      data-name={name}
      data-colour={colour}
    >
      {name ? `Initials-${name}` : "No-Name"}
    </div>
  ),
}));

// Mock the Avatar and AvatarFallback components
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarFallback: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
  ),
}));

describe("UsersInitials Component", () => {
  const openConnectionsModalMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    vi.mocked(useModals).mockReturnValue({
      openConnectionsModal: openConnectionsModalMock,
      openEventModal: vi.fn(),
      closeModal: vi.fn(),
      isEventModalOpen: false,
      isDeleteEventModalOpen: false,
      isConnectionsModalOpen: false,
      selectedEvent: null,
      mode: null,
      openDeleteEventModal: vi.fn(),
      resetSelectedData: vi.fn(),
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders the user's initials", () => {
    // Setup user with no connections
    vi.mocked(useUser).mockReturnValue({
      user: {
        _id: "user123",
        name: "John Doe",
        email: "john@example.com",
        connections: [],
        accessToken: "token123",
      },
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(<UsersInitials />);

    // Should render the main user initials
    const userInitials = screen.getByTestId("user-initials");
    expect(userInitials).toBeInTheDocument();
    expect(userInitials).toHaveAttribute("data-size", "md");
    expect(userInitials).toHaveAttribute("data-name", "John Doe");

    // Should not render any connection initials
    expect(screen.queryAllByTestId("user-initials")).toHaveLength(1);
    expect(screen.queryByTestId("avatar-fallback")).not.toBeInTheDocument();
  });

  it("renders up to 3 connection initials", () => {
    // Setup user with 3 connections
    vi.mocked(useUser).mockReturnValue({
      user: {
        _id: "user123",
        name: "John Doe",
        email: "john@example.com",
        connections: [
          {
            _id: "conn1",
            name: "User One",
            email: "one@example.com",
            hideEvents: false,
          },
          {
            _id: "conn2",
            name: "User Two",
            email: "two@example.com",
            hideEvents: false,
          },
          {
            _id: "conn3",
            name: "User Three",
            email: "three@example.com",
            hideEvents: false,
          },
        ],
        accessToken: "token123",
      },
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(<UsersInitials />);

    // Should render the main user initials
    const userInitials = screen.getAllByTestId("user-initials");
    expect(userInitials).toHaveLength(4); // Main user + 3 connections

    // Check main user initials
    expect(userInitials[0]).toHaveAttribute("data-size", "md");
    expect(userInitials[0]).toHaveAttribute("data-name", "John Doe");

    // Check connection initials
    expect(userInitials[1]).toHaveAttribute("data-size", "sm");
    expect(userInitials[1]).toHaveAttribute("data-name", "User One");
    expect(userInitials[1]).toHaveAttribute("data-colour", "dark");

    expect(userInitials[2]).toHaveAttribute("data-size", "sm");
    expect(userInitials[2]).toHaveAttribute("data-name", "User Two");

    expect(userInitials[3]).toHaveAttribute("data-size", "sm");
    expect(userInitials[3]).toHaveAttribute("data-name", "User Three");

    // Should not render the +N indicator
    expect(screen.queryByTestId("avatar-fallback")).not.toBeInTheDocument();
  });

  it("renders +N indicator for more than 3 connections", () => {
    // Setup user with more than 3 connections
    vi.mocked(useUser).mockReturnValue({
      user: {
        _id: "user123",
        name: "John Doe",
        email: "john@example.com",
        connections: [
          {
            _id: "conn1",
            name: "User One",
            email: "one@example.com",
            hideEvents: false,
          },
          {
            _id: "conn2",
            name: "User Two",
            email: "two@example.com",
            hideEvents: false,
          },
          {
            _id: "conn3",
            name: "User Three",
            email: "three@example.com",
            hideEvents: false,
          },
          {
            _id: "conn4",
            name: "User Four",
            email: "four@example.com",
            hideEvents: false,
          },
          {
            _id: "conn5",
            name: "User Five",
            email: "five@example.com",
            hideEvents: false,
          },
        ],
        accessToken: "token123",
      },
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(<UsersInitials />);

    // Should render the main user initials and 3 connections
    const userInitials = screen.getAllByTestId("user-initials");
    expect(userInitials).toHaveLength(4); // Main user + 3 connections

    // Should render the +N indicator
    const indicator = screen.getByTestId("avatar-fallback");
    expect(indicator).toBeInTheDocument();
    expect(indicator.textContent).toBe("+3"); // +2 extra connections + 1 (as per the component logic)
  });

  it("filters out connections with hideEvents=true", () => {
    // Setup user with connections including some with hideEvents=true
    vi.mocked(useUser).mockReturnValue({
      user: {
        _id: "user123",
        name: "John Doe",
        email: "john@example.com",
        connections: [
          {
            _id: "conn1",
            name: "User One",
            email: "one@example.com",
            hideEvents: false,
          },
          {
            _id: "conn2",
            name: "User Two",
            email: "two@example.com",
            hideEvents: true,
          }, // This one should be filtered out
          {
            _id: "conn3",
            name: "User Three",
            email: "three@example.com",
            hideEvents: false,
          },
        ],
        accessToken: "token123",
      },
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(<UsersInitials />);

    // Should render the main user initials and only the connections with hideEvents=false
    const userInitials = screen.getAllByTestId("user-initials");
    expect(userInitials).toHaveLength(3); // Main user + 2 connections (one filtered out)

    // Check connection names
    expect(userInitials[1]).toHaveAttribute("data-name", "User One");
    expect(userInitials[2]).toHaveAttribute("data-name", "User Three");

    // Should not show "User Two" which has hideEvents=true
    const allNames = userInitials.map((el) => el.getAttribute("data-name"));
    expect(allNames).not.toContain("User Two");
  });

  it("calls openConnectionsModal when clicked", () => {
    // Setup user with no connections
    vi.mocked(useUser).mockReturnValue({
      user: {
        _id: "user123",
        name: "John Doe",
        email: "john@example.com",
        connections: [],
        accessToken: "token123",
      },
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(<UsersInitials />);

    // Click on the component
    const userInitialsElement = screen.getByTestId("user-initials");
    const container = userInitialsElement.closest("div");
    expect(container).not.toBeNull(); // Ensure container exists
    if (container) {
      fireEvent.click(container);
    }

    // Should call openConnectionsModal
    expect(openConnectionsModalMock).toHaveBeenCalledTimes(1);
  });

  it("handles user being null", () => {
    // Setup user as null
    vi.mocked(useUser).mockReturnValue({
      user: null,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(<UsersInitials />);

    // Should still render the UserInitials component with no name
    const userInitials = screen.getByTestId("user-initials");
    expect(userInitials).toBeInTheDocument();
    expect(userInitials.getAttribute("data-name")).toBeNull();

    // Should not render any connection initials
    expect(screen.queryAllByTestId("user-initials")).toHaveLength(1);
  });
});
