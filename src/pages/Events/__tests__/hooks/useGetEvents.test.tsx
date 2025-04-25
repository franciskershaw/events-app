import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosInstance } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useGetEvents from "../../hooks/useGetEvents";

// Mock dependencies
vi.mock("@tanstack/react-query");
vi.mock("@/hooks/axios/useAxios");
vi.mock("@/hooks/user/useUser");

describe("useGetEvents", () => {
  // Mock user
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-token",
    connections: [],
  };

  // Mock events data
  const mockEvents = [
    {
      _id: "event1",
      title: "Birthday Party",
      date: {
        start: "2023-05-15T14:00:00",
        end: "2023-05-15T18:00:00",
      },
      category: {
        _id: "category1",
        name: "Social",
      },
    },
    {
      _id: "event2",
      title: "Team Meeting",
      date: {
        start: "2023-05-16T10:00:00",
        end: "2023-05-16T11:00:00",
      },
      category: {
        _id: "category2",
        name: "Work",
      },
    },
  ];

  // Setup mocks
  const mockGet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock user hook
    vi.mocked(useUser).mockReturnValue({
      user: mockUser,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    // Mock axios get method
    mockGet.mockResolvedValue({ data: mockEvents });
    vi.mocked(useAxios).mockReturnValue({
      get: mockGet,
    } as unknown as AxiosInstance);

    // Mock useQuery with default successful response
    vi.mocked(useQuery).mockReturnValue({
      data: mockEvents,
      isFetching: false,
      isError: false,
    } as unknown as UseQueryResult<unknown, unknown>);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call the correct API endpoint to fetch events", () => {
    // Extract the queryFn by rendering the hook and capturing the useQuery call
    renderHook(() => useGetEvents());

    // Get the arguments passed to useQuery
    const queryOptions = vi.mocked(useQuery).mock.calls[0][0];

    // Extract and call the queryFn
    const queryFn = queryOptions.queryFn;
    if (queryFn && typeof queryFn === "function") {
      (queryFn as () => Promise<unknown>)();
    }

    // Verify API was called with correct endpoint and headers
    expect(mockGet).toHaveBeenCalledWith("/events", {
      headers: { Authorization: `Bearer ${mockUser.accessToken}` },
    });

    // Verify correct query key was used
    expect(queryOptions.queryKey).toEqual([queryKeys.events]);
  });

  it("should return events data when API call is successful", () => {
    // Mock a successful API response
    vi.mocked(useQuery).mockReturnValue({
      data: mockEvents,
      isFetching: false,
      isError: false,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetEvents());

    // Verify events data is returned correctly
    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.fetchingEvents).toBe(false);
    expect(result.current.errorFetchingEvents).toBe(false);
  });

  it("should return empty array when no events are returned", () => {
    // Mock an API response with no events
    vi.mocked(useQuery).mockReturnValue({
      data: undefined, // No data returned from API
      isFetching: false,
      isError: false,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetEvents());

    // Verify default empty array is returned
    expect(result.current.events).toEqual([]);
    expect(result.current.fetchingEvents).toBe(false);
    expect(result.current.errorFetchingEvents).toBe(false);
  });

  it("should show loading state while fetching events", () => {
    // Mock a loading state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isFetching: true,
      isError: false,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetEvents());

    // Verify loading state is returned
    expect(result.current.fetchingEvents).toBe(true);
  });

  it("should show error state when fetching events fails", () => {
    // Mock an error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetEvents());

    // Verify error state is returned
    expect(result.current.errorFetchingEvents).toBe(true);
    expect(result.current.events).toEqual([]);
  });
});
