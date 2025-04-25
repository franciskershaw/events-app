import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useRemoveConnection from "../useRemoveConnection";

// Type for the connection to be removed
interface Connection {
  _id: string;
  name: string;
  email: string;
  hideEvents: boolean;
}

// Type for API response on success
interface RemoveConnectionResponse {
  data: { _id: string };
}

// Type for mutation options
interface MutationOptions {
  mutationFn: (data: { _id: string }) => Promise<RemoveConnectionResponse>;
  onSuccess: (response: RemoveConnectionResponse) => void;
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

describe("useRemoveConnection", () => {
  // Mock connection to remove
  const mockConnection: Connection = {
    _id: "conn123",
    name: "Test Connection",
    email: "connection@example.com",
    hideEvents: false,
  };

  // Mock user with connections
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-access-token",
    connections: [
      mockConnection,
      {
        _id: "conn456",
        name: "Another Connection",
        email: "another@example.com",
        hideEvents: true,
      },
    ],
  };

  // Mock API response
  const mockResponse: RemoveConnectionResponse = {
    data: {
      _id: mockConnection._id,
    },
  };

  // Setup mocks
  const mockMutate = vi.fn();
  const mockSetQueryData = vi.fn();
  const mockInvalidateQueries = vi.fn();
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock user hook
    vi.mocked(useUser).mockReturnValue({
      user: mockUser,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    // Mock axios delete method
    mockDelete.mockResolvedValue(mockResponse);
    vi.mocked(useAxios).mockReturnValue({
      delete: mockDelete,
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

  it("should call the correct API endpoint to remove a connection", () => {
    // Render the hook
    renderHook(() => useRemoveConnection());

    // Extract the mutation function from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Get the mutationFn
    const removeConnectionFn = mutationOptions.mutationFn;

    // Test the mutation function with connection ID
    const connectionIdToRemove = { _id: mockConnection._id };
    removeConnectionFn(connectionIdToRemove);

    // Verify API called with correct params
    expect(mockDelete).toHaveBeenCalledWith(
      `/users/connections/${connectionIdToRemove._id}`,
      {
        headers: {
          Authorization: `Bearer ${mockUser.accessToken}`,
        },
      }
    );
  });

  it("should update user data in cache on successful connection removal", () => {
    // Render the hook
    renderHook(() => useRemoveConnection());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onSuccess handler manually with the mock response
    mutationOptions.onSuccess(mockResponse);

    // Verify cache was updated correctly
    expect(mockSetQueryData).toHaveBeenCalledWith(
      [queryKeys.user],
      expect.any(Function)
    );

    // Test the update function passed to setQueryData
    const updateFn = mockSetQueryData.mock.calls[0][1];
    const result = updateFn(mockUser);

    // Verify the result has the connection removed
    expect(result.connections.length).toBe(mockUser.connections.length - 1);
    expect(
      result.connections.find(
        (conn: Connection) => conn._id === mockConnection._id
      )
    ).toBeUndefined();

    // Should still contain other connections
    expect(
      result.connections.find((conn: Connection) => conn._id === "conn456")
    ).toBeDefined();

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify success toast was shown
    expect(toast.success).toHaveBeenCalledWith(
      "Connection removed successfully"
    );
  });

  it("should handle null user data gracefully", () => {
    // Render the hook
    renderHook(() => useRemoveConnection());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onSuccess handler manually
    mutationOptions.onSuccess(mockResponse);

    // Test the update function with null user data
    const updateFn = mockSetQueryData.mock.calls[0][1];
    const result = updateFn(null);

    // Should return null unchanged
    expect(result).toBeNull();
  });

  it("should show error toast when connection removal fails", () => {
    // Error message from server
    const errorMessage = "Failed to remove connection";

    // Setup error response
    const error = {
      response: {
        data: {
          message: errorMessage,
        },
      },
      message: "Request failed with status code 404",
    } as AxiosError<{ message: string }>;

    // Render the hook
    renderHook(() => useRemoveConnection());

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
    renderHook(() => useRemoveConnection());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onError handler manually
    mutationOptions.onError(genericError);

    // Verify error toast was shown with generic message
    expect(toast.error).toHaveBeenCalledWith("Network Error");
  });
});
