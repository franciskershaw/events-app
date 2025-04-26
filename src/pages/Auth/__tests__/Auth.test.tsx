import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TestMemoryRouter } from "@/__test__/TestRouter";
import useUser from "@/hooks/user/useUser";
import { User } from "@/types/globalTypes";

import Auth from "../Auth";

// Mock dependencies
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("@/hooks/user/useUser");
vi.mock("@/hooks/utility/usePageTitle");

// Mock the LocalForm component
vi.mock("../components/LocalForm/LocalForm", () => ({
  default: () => <div data-testid="local-form">LocalForm Component</div>,
}));

// Mock the OrDivider component
vi.mock("../components/OrDivider/OrDivider", () => ({
  default: () => <div data-testid="or-divider">OrDivider Component</div>,
}));

// Create a complete mock type for useUser return
const createMockUserHook = (user: User | null) => ({
  user,
  fetchingUser: false,
  updateUser: vi.fn(),
  clearUser: vi.fn().mockResolvedValue(undefined),
});

describe("Auth", () => {
  // Set up window.location.href mock
  const originalWindow = { ...window };
  let locationHref = "";

  beforeEach(() => {
    // Mock window.location.href
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        href: locationHref,
        assign: vi.fn((url) => {
          locationHref = url;
        }),
        // Add other required properties
        origin: "http://localhost:3000",
        protocol: "http:",
        host: "localhost:3000",
        hostname: "localhost",
        port: "3000",
        pathname: "/",
        search: "",
        hash: "",
      },
    });

    // Default mock for useUser with no user logged in
    vi.mocked(useUser).mockReturnValue(createMockUserHook(null));
  });

  afterEach(() => {
    // Restore original window.location
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalWindow.location,
    });
    locationHref = "";
    vi.clearAllMocks();
  });

  it("renders the login page correctly", () => {
    render(
      <TestMemoryRouter>
        <Auth />
      </TestMemoryRouter>
    );

    // Check for main components
    expect(screen.getByText("Organisey!")).toBeInTheDocument();
    expect(screen.getByText("Login with Google")).toBeInTheDocument();
    expect(screen.getByTestId("local-form")).toBeInTheDocument();
    expect(screen.getByTestId("or-divider")).toBeInTheDocument();
  });

  it("redirects to events page if user is already logged in", async () => {
    // Mock a logged-in user
    const mockUser: User = {
      _id: "user123",
      name: "Test User",
      email: "test@example.com",
      accessToken: "test-token",
      connections: [],
    };

    vi.mocked(useUser).mockReturnValue(createMockUserHook(mockUser));

    // Create a mock navigate function
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    render(
      <TestMemoryRouter>
        <Auth />
      </TestMemoryRouter>
    );

    // Verify that navigate was called with the correct path
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/events");
    });
  });

  it("calls Google login when clicking on Google button", async () => {
    const user = userEvent.setup();
    const apiUrl = "https://api.example.com";
    vi.stubEnv("VITE_API_URL", apiUrl);

    render(
      <TestMemoryRouter>
        <Auth />
      </TestMemoryRouter>
    );

    const googleButton = screen.getByText("Login with Google");
    await user.click(googleButton);

    // For this test, we need to check window.location.href
    // which should be updated by the handleGoogleLogin function
    expect(window.location.href).toBe(`${apiUrl}/auth/google`);
  });
});
