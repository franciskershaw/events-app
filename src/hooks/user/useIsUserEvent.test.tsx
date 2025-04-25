import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Event } from "@/types/globalTypes";

import useIsUserEvent from "./useIsUserEvent";
import useUser from "./useUser";

// Mock the useUser hook
vi.mock("./useUser", () => ({
  default: vi.fn(() => ({
    user: {
      _id: "user-123",
      name: "Test User",
    },
    fetchingUser: false,
    updateUser: vi.fn(),
    clearUser: vi.fn(),
  })),
}));

describe("useIsUserEvent", () => {
  // Create a sample event
  const createEvent = (createdById: string): Event => ({
    _id: "event-123",
    title: "Test Event",
    date: {
      start: "2023-01-01T10:00:00",
      end: "2023-01-01T11:00:00",
    },
    category: {
      _id: "category-123",
      name: "Test Category",
      icon: "test-icon",
    },
    createdBy: {
      _id: createdById,
      name: "Event Creator",
    },
    description: "Test Description",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
    unConfirmed: false,
    private: false,
  });

  it("should return true when the event was created by the current user", () => {
    const event = createEvent("user-123");
    const { result } = renderHook(() => useIsUserEvent(event));

    expect(result.current).toBe(true);
  });

  it("should return false when the event was not created by the current user", () => {
    const event = createEvent("different-user-456");
    const { result } = renderHook(() => useIsUserEvent(event));

    expect(result.current).toBe(false);
  });

  it("should return false when there is no user logged in", () => {
    // Temporarily override the mock to return null user
    const mockedUseUser = vi.mocked(useUser);
    mockedUseUser.mockReturnValueOnce({
      user: null,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    const event = createEvent("user-123");
    const { result } = renderHook(() => useIsUserEvent(event));

    expect(result.current).toBe(false);
  });
});
