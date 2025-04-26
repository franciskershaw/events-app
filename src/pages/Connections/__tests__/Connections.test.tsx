import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TestMemoryRouter } from "@/__test__/TestRouter";
import useUser from "@/hooks/user/useUser";
import { useIsMobile } from "@/hooks/utility/use-mobile";
import { User } from "@/types/globalTypes";

import Connections from "../Connections";

// Mock dependencies
vi.mock("@/hooks/user/useUser");
vi.mock("@/hooks/utility/usePageTitle");
vi.mock("@/hooks/utility/use-mobile");

// Mock all the connection components to make testing easier
vi.mock("@/pages/Connections/components/ConnectionForm/ConnectionForm", () => ({
  default: () => <div data-testid="connection-form">Connection Form</div>,
}));

vi.mock(
  "@/pages/Connections/components/ConnectionListItem/ConnectionListItem",
  () => ({
    default: ({
      connection,
    }: {
      connection: { _id: string; name: string; hideEvents: boolean };
    }) => (
      <div data-testid="connection-list-item" data-id={connection._id}>
        {connection.name}
      </div>
    ),
  })
);

vi.mock(
  "@/pages/Connections/components/ConnectionModals/ConnectionModal",
  () => ({
    default: () => <div data-testid="connection-modal">Connection Modal</div>,
  })
);

vi.mock(
  "@/pages/Connections/components/EmptyStateNoConnections/EmptyStateNoConnections",
  () => ({
    EmptyStateNoConnections: () => (
      <div data-testid="empty-state">No connections message</div>
    ),
  })
);

// Create a complete mock type for useUser return
const createMockUserHook = (user: User | null) => ({
  user,
  fetchingUser: false,
  updateUser: vi.fn(),
  clearUser: vi.fn().mockResolvedValue(undefined),
});

describe("Connections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to desktop view
    vi.mocked(useIsMobile).mockReturnValue(false);
  });

  it("renders the connections page with no connections", () => {
    // Setup for user with no connections
    vi.mocked(useUser).mockReturnValue(
      createMockUserHook({
        _id: "user123",
        name: "Test User",
        email: "test@example.com",
        accessToken: "test-token",
        connections: [],
      })
    );

    render(
      <TestMemoryRouter>
        <Connections />
      </TestMemoryRouter>
    );

    // Check for main components
    expect(screen.getByText("Connections")).toBeInTheDocument();
    expect(screen.getByText("Your Connections")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();

    // In desktop view, the form should be visible
    expect(screen.getByTestId("connection-form")).toBeInTheDocument();
  });

  it("renders the connections page with existing connections", () => {
    // Setup for user with connections
    const mockConnections = [
      {
        _id: "conn1",
        name: "Test Connection 1",
        email: "conn1@example.com",
        hideEvents: false,
      },
      {
        _id: "conn2",
        name: "Test Connection 2",
        email: "conn2@example.com",
        hideEvents: true,
      },
    ];

    vi.mocked(useUser).mockReturnValue(
      createMockUserHook({
        _id: "user123",
        name: "Test User",
        email: "test@example.com",
        accessToken: "test-token",
        connections: mockConnections,
      })
    );

    render(
      <TestMemoryRouter>
        <Connections />
      </TestMemoryRouter>
    );

    // Check for main components
    expect(screen.getByText("Connections")).toBeInTheDocument();
    expect(screen.getByText("Your Connections")).toBeInTheDocument();

    // Should show connection list items instead of empty state
    expect(screen.queryByTestId("empty-state")).not.toBeInTheDocument();

    // Should render all connections
    expect(screen.getByText("Test Connection 1")).toBeInTheDocument();
    expect(screen.getByText("Test Connection 2")).toBeInTheDocument();
    expect(screen.getAllByTestId("connection-list-item")).toHaveLength(2);

    // In desktop view, the form should be visible
    expect(screen.getByTestId("connection-form")).toBeInTheDocument();
  });

  it("displays the connection form on desktop", () => {
    // Setup desktop view
    vi.mocked(useIsMobile).mockReturnValue(false);

    vi.mocked(useUser).mockReturnValue(
      createMockUserHook({
        _id: "user123",
        name: "Test User",
        email: "test@example.com",
        accessToken: "test-token",
        connections: [],
      })
    );

    render(
      <TestMemoryRouter>
        <Connections />
      </TestMemoryRouter>
    );

    // Connection form should be visible on desktop
    const connectionForm = screen.getByTestId("connection-form");
    expect(connectionForm).toBeInTheDocument();

    // Check that the right side column exists with the correct class
    const rightColumn = screen.getByText("Connection Form").closest("div");
    expect(rightColumn).toHaveAttribute("data-testid", "connection-form");

    // Verify the form is in a container with the desktop-only class
    const formContainer = screen.getByTestId("connection-form").parentElement;
    expect(formContainer).toBeTruthy();
    expect(formContainer?.className).toContain("hidden lg:block");
  });

  it("displays the connection modal on mobile instead of form", () => {
    // Setup mobile view
    vi.mocked(useIsMobile).mockReturnValue(true);

    vi.mocked(useUser).mockReturnValue(
      createMockUserHook({
        _id: "user123",
        name: "Test User",
        email: "test@example.com",
        accessToken: "test-token",
        connections: [],
      })
    );

    render(
      <TestMemoryRouter>
        <Connections />
      </TestMemoryRouter>
    );

    // Connection modal should be visible on mobile
    expect(screen.getByTestId("connection-modal")).toBeInTheDocument();

    // The form should still be in the DOM but in a div with a desktop-only class
    const connectionForm = screen.getByTestId("connection-form");
    expect(connectionForm).toBeInTheDocument();

    // Verify that the form container has the desktop-only class
    const formContainer = connectionForm.parentElement;
    expect(formContainer).toBeTruthy();
    expect(formContainer?.className).toContain("hidden lg:block");
  });

  it("handles case when user is not loaded yet", () => {
    // Setup for no user yet
    vi.mocked(useUser).mockReturnValue(createMockUserHook(null));

    render(
      <TestMemoryRouter>
        <Connections />
      </TestMemoryRouter>
    );

    // Check for main components
    expect(screen.getByText("Connections")).toBeInTheDocument();
    expect(screen.getByText("Your Connections")).toBeInTheDocument();

    // Should show empty state when user has no connections (null user)
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });
});
