import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { AxiosInstance } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { EventCategory, User } from "@/types/globalTypes";

import useGetEventCategories from "../../hooks/useGetEventCategories";

// Mock dependencies
vi.mock("@tanstack/react-query");
vi.mock("@/hooks/axios/useAxios");
vi.mock("@/hooks/user/useUser");

describe("useGetEventCategories", () => {
  // Mock user
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-token",
    connections: [],
  };

  // Mock categories data
  const mockEventCategories: EventCategory[] = [
    {
      _id: "category1",
      name: "Social",
      icon: "👥",
    },
    {
      _id: "category2",
      name: "Work",
      icon: "💼",
    },
    {
      _id: "category3",
      name: "Entertainment",
      icon: "🎬",
    },
  ];

  // Expected select options after transformation
  const expectedSelectOptions = [
    { label: "Social", value: "category1" },
    { label: "Work", value: "category2" },
    { label: "Entertainment", value: "category3" },
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
    mockGet.mockResolvedValue({ data: mockEventCategories });
    vi.mocked(useAxios).mockReturnValue({
      get: mockGet,
    } as unknown as AxiosInstance);

    // Mock useQuery with default successful response
    vi.mocked(useQuery).mockReturnValue({
      data: mockEventCategories,
      isFetching: false,
    } as unknown as UseQueryResult<unknown, unknown>);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should call the correct API endpoint to fetch event categories", () => {
    // Render the hook
    renderHook(() => useGetEventCategories());

    // Get the arguments passed to useQuery
    const queryOptions = vi.mocked(useQuery).mock.calls[0][0];

    // Extract queryFn
    const queryFn = queryOptions.queryFn;

    // Safety check before calling
    if (!queryFn || typeof queryFn !== "function") {
      expect(queryFn).toBeDefined();
      return;
    }

    // Call the queryFn
    if (queryFn && typeof queryFn === "function") {
      (queryFn as (context?: unknown) => Promise<unknown>)();
    }

    // Verify API was called with correct endpoint and headers
    expect(mockGet).toHaveBeenCalledWith("/events/categories", {
      headers: { Authorization: `Bearer ${mockUser.accessToken}` },
    });

    // Verify correct query key was used
    expect(queryOptions.queryKey).toEqual([queryKeys.eventCategories]);
  });

  it("should return event categories data when API call is successful", () => {
    // Mock a successful API response
    vi.mocked(useQuery).mockReturnValue({
      data: mockEventCategories,
      isFetching: false,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetEventCategories());

    // Verify categories data is returned correctly
    expect(result.current.eventCategories).toEqual(mockEventCategories);
    expect(result.current.fetchingEventCategories).toBe(false);
  });

  it("should transform event categories into select options format", () => {
    // Mock a successful API response
    vi.mocked(useQuery).mockReturnValue({
      data: mockEventCategories,
      isFetching: false,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetEventCategories());

    // Verify the transformation was applied correctly
    expect(result.current.eventCategorySelectOptions).toEqual(
      expectedSelectOptions
    );
  });

  it("should return empty arrays when no categories are returned", () => {
    // Mock an API response with no categories
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetEventCategories());

    // Verify default empty arrays are returned
    expect(result.current.eventCategories).toEqual([]);
    expect(result.current.eventCategorySelectOptions).toEqual([]);
    expect(result.current.fetchingEventCategories).toBe(false);
  });

  it("should show loading state while fetching categories", () => {
    // Mock a loading state
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isFetching: true,
    } as unknown as UseQueryResult<unknown, unknown>);

    // Render the hook
    const { result } = renderHook(() => useGetEventCategories());

    // Verify loading state is returned
    expect(result.current.fetchingEventCategories).toBe(true);
  });
});
