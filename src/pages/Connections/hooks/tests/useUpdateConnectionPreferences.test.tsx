import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import useGetEvents from "@/pages/Events/hooks/useGetEvents";
import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useUpdateConnectionPreferences from "../useUpdateConnectionPreferences";

// Type for the connection
interface Connection {
  _id: string;
  name: string;
  email: string;
  hideEvents: boolean;
}

// Type for API response on success
interface UpdatePreferencesResponse {
  _id: string;
  hideEvents: boolean;
}

// Type for mutation options
interface MutationOptions {
  mutationFn: (data: {
    connectionId: string;
    hideEvents: boolean;
  }) => Promise<UpdatePreferencesResponse>;
  onSuccess: (response: UpdatePreferencesResponse) => void;
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

vi.mock("@/pages/Events/hooks/useGetEvents", () => ({
  default: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useUpdateConnectionPreferences", () => {
  // Mock connections
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

  // Mock API response for updating the connection
  const mockResponse: UpdatePreferencesResponse = {
    _id: mockConnection._id,
    hideEvents: true, // Updating to hide events
  };

  // Setup mocks
  const mockMutate = vi.fn();
  const mockSetQueryData = vi.fn();
  const mockPatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock user hook
    vi.mocked(useUser).mockReturnValue({
      user: mockUser,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    // Mock axios patch method
    mockPatch.mockResolvedValue({ data: mockResponse });
    vi.mocked(useAxios).mockReturnValue({
      patch: mockPatch,
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

  it("should call the correct API endpoint to update connection preferences", () => {
    // Render the hook
    renderHook(() => useUpdateConnectionPreferences());

    // Extract the mutation function from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Get the mutationFn
    const updatePreferencesFn = mutationOptions.mutationFn;

    // Test the mutation function with connection ID and preference
    const updateData = {
      connectionId: mockConnection._id,
      hideEvents: true,
    };
    updatePreferencesFn(updateData);

    // Verify API called with correct params
    expect(mockPatch).toHaveBeenCalledWith(
      `/users/connections/${updateData.connectionId}/preferences`,
      { hideEvents: updateData.hideEvents },
      {
        headers: {
          Authorization: `Bearer ${mockUser.accessToken}`,
        },
      }
    );
  });

  it("should update user data in cache on successful preference update", () => {
    // Render the hook
    renderHook(() => useUpdateConnectionPreferences());

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

    // Find the updated connection
    const updatedConnection = result.connections.find(
      (conn: Connection) => conn._id === mockConnection._id
    );

    // Verify the connection preference was updated
    expect(updatedConnection).toBeDefined();
    expect(updatedConnection?.hideEvents).toBe(true);

    // Should not modify other connections
    const otherConnection = result.connections.find(
      (conn: Connection) => conn._id === "conn456"
    );
    expect(otherConnection?.hideEvents).toBe(true); // Already set to true
  });

  it("should handle null user data gracefully", () => {
    // Render the hook
    renderHook(() => useUpdateConnectionPreferences());

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

  it("should make useGetEvents available for fetching events", () => {
    // Render the hook
    renderHook(() => useUpdateConnectionPreferences());

    // Verify that useGetEvents was called
    expect(useGetEvents).toHaveBeenCalled();
  });

  it("should show error toast when preference update fails", () => {
    // Error message from server
    const errorMessage = "Failed to update connection preferences";

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
    renderHook(() => useUpdateConnectionPreferences());

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
    renderHook(() => useUpdateConnectionPreferences());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Call the onError handler manually
    mutationOptions.onError(genericError);

    // Verify error toast was shown with generic message
    expect(toast.error).toHaveBeenCalledWith("Network Error");
  });
});
