import React from "react";

import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { TestRouter } from "@/__test__/TestRouter";
import useUser from "@/hooks/user/useUser";

import PrivateRoute from "./PrivateRoute";

// Mock the useUser hook
vi.mock("@/hooks/user/useUser", () => ({
  default: vi.fn(),
}));

// Mock the TestRouter component
vi.mock("@/__test__/TestRouter", () => ({
  TestRouter: ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter
      initialEntries={["/protected"]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {children}
    </MemoryRouter>
  ),
}));

describe("PrivateRoute Component", () => {
  // Setup test routes
  const TestComponent = () => (
    <div data-testid="protected-content">Protected Content</div>
  );
  const LoginComponent = () => <div data-testid="login-page">Login Page</div>;

  // Create a wrapper with test routes
  const renderPrivateRoute = () => {
    render(
      <TestRouter>
        <Routes>
          <Route path="/" element={<LoginComponent />} />
          <Route path="/protected" element={<PrivateRoute />}>
            <Route index element={<TestComponent />} />
          </Route>
        </Routes>
      </TestRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the protected content when user is authenticated", () => {
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

    renderPrivateRoute();

    // Should render the protected content
    expect(screen.getByTestId("protected-content")).toBeInTheDocument();

    // Should not render the login page
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument();
  });

  it("redirects to login page when user is not authenticated", () => {
    // Mock unauthenticated user
    vi.mocked(useUser).mockReturnValue({
      user: null,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    renderPrivateRoute();

    // Should not render the protected content
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();

    // Should render the login page (redirected)
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });

  it("handles loading state while fetching user", () => {
    // Mock loading state
    vi.mocked(useUser).mockReturnValue({
      user: null,
      fetchingUser: true,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    renderPrivateRoute();

    // Should not render the protected content yet (still loading)
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();

    // Should render the login page during loading state
    expect(screen.getByTestId("login-page")).toBeInTheDocument();
  });
});
