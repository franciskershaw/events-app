import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useGenerateConnectionId from "../useGenerateConnectionId";

// Type for connection ID returned by the API
interface ConnectionId {
  id: string;
  expiry: string;
}

// Type for mutation options
interface MutationOptions {
  mutationFn: () => Promise<ConnectionId>;
  onSuccess: (data: ConnectionId) => void;
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

describe("useGenerateConnectionId", () => {
  // Mock user
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-access-token",
    connections: [],
  };

  // Connection ID to return from the API
  const mockConnectionId: ConnectionId = {
    id: "generated-connection-id-123",
    expiry: "2023-12-31T23:59:59Z",
  };

  // Setup mocks
  const mockMutate = vi.fn();
  const mockSetQueryData = vi.fn();
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
    mockPost.mockResolvedValue({ data: mockConnectionId });
    vi.mocked(useAxios).mockReturnValue({
      post: mockPost,
    } as unknown as AxiosInstance);

    // Mock query client
    vi.mocked(useQueryClient).mockReturnValue({
      setQueryData: mockSetQueryData,
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

  it("should call the correct API endpoint to generate a connection ID", () => {
    // Render the hook
    renderHook(() => useGenerateConnectionId());

    // Extract the mutation function from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Get the mutationFn
    const generateConnectionIdFn = mutationOptions.mutationFn;

    // Call the function
    generateConnectionIdFn();

    // Verify API called with correct params
    expect(mockPost).toHaveBeenCalledWith(
      "/users/connection-id",
      {},
      {
        headers: {
          Authorization: `Bearer ${mockUser.accessToken}`,
        },
      }
    );
  });

  it("should update user data in cache on successful connection ID generation", () => {
    // Render the hook
    renderHook(() => useGenerateConnectionId());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onSuccess handler manually with the mock connection ID
    mutationOptions.onSuccess(mockConnectionId);

    // Verify cache was updated correctly
    expect(mockSetQueryData).toHaveBeenCalledWith(
      [queryKeys.user],
      expect.any(Function)
    );

    // Test the update function passed to setQueryData
    const updateFn = mockSetQueryData.mock.calls[0][1];
    const result = updateFn(mockUser);

    // Verify the result has the connection ID updated
    expect(result.connectionId).toEqual(mockConnectionId);

    // Other properties should remain untouched
    expect(result._id).toBe(mockUser._id);
    expect(result.name).toBe(mockUser.name);
    expect(result.connections).toBe(mockUser.connections);
  });

  it("should handle null user data gracefully", () => {
    // Render the hook
    renderHook(() => useGenerateConnectionId());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onSuccess handler manually
    mutationOptions.onSuccess(mockConnectionId);

    // Test the update function with null user data
    const updateFn = mockSetQueryData.mock.calls[0][1];
    const result = updateFn(null);

    // Should return null unchanged
    expect(result).toBeNull();
  });

  it("should handle case with existing connectionId", () => {
    // Create user with existing connection ID
    const userWithConnectionId: User = {
      ...mockUser,
      connectionId: {
        id: "existing-connection-id",
        expiry: "2023-11-30T23:59:59Z",
      },
    };

    // Render the hook
    renderHook(() => useGenerateConnectionId());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onSuccess handler manually
    mutationOptions.onSuccess(mockConnectionId);

    // Test the update function with user that has existing connectionId
    const updateFn = mockSetQueryData.mock.calls[0][1];
    const result = updateFn(userWithConnectionId);

    // Should replace the existing connectionId with the new one
    expect(result.connectionId).toEqual(mockConnectionId);
    expect(result.connectionId).not.toEqual(userWithConnectionId.connectionId);
  });

  it("should show error toast when connection ID generation fails", () => {
    // Error message from server
    const errorMessage = "Failed to generate connection ID";

    // Setup error response
    const error = {
      response: {
        data: {
          message: errorMessage,
        },
      },
      message: "Request failed with status code 500",
    } as AxiosError<{ message: string }>;

    // Render the hook
    renderHook(() => useGenerateConnectionId());

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
    renderHook(() => useGenerateConnectionId());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onError handler manually
    mutationOptions.onError(genericError);

    // Verify error toast was shown with generic message
    expect(toast.error).toHaveBeenCalledWith("Network Error");
  });
});
