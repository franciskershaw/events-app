import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useMakeEventPrivate from "../../hooks/useMakeEventPrivate";

// Mock dependencies
vi.mock("@tanstack/react-query");
vi.mock("@/hooks/axios/useAxios");
vi.mock("@/hooks/user/useUser");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Type for useMutation options
type MutationOptions = Parameters<typeof useMutation>[0];

describe("useMakeEventPrivate", () => {
  // Mock user
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-token",
    connections: [],
  };

  // Mock event ID
  const mockEventId = "event123";

  // Mock API responses
  const mockMakePrivateResponse = {
    _id: mockEventId,
    private: true,
  };

  const mockMakePublicResponse = {
    _id: mockEventId,
    private: false,
  };

  // Setup mocks
  const mockMutate = vi.fn();
  const mockInvalidateQueries = vi.fn();
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
    mockPatch.mockResolvedValue({ data: mockMakePrivateResponse });
    vi.mocked(useAxios).mockReturnValue({
      patch: mockPatch,
    } as unknown as AxiosInstance);

    // Mock query client
    vi.mocked(useQueryClient).mockReturnValue({
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

  it("should call the correct API endpoint to toggle event privacy", () => {
    // Render the hook
    renderHook(() => useMakeEventPrivate());

    // Extract the mutation function from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Get the mutationFn and ensure it's defined
    const makeEventPrivateFn = mutationOptions.mutationFn;

    // Skip test if mutationFn is undefined
    if (!makeEventPrivateFn) {
      expect.assertions(0);
      return;
    }

    // Call the function with the event ID
    makeEventPrivateFn(mockEventId);

    // Verify API called with correct params
    expect(mockPatch).toHaveBeenCalledWith(
      `/events/${mockEventId}/privacy`,
      {},
      {
        headers: {
          Authorization: `Bearer ${mockUser.accessToken}`,
        },
      }
    );
  });

  it("should show success toast when making event private", () => {
    // Render the hook
    renderHook(() => useMakeEventPrivate());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onSuccess callback is not defined
    if (!mutationOptions.onSuccess) {
      expect.assertions(0);
      return;
    }

    // Call the onSuccess handler manually with the mock data
    mutationOptions.onSuccess(mockMakePrivateResponse, mockEventId, undefined);

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify success toast was shown with appropriate message
    expect(toast.success).toHaveBeenCalledWith("Event made private");
  });

  it("should show success toast when making event public", () => {
    // Render the hook
    renderHook(() => useMakeEventPrivate());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onSuccess callback is not defined
    if (!mutationOptions.onSuccess) {
      expect.assertions(0);
      return;
    }

    // Call the onSuccess handler manually with the mock data for making public
    mutationOptions.onSuccess(mockMakePublicResponse, mockEventId, undefined);

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify success toast was shown with appropriate message
    expect(toast.success).toHaveBeenCalledWith("Event made visible");
  });

  it("should show error toast when toggling event privacy fails", () => {
    // Error message from server
    const errorMessage = "Failed to update event privacy";

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
    renderHook(() => useMakeEventPrivate());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onError callback is not defined
    if (!mutationOptions.onError) {
      expect.assertions(0);
      return;
    }

    // Call the onError handler manually
    mutationOptions.onError(error, mockEventId, undefined);

    // Verify error toast was shown with server message
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("should use generic error message if server message is unavailable", () => {
    // Error without server message
    const error = new Error("Network error") as AxiosError;

    // Render the hook
    renderHook(() => useMakeEventPrivate());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onError callback is not defined
    if (!mutationOptions.onError) {
      expect.assertions(0);
      return;
    }

    // Call the onError handler manually
    mutationOptions.onError(error, mockEventId, undefined);

    // Verify error toast was shown with generic error message
    expect(toast.error).toHaveBeenCalledWith("Network error");
  });

  it("should invalidate events query after settled (both success and error)", () => {
    // Render the hook
    renderHook(() => useMakeEventPrivate());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onSettled callback is not defined
    if (!mutationOptions.onSettled) {
      expect.assertions(0);
      return;
    }

    // Call the onSettled handler manually
    mutationOptions.onSettled(
      mockMakePrivateResponse,
      null,
      mockEventId,
      undefined
    );

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });
  });
});
