import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosInstance } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

import useGetPastMonthEvents from "../../hooks/useGetPastMonthEvents";

// Mock dependencies
vi.mock("@tanstack/react-query");
vi.mock("@/hooks/axios/useAxios");
vi.mock("@/hooks/user/useUser");

describe("useGetPastMonthEvents", () => {
  // Mock user
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-token",
    connections: [],
  };

  // Mock past month events data
  const mockPastMonthEvents = [
    {
      _id: "event1",
      title: "Past Birthday Party",
      date: {
        start: "2023-04-15T14:00:00",
        end: "2023-04-15T18:00:00",
      },
      category: {
        _id: "category1",
        name: "Social",
      },
    },
    {
      _id: "event2",
      title: "Past Team Meeting",
      date: {
        start: "2023-04-20T10:00:00",
        end: "2023-04-20T11:00:00",
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
    mockGet.mockResolvedValue({ data: mockPastMonthEvents });
    vi.mocked(useAxios).mockReturnValue({
      get: mockGet,
    } as unknown as AxiosInstance);

    // Mock useQuery with default successful response
    vi.mocked(useQuery).mockReturnValue({
      data: mockPastMonthEvents,
      isFetching: false,
      isError: false,
    } as unknown as UseQueryResult<unknown, unknown>);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call the correct API endpoint to fetch past month events", () => {
    // Render the hook
    renderHook(() => useGetPastMonthEvents());

    // Get the arguments passed to useQuery
    const queryOptions = vi.mocked(useQuery).mock.calls[0][0];

    // Extract and call the queryFn (ensuring it's defined)
    const queryFn = queryOptions.queryFn;
    if (queryFn && typeof queryFn === "function") {
      // TypeScript thinks queryFn needs arguments, but for testing we're mocking the actual API call
      // so we can just cast it to allow no arguments
      (queryFn as () => Promise<unknown>)();
    }

    // Verify API was called with correct endpoint and headers
    expect(mockGet).toHaveBeenCalledWith("/events/pastMonth", {
      headers: { Authorization: `Bearer ${mockUser.accessToken}` },
    });

    // Verify correct query key was used
    expect(queryOptions.queryKey).toEqual([queryKeys.eventsPastMonth]);
  });

  it("should return past month events data when API call is successful", () => {
    // Mock a successful API response
    vi.mocked(useQuery).mockReturnValue({
      data: mockPastMonthEvents,
      isFetching: false,
      isError: false,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetPastMonthEvents());

    // Verify events data is returned correctly
    expect(result.current.eventsPastMonth).toEqual(mockPastMonthEvents);
    expect(result.current.fetchingEvents).toBe(false);
    expect(result.current.errorFetchingEvents).toBe(false);
  });

  it("should return empty array when no past month events are found", () => {
    // Mock an API response with no events
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: false,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetPastMonthEvents());

    // Verify default empty array is returned
    expect(result.current.eventsPastMonth).toEqual([]);
    expect(result.current.fetchingEvents).toBe(false);
    expect(result.current.errorFetchingEvents).toBe(false);
  });

  it("should show loading state while fetching past month events", () => {
    // Mock a loading state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isFetching: true,
      isError: false,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetPastMonthEvents());

    // Verify loading state is returned
    expect(result.current.fetchingEvents).toBe(true);
  });

  it("should show error state when fetching past month events fails", () => {
    // Mock an error state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetPastMonthEvents());

    // Verify error state is returned
    expect(result.current.errorFetchingEvents).toBe(true);
    expect(result.current.eventsPastMonth).toEqual([]);
  });
});
