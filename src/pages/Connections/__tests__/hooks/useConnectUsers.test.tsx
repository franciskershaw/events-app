import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useConnectUsers from "../../hooks/useConnectUsers";

// Type for the connected user returned by the API
interface ConnectedUser {
  _id: string;
  name: string;
  email: string;
  hideEvents: boolean;
}

// Type for mutation options
interface MutationOptions {
  mutationFn: (connectionId: string) => Promise<ConnectedUser>;
  onSuccess: (data: ConnectedUser) => void;
  onError: (error: AxiosError<{ message: string }> | Error) => void;
}

// Mock dependencies
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: vi.fn(),
    useMutation: vi.fn(),
  };
});

vi.mock("@/hooks/axios/useAxios", () => ({
  default: vi.fn(),
}));

vi.mock("@/hooks/user/useUser", () => ({
  default: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useConnectUsers", () => {
  // Mock user
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-access-token",
    connections: [],
  };

  // Connected user to return from the API
  const mockConnectedUser: ConnectedUser = {
    _id: "conn123",
    name: "Connected User",
    email: "connected@example.com",
    hideEvents: false,
  };

  // Setup mocks
  const mockMutate = vi.fn();
  const mockSetQueryData = vi.fn();
  const mockInvalidateQueries = vi.fn();
  const mockPost = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock user hook
    vi.mocked(useUser).mockReturnValue({
      user: mockUser,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    // Mock axios post method
    mockPost.mockResolvedValue({ data: mockConnectedUser });
    vi.mocked(useAxios).mockReturnValue({
      post: mockPost,
    } as unknown as AxiosInstance);

    // Mock query client
    vi.mocked(useQueryClient).mockReturnValue({
      setQueryData: mockSetQueryData,
      invalidateQueries: mockInvalidateQueries,
    } as unknown as ReturnType<typeof useQueryClient>);

    // Mock useMutation
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as ReturnType<typeof useMutation>);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call the correct API endpoint with connection ID", () => {
    // Render the hook
    renderHook(() => useConnectUsers());

    // Extract the mutation function from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Get the mutationFn
    const connectUsersFn = mutationOptions.mutationFn;

    // Test the mutation function
    const connectionId = "test-connection-id";
    connectUsersFn(connectionId);

    // Verify API called with correct params
    expect(mockPost).toHaveBeenCalledWith(
      "/users/connections",
      { connectionId },
      {
        headers: {
          Authorization: `Bearer ${mockUser.accessToken}`,
        },
      }
    );
  });

  it("should update user data in cache on successful connection", () => {
    // Render the hook
    renderHook(() => useConnectUsers());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onSuccess handler manually with the mock connected user
    mutationOptions.onSuccess(mockConnectedUser);

    // Verify cache was updated correctly
    expect(mockSetQueryData).toHaveBeenCalledWith(
      [queryKeys.user],
      expect.any(Function)
    );

    // Test the update function passed to setQueryData
    const updateFn = mockSetQueryData.mock.calls[0][1];
    const result = updateFn(mockUser);

    // Verify the result has the connected user added to connections
    expect(result.connections).toContain(mockConnectedUser);
    expect(result.connections.length).toBe(mockUser.connections.length + 1);

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify success toast was shown
    expect(toast.success).toHaveBeenCalledWith(
      `Connected with ${mockConnectedUser.name}`
    );
  });

  it("should handle null user data gracefully", () => {
    // Render the hook
    renderHook(() => useConnectUsers());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onSuccess handler manually
    mutationOptions.onSuccess(mockConnectedUser);

    // Test the update function with null user data
    const updateFn = mockSetQueryData.mock.calls[0][1];
    const result = updateFn(null);

    // Should return null unchanged
    expect(result).toBeNull();
  });

  it("should show error toast when connection fails", () => {
    // Error message from server
    const errorMessage = "Connection failed: Invalid connection ID";

    // Setup error response
    const error = {
      response: {
        data: {
          message: errorMessage,
        },
      },
      message: "Request failed with status code 400",
    } as AxiosError<{ message: string }>;

    // Render the hook
    renderHook(() => useConnectUsers());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onError handler manually
    mutationOptions.onError(error);

    // Verify error toast was shown with server message
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("should fall back to generic error message when server message missing", () => {
    // Setup error without server response
    const genericError = new Error("Network Error");

    // Render the hook
    renderHook(() => useConnectUsers());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onError handler manually
    mutationOptions.onError(genericError);

    // Verify error toast was shown with generic message
    expect(toast.error).toHaveBeenCalledWith("Network Error");
  });
});
