import React from "react";

import { cleanup, render, screen } from "@testing-library/react";
import { Outlet } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TestRouter } from "@/__test__/TestRouter";
import { useModals } from "@/contexts/Modals/ModalsContext";
import { useSidebar } from "@/contexts/Sidebar/mobile/SidebarContext";
import useUser from "@/hooks/user/useUser";
import { useIsMobile } from "@/hooks/utility/use-mobile";

import SharedLayout from "./SharedLayout";

// Mock all required dependencies
vi.mock("@/hooks/user/useUser", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/utility/use-mobile", () => ({
  useIsMobile: vi.fn(),
}));

vi.mock("@/contexts/Modals/ModalsContext", () => ({
  useModals: vi.fn(),
}));

vi.mock("@/contexts/Sidebar/mobile/SidebarContext", () => ({
  useSidebar: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Outlet: vi.fn(),
    useLocation: () => ({ pathname: "/events" }),
  };
});

// Mock child components
vi.mock("@/components/layout/navigation/Nav/desktop/NavDesktop", () => ({
  NavDesktop: () => <div data-testid="nav-desktop">NavDesktop</div>,
}));

vi.mock("@/components/layout/navigation/Nav/mobile/NavMobile", () => ({
  default: () => <div data-testid="nav-mobile">NavMobile</div>,
}));

vi.mock("@/components/ui/loading-overlay", () => ({
  LoadingOverlay: ({ fullPage }: { fullPage?: boolean }) => (
    <div data-testid="loading-overlay" data-fullpage={fullPage}>
      Loading...
    </div>
  ),
}));

vi.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="toaster">Toaster</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button
      data-testid="add-event-button"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/pages/Events/components/global/EventModals/AddEventModal", () => ({
  default: () => <div data-testid="add-event-modal">AddEventModal</div>,
}));

vi.mock(
  "@/pages/Events/components/global/EventModals/DeleteEventModal",
  () => ({
    default: () => <div data-testid="delete-event-modal">DeleteEventModal</div>,
  })
);

vi.mock(
  "@/pages/Events/components/global/ConnectionsModal/ConnectionsModal",
  () => ({
    default: () => <div data-testid="connections-modal">ConnectionsModal</div>,
  })
);

describe("SharedLayout Component", () => {
  const openEventModalMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mocks
    vi.mocked(Outlet).mockImplementation(() => (
      <div data-testid="outlet">Outlet Content</div>
    ));

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

    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: false,
      toggleSidebar: vi.fn(),
      closeSidebar: vi.fn(),
    });

    // Default to desktop view
    vi.mocked(useIsMobile).mockReturnValue(false);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders loading overlay when fetching user", () => {
    // Mock loading state
    vi.mocked(useUser).mockReturnValue({
      user: null,
      fetchingUser: true,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(
      <TestRouter>
        <SharedLayout />
      </TestRouter>
    );

    // Should render loading overlay
    expect(screen.getByTestId("loading-overlay")).toBeInTheDocument();
    expect(screen.getByTestId("loading-overlay")).toHaveAttribute(
      "data-fullpage",
      "true"
    );

    // Should not render other content
    expect(screen.queryByTestId("outlet")).not.toBeInTheDocument();
  });

  it("renders authenticated layout when user is authenticated", () => {
    // Mock authenticated user
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

    render(
      <TestRouter>
        <SharedLayout />
      </TestRouter>
    );

    // Should render authenticated layout elements
    expect(screen.getByTestId("nav-desktop")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();

    // Should render modals
    expect(screen.getByTestId("add-event-modal")).toBeInTheDocument();
    expect(screen.getByTestId("delete-event-modal")).toBeInTheDocument();
    expect(screen.getByTestId("connections-modal")).toBeInTheDocument();

    // Should always render toaster
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("renders unauthenticated layout when user is not authenticated", () => {
    // Mock unauthenticated user
    vi.mocked(useUser).mockReturnValue({
      user: null,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(
      <TestRouter>
        <SharedLayout />
      </TestRouter>
    );

    // Should render unauthenticated layout elements
    expect(screen.getByTestId("outlet")).toBeInTheDocument();

    // Should not render authenticated elements
    expect(screen.queryByTestId("nav-desktop")).not.toBeInTheDocument();
    expect(screen.queryByTestId("nav-mobile")).not.toBeInTheDocument();

    // Should not render modals
    expect(screen.queryByTestId("add-event-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("delete-event-modal")).not.toBeInTheDocument();
    expect(screen.queryByTestId("connections-modal")).not.toBeInTheDocument();

    // Should always render toaster
    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("renders NavMobile and add event button for mobile devices", () => {
    // Mock authenticated user
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

    // Set to mobile view
    vi.mocked(useIsMobile).mockReturnValue(true);

    render(
      <TestRouter>
        <SharedLayout />
      </TestRouter>
    );

    // Should render mobile navigation
    expect(screen.getByTestId("nav-mobile")).toBeInTheDocument();
    expect(screen.queryByTestId("nav-desktop")).not.toBeInTheDocument();

    // Should render add event button on mobile
    expect(screen.getByTestId("add-event-button")).toBeInTheDocument();
  });

  it("hides add event button when sidebar is expanded on mobile", () => {
    // Mock authenticated user
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

    // Set to mobile view with expanded sidebar
    vi.mocked(useIsMobile).mockReturnValue(true);
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: true,
      toggleSidebar: vi.fn(),
      closeSidebar: vi.fn(),
    });

    render(
      <TestRouter>
        <SharedLayout />
      </TestRouter>
    );

    // Button should have opacity-0 class
    const button = screen.getByTestId("add-event-button");
    expect(button).toBeInTheDocument();
    expect(button.className).toContain("opacity-0");
    expect(button.className).toContain("pointer-events-none");
  });

  it("calls openEventModal when add event button is clicked", () => {
    // Mock authenticated user
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

    // Set to mobile view
    vi.mocked(useIsMobile).mockReturnValue(true);

    render(
      <TestRouter>
        <SharedLayout />
      </TestRouter>
    );

    // Click the add event button
    const button = screen.getByTestId("add-event-button");
    button.click();

    // Should call openEventModal
    expect(openEventModalMock).toHaveBeenCalledTimes(1);
  });
});
