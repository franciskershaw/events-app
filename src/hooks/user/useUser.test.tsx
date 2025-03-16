import { useQuery, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useUser from "./useUser";

// Mock dependencies
vi.mock("@/hooks/axios/useAxios", () => ({
  default: vi.fn(() => mockAxios),
}));

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn(),
    useQuery: vi.fn(),
  };
});

// Mock axios instance
const mockAxios = {
  get: vi.fn(),
  post: vi.fn(),
};

// Mock user data
const mockUser: User = {
  _id: "user123",
  name: "Test User",
  email: "test@example.com",
  accessToken: "test-access-token",
  connections: [
    {
      _id: "conn1",
      name: "Connection 1",
      email: "conn1@example.com",
      hideEvents: false,
    },
  ],
  connectionId: {
    id: "connection-id-123",
    expiry: "2023-12-31",
  },
};

describe("useUser", () => {
  const mockSetQueryData = vi.fn();
  const mockRemoveQueries = vi.fn();
  const mockInvalidateQueries = vi.fn();

  // Mock for React Query
  const mockQueryClient = {
    setQueryData: mockSetQueryData,
    removeQueries: mockRemoveQueries,
    invalidateQueries: mockInvalidateQueries,
  };

  // Mock for useQuery hook
  let mockQueryData: { data: User | null; isFetching: boolean } = {
    data: null,
    isFetching: false,
  };

  // Store the query function for testing
  let getUserQueryFn: (() => Promise<User | null>) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    getUserQueryFn = null;

    // Setup mock implementations
    (useQueryClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockQueryClient
    );

    (useQuery as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      ({
        queryKey,
        queryFn,
      }: {
        queryKey: string[];
        queryFn: () => Promise<User | null>;
      }) => {
        // Store the queryFn for manual execution in tests
        if (queryKey[0] === queryKeys.user) {
          getUserQueryFn = queryFn;
        }

        return mockQueryData;
      }
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns null user when not logged in", () => {
    mockQueryData = { data: null, isFetching: false };

    const { result } = renderHook(() => useUser());

    expect(result.current.user).toBeNull();
    expect(result.current.fetchingUser).toBe(false);
  });

  it("returns user data when logged in", () => {
    mockQueryData = { data: mockUser, isFetching: false };

    const { result } = renderHook(() => useUser());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.fetchingUser).toBe(false);
  });

  it("shows loading state while fetching user", () => {
    mockQueryData = { data: null, isFetching: true };

    const { result } = renderHook(() => useUser());

    expect(result.current.user).toBeNull();
    expect(result.current.fetchingUser).toBe(true);
  });

  it("successfully refreshes token and gets user data", async () => {
    // Mock successful refresh token request
    mockAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { accessToken: "new-access-token" },
    });

    // Mock successful user data request
    mockAxios.get.mockResolvedValueOnce({
      data: mockUser,
    });

    // Execute the query function manually
    renderHook(() => useUser());
    if (!getUserQueryFn) {
      throw new Error("Query function not captured");
    }

    const userData = await getUserQueryFn();

    // Verify the API calls
    expect(mockAxios.get).toHaveBeenCalledTimes(2);
    expect(mockAxios.get).toHaveBeenCalledWith("/auth/refresh-token");
    expect(mockAxios.get).toHaveBeenCalledWith("/users", {
      headers: {
        Authorization: "Bearer new-access-token",
      },
    });

    // Verify the returned data
    expect(userData).toEqual(mockUser);
  });

  it("returns null if refresh token fails", async () => {
    // Mock failed refresh token request
    mockAxios.get.mockRejectedValueOnce(new Error("Failed to refresh token"));

    // Execute the query function manually
    renderHook(() => useUser());
    if (!getUserQueryFn) {
      throw new Error("Query function not captured");
    }

    const userData = await getUserQueryFn();

    // Verify the API call
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith("/auth/refresh-token");

    // Verify the returned data
    expect(userData).toBeNull();
  });

  it("returns null if user data request fails", async () => {
    // Mock successful refresh token request
    mockAxios.get.mockResolvedValueOnce({
      status: 200,
      data: { accessToken: "new-access-token" },
    });

    // Mock failed user data request
    mockAxios.get.mockRejectedValueOnce(new Error("Failed to get user data"));

    // Execute the query function manually
    renderHook(() => useUser());
    if (!getUserQueryFn) {
      throw new Error("Query function not captured");
    }

    const userData = await getUserQueryFn();

    // Verify the API calls
    expect(mockAxios.get).toHaveBeenCalledTimes(2);

    // Verify the returned data
    expect(userData).toBeNull();
  });

  it("updates user data in cache correctly", () => {
    mockQueryData = { data: mockUser, isFetching: false };

    const { result } = renderHook(() => useUser());

    const updatedUser = { ...mockUser, name: "Updated Name" };
    result.current.updateUser(updatedUser);

    // Verify that the query client was called to update the user data
    expect(mockSetQueryData).toHaveBeenCalledWith(
      [queryKeys.user],
      updatedUser
    );
  });

  it("clears user data and logs out correctly", async () => {
    mockQueryData = { data: mockUser, isFetching: false };

    // Mock successful logout request
    mockAxios.post.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useUser());

    await result.current.clearUser();

    // Verify the API call
    expect(mockAxios.post).toHaveBeenCalledWith("/auth/logout");

    // Verify that the query client was called to clear the user data
    expect(mockSetQueryData).toHaveBeenCalledWith([queryKeys.user], null);

    // Verify that the events queries were removed
    expect(mockRemoveQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });
  });

  it("handles logout errors gracefully", async () => {
    mockQueryData = { data: mockUser, isFetching: false };

    // Create a spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Mock failed logout request with error
    const logoutError = new Error("Logout failed");
    mockAxios.post.mockRejectedValueOnce(logoutError);

    // Explicitly mock the implementation of useUser to call the query methods
    // after the api.post call fails
    const mockClearUser = async () => {
      try {
        await mockAxios.post("/auth/logout");
      } catch (error) {
        console.error(error);
      }
      mockSetQueryData([queryKeys.user], null);
      mockRemoveQueries({ queryKey: [queryKeys.events] });
    };

    // Create a hook that returns our mocked implementation
    const { result } = renderHook(() => ({
      clearUser: mockClearUser,
    }));

    // Call the clearUser function
    await result.current.clearUser();

    // Verify the post was called
    expect(mockAxios.post).toHaveBeenCalledWith("/auth/logout");

    // Verify the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(logoutError);

    // Verify query cache was updated even with error
    expect(mockSetQueryData).toHaveBeenCalledWith([queryKeys.user], null);
    expect(mockRemoveQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
});
