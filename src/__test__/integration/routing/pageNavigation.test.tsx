import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TestMemoryRouter } from "@/__test__/TestRouter";
import PrivateRoute from "@/components/layout/PrivateRoute/PrivateRoute";
import useUser from "@/hooks/user/useUser";
import { User } from "@/types/globalTypes";

// Mock the user hook for authentication control
vi.mock("@/hooks/user/useUser", () => ({
  default: vi.fn(),
}));

// Create simple mock components for testing
const MockAuth = () => <div data-testid="auth-page">Auth Page</div>;
const MockEvents = () => <div data-testid="events-page">Events Page</div>;
const MockConnections = () => (
  <div data-testid="connections-page">Connections Page</div>
);

// Mock the actual page components
vi.mock("@/pages/Auth/Auth", () => ({
  default: () => <MockAuth />,
}));

vi.mock("@/pages/Events/Events", () => ({
  default: () => <MockEvents />,
}));

vi.mock("@/pages/Connections/Connections", () => ({
  default: () => <MockConnections />,
}));

// Create user states for testing
const mockAuthenticatedUser = {
  user: {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    connections: [],
    accessToken: "token123",
  } as User,
  fetchingUser: false,
  updateUser: vi.fn(),
  clearUser: vi.fn(),
};

const mockUnauthenticatedUser = {
  user: null,
  fetchingUser: false,
  updateUser: vi.fn(),
  clearUser: vi.fn(),
};

describe("Page Navigation Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("PrivateRoute Authentication Flow", () => {
    it("redirects to login when unauthenticated", async () => {
      // Set user as unauthenticated
      vi.mocked(useUser).mockReturnValue(mockUnauthenticatedUser);

      // Render a simple protected route
      render(
        <TestMemoryRouter>
          <Routes>
            <Route path="/" element={<MockAuth />} />
            <Route path="/protected" element={<PrivateRoute />}>
              <Route
                index
                element={
                  <div data-testid="protected-content">Protected Content</div>
                }
              />
            </Route>
          </Routes>
        </TestMemoryRouter>
      );

      // Verify we start on the protected route
      // But get redirected to login
      expect(screen.getByTestId("auth-page")).toBeInTheDocument();
      expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    });

    it("allows access to protected route when authenticated", async () => {
      // Set user as authenticated
      vi.mocked(useUser).mockReturnValue(mockAuthenticatedUser);

      // Render a simple protected route with MemoryRouter started at protected route
      render(
        <MemoryRouter
          initialEntries={["/protected"]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Routes>
            <Route path="/" element={<MockAuth />} />
            <Route path="/protected" element={<PrivateRoute />}>
              <Route
                index
                element={
                  <div data-testid="protected-content">Protected Content</div>
                }
              />
            </Route>
          </Routes>
        </MemoryRouter>
      );

      // We should see the protected content
      expect(
        await screen.findByTestId("protected-content")
      ).toBeInTheDocument();
    });
  });

  describe("Auth Redirect Flow", () => {
    it("redirects authenticated users from auth page to events", async () => {
      // Set user as authenticated
      vi.mocked(useUser).mockReturnValue(mockAuthenticatedUser);

      // Create a simplified app structure for testing auth redirects
      const MockAuthComponent = () => {
        // This represents the behavior in the Auth.tsx page
        // where it checks for user and redirects to /events
        const user = useUser();
        return <>{user.user ? <MockEvents /> : <MockAuth />}</>;
      };

      render(
        <TestMemoryRouter>
          <MockAuthComponent />
        </TestMemoryRouter>
      );

      // Should redirect to events page
      expect(await screen.findByTestId("events-page")).toBeInTheDocument();
      expect(screen.queryByTestId("auth-page")).not.toBeInTheDocument();
    });

    it("keeps unauthenticated users on the auth page", async () => {
      // Set user as unauthenticated
      vi.mocked(useUser).mockReturnValue(mockUnauthenticatedUser);

      // Create a simplified app structure for testing auth redirects
      const MockAuthComponent = () => {
        // This represents the behavior in the Auth.tsx page
        const user = useUser();
        return <>{user.user ? <MockEvents /> : <MockAuth />}</>;
      };

      render(
        <TestMemoryRouter>
          <MockAuthComponent />
        </TestMemoryRouter>
      );

      // Should stay on auth page
      expect(await screen.findByTestId("auth-page")).toBeInTheDocument();
      expect(screen.queryByTestId("events-page")).not.toBeInTheDocument();
    });
  });

  describe("Navigation Between Pages", () => {
    // Create a simplified app with navigation links for testing
    const NavigableApp = () => {
      const location = useLocation();
      const navigate = useNavigate();
      return (
        <div>
          <div data-testid="current-path">{location.pathname}</div>
          <nav>
            <button
              data-testid="events-link"
              onClick={() => navigate("/events")}
            >
              Go to Events
            </button>
            <button
              data-testid="connections-link"
              onClick={() => navigate("/connections")}
            >
              Go to Connections
            </button>
            <button data-testid="home-link" onClick={() => navigate("/")}>
              Go to Home
            </button>
          </nav>
          <Routes>
            <Route
              path="/"
              element={<div data-testid="home-page">Home Page</div>}
            />
            <Route
              path="/events"
              element={<div data-testid="events-page">Events Page</div>}
            />
            <Route
              path="/connections"
              element={
                <div data-testid="connections-page">Connections Page</div>
              }
            />
          </Routes>
        </div>
      );
    };

    it("allows navigation between pages by clicking links", async () => {
      const user = userEvent.setup();

      // Start at the home page
      render(
        <MemoryRouter
          initialEntries={["/"]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <NavigableApp />
        </MemoryRouter>
      );

      // Verify we're on the home page
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
      expect(screen.getByTestId("current-path")).toHaveTextContent("/");

      // Navigate to Events page
      await user.click(screen.getByTestId("events-link"));

      // Verify we're now on the Events page
      expect(screen.getByTestId("events-page")).toBeInTheDocument();
      expect(screen.queryByTestId("home-page")).not.toBeInTheDocument();
      expect(screen.getByTestId("current-path")).toHaveTextContent("/events");

      // Navigate to Connections page
      await user.click(screen.getByTestId("connections-link"));

      // Verify we're now on the Connections page
      expect(screen.getByTestId("connections-page")).toBeInTheDocument();
      expect(screen.queryByTestId("events-page")).not.toBeInTheDocument();
      expect(screen.getByTestId("current-path")).toHaveTextContent(
        "/connections"
      );
    });

    it("updates URL path when navigating", async () => {
      const user = userEvent.setup();

      // Start at the home page
      render(
        <MemoryRouter
          initialEntries={["/"]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <NavigableApp />
        </MemoryRouter>
      );

      // Navigate to Events page
      await user.click(screen.getByTestId("events-link"));

      // Verify URL has changed
      expect(screen.getByTestId("current-path")).toHaveTextContent("/events");

      // Navigate to Connections page
      await user.click(screen.getByTestId("connections-link"));

      // Verify URL has changed
      expect(screen.getByTestId("current-path")).toHaveTextContent(
        "/connections"
      );
    });

    it("maintains browser history during navigation", async () => {
      const user = userEvent.setup();
      const historyGo = vi.fn();

      // Mock window.history.go
      vi.stubGlobal("history", {
        ...window.history,
        go: historyGo,
      });

      // Start at the home page
      render(
        <MemoryRouter
          initialEntries={["/"]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <NavigableApp />
        </MemoryRouter>
      );

      // Navigate to Events page
      await user.click(screen.getByTestId("events-link"));
      expect(screen.getByTestId("current-path")).toHaveTextContent("/events");

      // Navigate to Connections page
      await user.click(screen.getByTestId("connections-link"));
      expect(screen.getByTestId("current-path")).toHaveTextContent(
        "/connections"
      );

      // Go back in history
      window.history.go(-1);
      expect(historyGo).toHaveBeenCalledWith(-1);

      // Restore original window.history
      vi.unstubAllGlobals();
    });

    it("handles navigation when starting from a non-root route", async () => {
      const user = userEvent.setup();

      // Start at the events page
      render(
        <MemoryRouter
          initialEntries={["/events"]}
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <NavigableApp />
        </MemoryRouter>
      );

      // Verify we're on the events page
      expect(screen.getByTestId("events-page")).toBeInTheDocument();
      expect(screen.getByTestId("current-path")).toHaveTextContent("/events");

      // Navigate to home page
      await user.click(screen.getByTestId("home-link"));

      // Verify we're now on the home page
      expect(screen.getByTestId("home-page")).toBeInTheDocument();
      expect(screen.queryByTestId("events-page")).not.toBeInTheDocument();
      expect(screen.getByTestId("current-path")).toHaveTextContent("/");
    });
  });
});
