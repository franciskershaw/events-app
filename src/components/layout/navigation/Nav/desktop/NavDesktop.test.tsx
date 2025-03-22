import React from "react";

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useModals } from "../../../../../contexts/Modals/ModalsContext";
import { useSidebarContent } from "../../../../../contexts/Sidebar/desktop/SidebarContentContext";
// Import mocked hooks after mocking
import useUser from "../../../../../hooks/user/useUser";
import useAuth from "../../../../../pages/Auth/hooks/useAuth";
import { TestRouter } from "../../../../../test/TestRouter";
import { NavDesktop } from "./NavDesktop";

// Mock all dependencies
vi.mock("../../../../../hooks/user/useUser", () => ({
  default: vi.fn(),
}));

vi.mock("../../../../../pages/Auth/hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../../../../contexts/Modals/ModalsContext", () => ({
  useModals: vi.fn(),
}));

vi.mock(
  "../../../../../contexts/Sidebar/desktop/SidebarContentContext",
  () => ({
    useSidebarContent: vi.fn(),
  })
);

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
    useNavigate: () => vi.fn(),
  };
});

// Mock components
vi.mock("../../../../ui/button", () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
  }) => (
    <button onClick={onClick} data-testid="button">
      {children}
    </button>
  ),
}));

// Define types for UserInitials props
interface UsersInitialsProps {
  size?: string;
  name?: string;
}

vi.mock("../../../../user/UsersInitials/UsersInitials", () => ({
  default: ({ size, name }: UsersInitialsProps) => (
    <div data-testid="users-initials" data-size={size}>
      {name || "UI"}
    </div>
  ),
}));

describe("NavDesktop Component", () => {
  const openEventModalMock = vi.fn();
  const setSidebarContentMock = vi.fn();
  const logoutMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock returns
    vi.mocked(useUser).mockReturnValue({
      user: {
        _id: "user123",
        name: "Test User",
        email: "test@example.com",
        connections: [],
        accessToken: "token123",
      },
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    vi.mocked(useAuth).mockReturnValue({
      logout: logoutMock,
      login: vi.fn(),
      register: vi.fn(),
    });

    vi.mocked(useModals).mockReturnValue({
      openEventModal: openEventModalMock,
      closeModal: vi.fn(),
      isEventModalOpen: false,
      isDeleteEventModalOpen: false,
      isConnectionsModalOpen: false,
      selectedEvent: null,
      mode: null,
      openDeleteEventModal: vi.fn(),
      openConnectionsModal: vi.fn(),
      resetSelectedData: vi.fn(),
    });

    vi.mocked(useSidebarContent).mockReturnValue({
      sidebarContent: "events",
      setSidebarContent: setSidebarContentMock,
    });

    vi.mocked(useLocation).mockReturnValue({
      pathname: "/events",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });
  });

  // Clean up after each test to avoid element duplication
  afterEach(() => {
    cleanup();
  });

  it("renders the navigation bar with all elements", () => {
    render(
      <TestRouter>
        <NavDesktop />
      </TestRouter>
    );

    // Check user elements are rendered
    expect(screen.getByTestId("users-initials")).toBeInTheDocument();
    expect(screen.getByText("Test User")).toBeInTheDocument();

    // Check navigation links are rendered
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Connections")).toBeInTheDocument();

    // Check Add Event button is rendered
    expect(screen.getByText("Add event")).toBeInTheDocument();

    // Check logout button is rendered
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("opens event modal when clicking the Add event button", () => {
    render(
      <TestRouter>
        <NavDesktop />
      </TestRouter>
    );

    // Click the Add event button
    fireEvent.click(screen.getByText("Add event"));

    // Verify that openEventModal was called
    expect(openEventModalMock).toHaveBeenCalledTimes(1);
  });

  it("sets sidebar content to Events when clicking the Events link", () => {
    render(
      <TestRouter>
        <NavDesktop />
      </TestRouter>
    );

    // Click the Events link
    fireEvent.click(screen.getByText("Events"));

    // Verify that setSidebarContent was called with 'events'
    expect(setSidebarContentMock).toHaveBeenCalledWith("events");
  });

  it("sets sidebar content to Search when clicking the Search link", () => {
    render(
      <TestRouter>
        <NavDesktop />
      </TestRouter>
    );

    // Click the Search link
    fireEvent.click(screen.getByText("Search"));

    // Verify that setSidebarContent was called with 'search'
    expect(setSidebarContentMock).toHaveBeenCalledWith("search");
  });

  it("navigates to connections page when clicking the Connections link", () => {
    render(
      <TestRouter>
        <NavDesktop />
      </TestRouter>
    );

    // Click the Connections link
    fireEvent.click(screen.getByText("Connections"));

    // Check link has correct href attribute
    expect(screen.getByText("Connections").closest("a")).toHaveAttribute(
      "href",
      "/connections"
    );
  });

  it("calls logout when clicking the Logout button", () => {
    render(
      <TestRouter>
        <NavDesktop />
      </TestRouter>
    );

    // Click the Logout button
    fireEvent.click(screen.getByText("Logout"));

    // Verify that logout was called
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it("displays user name when user is available", () => {
    render(
      <TestRouter>
        <NavDesktop />
      </TestRouter>
    );

    // Check that user name is displayed
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });

  it("does not display user name when user is not available", () => {
    // Mock user as null
    vi.mocked(useUser).mockReturnValue({
      user: null,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(
      <TestRouter>
        <NavDesktop />
      </TestRouter>
    );

    // Check that user name is not displayed
    expect(screen.queryByText("Test User")).not.toBeInTheDocument();
  });

  it("shows loading state when fetching user", () => {
    // Mock fetching user as true
    vi.mocked(useUser).mockReturnValue({
      user: null,
      fetchingUser: true,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(
      <TestRouter>
        <NavDesktop />
      </TestRouter>
    );

    // Just check the user name is not displayed when fetching
    expect(screen.queryByText("Test User")).not.toBeInTheDocument();
  });
});
