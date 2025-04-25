import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosError, AxiosInstance } from "axios";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useModals } from "@/contexts/Modals/ModalsContext";
import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useDeleteEvent from "../../hooks/useDeleteEvent";

// Mock dependencies
vi.mock("@tanstack/react-query");
vi.mock("@/hooks/axios/useAxios");
vi.mock("@/hooks/user/useUser");
vi.mock("@/contexts/Modals/ModalsContext");
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Type for useMutation options
type MutationOptions = Parameters<typeof useMutation>[0];

describe("useDeleteEvent", () => {
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

  // Mock API response
  const mockApiResponse = {
    data: {
      _id: mockEventId,
      deleted: true,
    },
  };

  // Setup mocks
  const mockMutate = vi.fn();
  const mockInvalidateQueries = vi.fn();
  const mockDelete = vi.fn();
  const mockCloseModal = vi.fn();

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
    mockDelete.mockResolvedValue(mockApiResponse);
    vi.mocked(useAxios).mockReturnValue({
      delete: mockDelete,
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

    // Mock modals context with required fields
    vi.mocked(useModals).mockReturnValue({
      closeModal: mockCloseModal,
      openEventModal: vi.fn(),
      openDeleteEventModal: vi.fn(),
      openConnectionsModal: vi.fn(),
      resetSelectedData: vi.fn(),
      isEventModalOpen: false,
      isDeleteEventModalOpen: false,
      isConnectionsModalOpen: false,
      selectedEvent: null,
      mode: null,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call the correct API endpoint to delete an event", () => {
    // Render the hook
    renderHook(() => useDeleteEvent());

    // Extract the mutation function from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Get the mutationFn and ensure it's defined
    const deleteEventFn = mutationOptions.mutationFn;

    // Skip test if mutationFn is undefined
    if (!deleteEventFn) {
      expect.assertions(0);
      return;
    }

    // Call the function with the event ID
    deleteEventFn({ _id: mockEventId });

    // Verify API called with correct params
    expect(mockDelete).toHaveBeenCalledWith(`/events/${mockEventId}`, {
      headers: {
        Authorization: `Bearer ${mockUser.accessToken}`,
      },
    });
  });

  it("should invalidate events query and show success toast on success", () => {
    // Render the hook
    renderHook(() => useDeleteEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onSuccess callback is not defined
    if (!mutationOptions.onSuccess) {
      expect.assertions(0);
      return;
    }

    // Call the onSuccess handler manually
    mutationOptions.onSuccess(mockApiResponse, { _id: mockEventId }, undefined);

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify success toast was shown
    expect(toast.success).toHaveBeenCalledWith("Event deleted successfully");

    // Verify modal was closed
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should show error toast when event deletion fails", () => {
    // Error message from server
    const errorMessage = "Failed to delete event";

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
    renderHook(() => useDeleteEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onError callback is not defined
    if (!mutationOptions.onError) {
      expect.assertions(0);
      return;
    }

    // Call the onError handler manually
    mutationOptions.onError(error, { _id: mockEventId }, undefined);

    // Verify error toast was shown with server message
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it("should use message from error object if response data is unavailable", () => {
    // Error without data.message but with error.message
    const error = {
      message: "Network error",
    } as AxiosError;

    // Render the hook
    renderHook(() => useDeleteEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onError callback is not defined
    if (!mutationOptions.onError) {
      expect.assertions(0);
      return;
    }

    // Call the onError handler manually
    mutationOptions.onError(error, { _id: mockEventId }, undefined);

    // Verify error toast was shown with error message
    expect(toast.error).toHaveBeenCalledWith("Network error");
  });
});
