import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useScrollVisibility } from "./useScrollVisibility";

describe("useScrollVisibility", () => {
  // Mock window properties and events
  const originalScrollY = window.scrollY;
  const originalInnerHeight = window.innerHeight;

  // Mock document properties
  const originalScrollHeight = Object.getOwnPropertyDescriptor(
    document.documentElement,
    "scrollHeight"
  );

  // Event listener mocks
  const listenerMap: Record<string, EventListener[]> = {};

  beforeEach(() => {
    // Reset listener map for each test
    Object.keys(listenerMap).forEach((key) => {
      listenerMap[key] = [];
    });

    // Mock window scroll and resize event listeners
    window.addEventListener = vi.fn((event, callback) => {
      if (!listenerMap[event]) {
        listenerMap[event] = [];
      }
      listenerMap[event].push(callback as EventListener);
    });

    window.removeEventListener = vi.fn((event, callback) => {
      if (listenerMap[event]) {
        listenerMap[event] = listenerMap[event].filter((cb) => cb !== callback);
      }
    });

    // Mock scroll position and window/document dimensions
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
      writable: true,
    });

    Object.defineProperty(document.documentElement, "scrollHeight", {
      configurable: true,
      value: 2000,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original properties
    Object.defineProperty(window, "scrollY", {
      value: originalScrollY,
      configurable: true,
    });

    Object.defineProperty(window, "innerHeight", {
      value: originalInnerHeight,
      configurable: true,
    });

    if (originalScrollHeight) {
      Object.defineProperty(
        document.documentElement,
        "scrollHeight",
        originalScrollHeight
      );
    }

    // Reset all mocks
    vi.resetAllMocks();
  });

  // Helper function to simulate scroll events
  const simulateScroll = (scrollPosition: number) => {
    // Update window.scrollY value
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: scrollPosition,
      writable: true,
    });

    // Trigger all registered scroll event listeners
    if (listenerMap["scroll"]) {
      listenerMap["scroll"].forEach((callback) =>
        callback(new Event("scroll"))
      );
    }
  };

  it("should initialize with visibility set to true", () => {
    const { result } = renderHook(() => useScrollVisibility());

    expect(result.current.isVisible).toBe(true);
    expect(result.current.isNearBottom).toBe(false);
  });

  it("should hide when scrolling down and beyond threshold", () => {
    const { result } = renderHook(() => useScrollVisibility(50));

    // Initial state - should be visible
    expect(result.current.isVisible).toBe(true);

    // Scroll down past threshold
    act(() => {
      simulateScroll(100);
    });

    // Should hide when scrolling down
    expect(result.current.isVisible).toBe(false);
  });

  it("should show when scrolling up", () => {
    const { result } = renderHook(() => useScrollVisibility(50));

    // Initial state - should be visible
    expect(result.current.isVisible).toBe(true);

    // Scroll down past threshold
    act(() => {
      simulateScroll(100);
    });

    // Should hide when scrolling down
    expect(result.current.isVisible).toBe(false);

    // Scroll up
    act(() => {
      simulateScroll(50);
    });

    // Should show when scrolling up
    expect(result.current.isVisible).toBe(true);
  });

  it("should remain visible if not scrolled beyond threshold", () => {
    const threshold = 100;
    const { result } = renderHook(() => useScrollVisibility(threshold));

    // Scroll down but not past threshold
    act(() => {
      simulateScroll(threshold - 10);
    });

    // Should remain visible
    expect(result.current.isVisible).toBe(true);
  });

  it("should show when near the bottom of page regardless of scroll direction", () => {
    const { result } = renderHook(() => useScrollVisibility(50, 100));

    // Initial state
    expect(result.current.isVisible).toBe(true);
    expect(result.current.isNearBottom).toBe(false);

    // Scroll down past threshold (but not near bottom)
    act(() => {
      simulateScroll(100);
    });

    // Should hide when scrolling down
    expect(result.current.isVisible).toBe(false);
    expect(result.current.isNearBottom).toBe(false);

    // Scroll to near bottom
    act(() => {
      simulateScroll(
        window.innerHeight + document.documentElement.scrollHeight - 150
      );
    });

    // Should show when near bottom
    expect(result.current.isVisible).toBe(true);
    expect(result.current.isNearBottom).toBe(true);
  });

  it("should respect custom threshold value", () => {
    const customThreshold = 200;
    const { result } = renderHook(() => useScrollVisibility(customThreshold));

    // Scroll down but not past custom threshold
    act(() => {
      simulateScroll(customThreshold - 50);
    });

    // Should remain visible
    expect(result.current.isVisible).toBe(true);

    // Scroll down past custom threshold
    act(() => {
      simulateScroll(customThreshold + 50);
    });

    // Should hide
    expect(result.current.isVisible).toBe(false);
  });

  it("should respect custom bottomOffset value", () => {
    const customBottomOffset = 300;
    const { result } = renderHook(() =>
      useScrollVisibility(50, customBottomOffset)
    );

    // Total document height
    const totalHeight = document.documentElement.scrollHeight;

    // First, scroll down to activate the hiding behavior
    act(() => {
      simulateScroll(100);
    });

    // Should hide when scrolling down
    expect(result.current.isVisible).toBe(false);
    expect(result.current.isNearBottom).toBe(false);

    // Scroll to position that is NOT near bottom with custom offset (300)
    // Using 350 to ensure we're not within the customBottomOffset range
    act(() => {
      simulateScroll(
        totalHeight - window.innerHeight - customBottomOffset - 50
      );
    });

    // Should not be considered near bottom with custom offset
    expect(result.current.isNearBottom).toBe(false);
    expect(result.current.isVisible).toBe(false); // Still hidden due to downward scroll

    // Scroll to position that is near bottom with custom offset
    act(() => {
      simulateScroll(
        totalHeight - window.innerHeight - customBottomOffset + 50
      );
    });

    // Should be considered near bottom
    expect(result.current.isNearBottom).toBe(true);
    expect(result.current.isVisible).toBe(true); // Visible due to being near bottom
  });

  it("should clean up event listeners on unmount", () => {
    const { unmount } = renderHook(() => useScrollVisibility());

    // Check that event listener was added
    expect(window.addEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );

    // Unmount the hook
    unmount();

    // Check that event listener was removed
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function)
    );
  });

  it("should set visibility to true on initial render", () => {
    const { result } = renderHook(() => useScrollVisibility());

    // Should be visible on initial render
    expect(result.current.isVisible).toBe(true);
  });

  it("should not hide when near bottom even if scrolling down", () => {
    const { result } = renderHook(() => useScrollVisibility(50, 100));

    // Total document height
    const totalHeight = document.documentElement.scrollHeight;

    // Set up a scenario where we're scrolling down but we're near the bottom
    act(() => {
      // First set a reasonable scroll position
      simulateScroll(50);
    });

    // Now scroll down to near the bottom
    act(() => {
      simulateScroll(totalHeight - window.innerHeight - 50);
    });

    // Should be visible and near bottom
    expect(result.current.isNearBottom).toBe(true);
    expect(result.current.isVisible).toBe(true);
  });
});
