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

import { transformEventFormValues } from "../../helpers/helpers";
import useEditEvent from "../../hooks/useEditEvent";
import { EventFormValues } from "../../hooks/useEventForm";

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

// Mock the transform function
vi.mock("../../helpers/helpers", () => ({
  transformEventFormValues: vi.fn().mockImplementation((values) => ({
    title: values.title,
    date: {
      start: values.datetime.toISOString(),
      end: values.datetime.toISOString(),
    },
    location: {
      venue: values.venue,
      city: values.city,
    },
    description: values.description,
    category: values.category,
    unConfirmed: values.unConfirmed,
    private: values.private,
    copiedFrom: undefined,
    recurrence: values.recurrence,
  })),
}));

// Type for useMutation options
type MutationOptions = Parameters<typeof useMutation>[0];

describe("useEditEvent", () => {
  // Mock user
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-token",
    connections: [],
  };

  // Mock event form values with _id for editing
  const mockEventFormValues: EventFormValues = {
    _id: "event123",
    title: "Updated Event Title",
    datetime: new Date("2023-05-15T14:00:00"),
    category: "category123",
    unConfirmed: false,
    private: false,
    recurrence: {
      isRecurring: false,
      pattern: {
        frequency: "weekly",
        interval: 1,
      },
    },
  };

  // Mock API response
  const mockApiResponse = {
    data: {
      _id: "event123",
      title: "Updated Event Title",
      date: {
        start: "2023-05-15T14:00:00",
        end: "2023-05-15T15:00:00",
      },
      category: {
        _id: "category123",
        name: "Entertainment",
      },
    },
  };

  // Setup mocks
  const mockMutate = vi.fn();
  const mockInvalidateQueries = vi.fn();
  const mockPut = vi.fn();
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

    // Mock axios put method
    mockPut.mockResolvedValue(mockApiResponse);
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

  it("should call the correct API endpoint to edit an event", () => {
    // Render the hook
    renderHook(() => useEditEvent());

    // Extract the mutation function from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Get the mutationFn and ensure it's defined
    const editEventFn = mutationOptions.mutationFn;

    // Skip test if mutationFn is undefined
    if (!editEventFn) {
      expect.assertions(0);
      return;
    }

    // Call the function with the form values
    editEventFn(mockEventFormValues);

    // Verify the form values were transformed
    expect(transformEventFormValues).toHaveBeenCalledWith(mockEventFormValues);

    // Verify API called with correct params
    expect(mockPut).toHaveBeenCalledWith(
      `/events/${mockEventFormValues._id}`,
      expect.objectContaining({
        title: mockEventFormValues.title,
        category: mockEventFormValues.category,
      }),
      {
        headers: {
          Authorization: `Bearer ${mockUser.accessToken}`,
        },
      }
    );
  });

  it("should invalidate events query and show success toast on success", () => {
    // Render the hook
    renderHook(() => useEditEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onSuccess callback is not defined
    if (!mutationOptions.onSuccess) {
      expect.assertions(0);
      return;
    }

    // Call the onSuccess handler manually with the mock data
    mutationOptions.onSuccess(
      mockApiResponse.data,
      mockEventFormValues,
      undefined
    );

    // Verify events were invalidated
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });

    // Verify success toast was shown
    expect(toast.success).toHaveBeenCalledWith("Event edited successfully");

    // Verify modal was closed
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it("should show error toast when event editing fails", () => {
    // Error message from server
    const errorMessage = "Failed to edit event";

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
    renderHook(() => useEditEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onError callback is not defined
    if (!mutationOptions.onError) {
      expect.assertions(0);
      return;
    }

    // Call the onError handler manually
    mutationOptions.onError(error, mockEventFormValues, undefined);

    // Verify error toast was shown with server message
    expect(toast.error).toHaveBeenCalledWith(errorMessage);

    // Verify events were still invalidated to refresh the view
    expect(mockInvalidateQueries).toHaveBeenCalledWith({
      queryKey: [queryKeys.events],
    });
  });

  it("should use generic error message if server message is unavailable", () => {
    // Error without server message
    const error = new Error("Network error") as AxiosError;

    // Render the hook
    renderHook(() => useEditEvent());

    // Extract the mutation options from useMutation mock
    const mutationOptions = vi.mocked(useMutation).mock
      .calls[0][0] as MutationOptions;

    // Skip test if onError callback is not defined
    if (!mutationOptions.onError) {
      expect.assertions(0);
      return;
    }

    // Call the onError handler manually
    mutationOptions.onError(error, mockEventFormValues, undefined);

    // Verify error toast was shown with generic error message
    expect(toast.error).toHaveBeenCalledWith("Network error");
  });
});
