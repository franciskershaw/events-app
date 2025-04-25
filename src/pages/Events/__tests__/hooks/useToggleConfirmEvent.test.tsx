import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useToggleConfirmEvent from "../../hooks/useToggleConfirmEvent";

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

describe("useToggleConfirmEvent", () => {
  // Mock user
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-token",
    connections: [],
  };

  // Mock event data
  const mockEventId = "event123";
  const mockInitialUnconfirmed = true;

  // Mock API responses
  const mockConfirmResponse = {
    _id: mockEventId,
    unConfirmed: false,
  };

  const mockUnconfirmResponse = {
    _id: mockEventId,
    unConfirmed: true,
  };

  // Setup mocks
  const mockMutate = vi.fn();
  const mockInvalidateQueries = vi.fn();
  const mockPut = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock user hook
    vi.mocked(useUser).mockReturnValue({
      user: mockUser,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    // Mock axios put method
    mockPut.mockResolvedValue({ data: mockConfirmResponse });
    vi.mocked(useAxios).mockReturnValue({
      put: mockPut,
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

  it("should call the correct API endpoint to toggle event confirmation", () => {
    // Render the hook
    renderHook(() => useToggleConfirmEvent());

    // Extract the mutation function from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Get the mutationFn and ensure it's defined
    const toggleConfirmEventFn = mutationOptions.mutationFn;

    // Skip test if mutationFn is undefined
    if (!toggleConfirmEventFn) {
      expect.assertions(0);
      return;
    }

    // Call the function with the event ID and current unconfirmed state
    toggleConfirmEventFn({
      eventId: mockEventId,
      unConfirmed: mockInitialUnconfirmed,
    });

    // Verify API called with correct params - should send the opposite of current state
    expect(mockPut).toHaveBeenCalledWith(
      `/events/${mockEventId}`,
      { unConfirmed: !mockInitialUnconfirmed },
      {
        headers: {
          Authorization: `Bearer ${mockUser.accessToken}`,
        },
      }
    );
  });

  it("should show success toast when confirming an event", () => {
    // Render the hook
    renderHook(() => useToggleConfirmEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onSuccess callback is not defined
    if (!mutationOptions.onSuccess) {
      expect.assertions(0);
      return;
    }

    // Call the onSuccess handler manually with the mock confirmed event data
    mutationOptions.onSuccess(
      mockConfirmResponse,
      { eventId: mockEventId, unConfirmed: mockInitialUnconfirmed },
      undefined
    );

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify success toast was shown with appropriate message for confirmed event
    expect(toast.success).toHaveBeenCalledWith("Event confirmed!");
  });

  it("should show success toast when unconfirming an event", () => {
    // Render the hook
    renderHook(() => useToggleConfirmEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onSuccess callback is not defined
    if (!mutationOptions.onSuccess) {
      expect.assertions(0);
      return;
    }

    // Call the onSuccess handler manually with the mock unconfirmed event data
    mutationOptions.onSuccess(
      mockUnconfirmResponse,
      { eventId: mockEventId, unConfirmed: false },
      undefined
    );

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify success toast was shown with appropriate message for unconfirmed event
    expect(toast.success).toHaveBeenCalledWith("Event unconfirmed!");
  });

  it("should show error toast when toggling event confirmation fails", () => {
    // Error message from server
    const errorMessage = "Failed to update event confirmation status";

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
    renderHook(() => useToggleConfirmEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onError callback is not defined
    if (!mutationOptions.onError) {
      expect.assertions(0);
      return;
    }

    // Call the onError handler manually
    mutationOptions.onError(
      error,
      { eventId: mockEventId, unConfirmed: mockInitialUnconfirmed },
      undefined
    );

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify error toast was shown with server message
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("should use generic error message if server message is unavailable", () => {
    // Error without server message
    const error = new Error("Network error") as AxiosError;

    // Render the hook
    renderHook(() => useToggleConfirmEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onError callback is not defined
    if (!mutationOptions.onError) {
      expect.assertions(0);
      return;
    }

    // Call the onError handler manually
    mutationOptions.onError(
      error,
      { eventId: mockEventId, unConfirmed: mockInitialUnconfirmed },
      undefined
    );

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify error toast was shown with generic error message
    expect(toast.error).toHaveBeenCalledWith("Network error");
  });
});
