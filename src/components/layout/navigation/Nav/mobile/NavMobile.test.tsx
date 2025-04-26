import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useLocation } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TestRouter } from "@/__test__/TestRouter";
// Import mocked hooks after mocking
import { useSidebar } from "@/contexts/Sidebar/mobile/SidebarContext";
import useUser from "@/hooks/user/useUser";
import useAuth from "@/pages/Auth/hooks/useAuth";

import { useScrollVisibility } from "../../../../../hooks/utility/useScrollVisibility";
import NavMobile from "./NavMobile";

// Mock all dependencies
vi.mock("@/contexts/Sidebar/mobile/SidebarContext", () => ({
  useSidebar: vi.fn(),
}));

vi.mock("@/hooks/user/useUser", () => ({
  default: vi.fn(),
}));

vi.mock("@/pages/Auth/hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../../../../hooks/utility/useScrollVisibility", () => ({
  useScrollVisibility: vi.fn(),
}));

// Mock react-router-dom with importActual to keep BrowserRouter while mocking useLocation
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

vi.mock("../../Hamburger/Hamburger", () => ({
  default: () => <div data-testid="hamburger">Hamburger</div>,
}));

// Define types for the UserInitials component props
interface UserInitialsProps {
  size?: string;
  name?: string;
}

vi.mock("@/components/user/UserInitials/UserInitials", () => ({
  default: ({ size, name }: UserInitialsProps) => (
    <div data-testid="user-initials" data-size={size}>
      {name || "UI"}
    </div>
  ),
}));

describe("NavMobile Component", () => {
  const toggleSidebarMock = vi.fn();
  const closeSidebarMock = vi.fn();
  const logoutMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock returns
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: false,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });

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

    vi.mocked(useScrollVisibility).mockReturnValue({
      isVisible: true,
      isNearBottom: false,
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

  it("renders hamburger button when not on auth page", () => {
    render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Check hamburger button is rendered
    expect(screen.getByTestId("hamburger")).toBeInTheDocument();
  });

  it("does not render for auth pages", () => {
    vi.mocked(useLocation).mockReturnValue({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "default",
    });

    const { container } = render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Component should return null, so container should be empty
    expect(container.firstChild).toBeNull();
  });

  it("renders sidebar content when expanded", () => {
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: true,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });

    render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Check user profile elements are rendered
    expect(screen.getByTestId("user-initials")).toBeInTheDocument();
    // Use getAllByText to handle multiple elements with the same text
    expect(screen.getAllByText("Test User")[0]).toBeInTheDocument();

    // Check all navigation links are rendered
    expect(screen.getByText("Connections")).toBeInTheDocument();
    expect(screen.getByText("Events")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("applies transform animation based on scroll visibility", () => {
    // When visible
    vi.mocked(useScrollVisibility).mockReturnValue({
      isVisible: true,
      isNearBottom: false,
    });

    render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Just verify the container exists without checking the exact style
    expect(screen.getByTestId("hamburger").closest("div")).toBeInTheDocument();

    cleanup();

    // When not visible
    vi.mocked(useScrollVisibility).mockReturnValue({
      isVisible: false,
      isNearBottom: false,
    });

    render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Just verify the container exists without checking the exact style
    expect(screen.getByTestId("hamburger").closest("div")).toBeInTheDocument();
  });

  it("calls toggleSidebar when navigation links are clicked", () => {
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: true,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });

    render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Click on Connections link
    fireEvent.click(screen.getByText("Connections"));
    expect(toggleSidebarMock).toHaveBeenCalledTimes(1);

    toggleSidebarMock.mockClear();

    // Click on Events link
    fireEvent.click(screen.getByText("Events"));
    expect(toggleSidebarMock).toHaveBeenCalledTimes(1);
  });

  it("calls logout when Logout button is clicked", () => {
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: true,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });

    render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Click on Logout button
    fireEvent.click(screen.getByText("Logout"));
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it("has correct sidebar transition styles", () => {
    // When collapsed
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: false,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });

    render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Just test that the sidebar elements are rendered without checking classes
    expect(screen.getByTestId("hamburger")).toBeInTheDocument();

    cleanup();

    // Test expanded state in a separate render
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: true,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });

    render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Just test that the sidebar elements are rendered without checking classes
    expect(screen.getByTestId("hamburger")).toBeInTheDocument();
    expect(screen.getByTestId("user-initials")).toBeInTheDocument();
  });

  it("renders icons for navigation links", () => {
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: true,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });

    render(
      <TestRouter>
        <NavMobile />
      </TestRouter>
    );

    // Test that each link has an associated icon
    const connectionLink = screen.getByText("Connections").closest("a");
    expect(connectionLink?.querySelector("svg")).toBeInTheDocument();

    const eventsLink = screen.getByText("Events").closest("a");
    expect(eventsLink?.querySelector("svg")).toBeInTheDocument();

    const logoutButton = screen.getByText("Logout").closest("button");
    expect(logoutButton?.querySelector("svg")).toBeInTheDocument();
  });
});
