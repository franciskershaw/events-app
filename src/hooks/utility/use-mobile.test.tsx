import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useIsMobile } from "./use-mobile";

describe("useIsMobile Hook", () => {
  // Create media query list mock
  const mockMediaQueryList = {
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };

  // Store original window.matchMedia
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();
    
    // Save the original implementation
    originalMatchMedia = window.matchMedia;

    // Mock matchMedia to return our controlled mock
    window.matchMedia = vi.fn().mockReturnValue(mockMediaQueryList);
  });

  afterEach(() => {
    // Restore the original implementation
    window.matchMedia = originalMatchMedia;
  });

  it("should initially return false when screen width is greater than mobile breakpoint", () => {
    // Setup for non-mobile
    mockMediaQueryList.matches = false;
    
    // Render the hook
    const { result } = renderHook(() => useIsMobile());
    
    // Verify hook returns non-mobile
    expect(result.current).toBe(false);
    
    // Verify matchMedia was called with the correct breakpoint
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });

  it("should initially return true when screen width is less than mobile breakpoint", () => {
    // Setup for mobile
    mockMediaQueryList.matches = true;
    
    // Render the hook
    const { result } = renderHook(() => useIsMobile());
    
    // Verify hook returns mobile
    expect(result.current).toBe(true);
  });

  it("should add event listener on mount", () => {
    // Render the hook
    renderHook(() => useIsMobile());
    
    // Verify event listener was added
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should remove event listener on unmount", () => {
    // Render the hook and get the unmount function
    const { unmount } = renderHook(() => useIsMobile());
    
    // Trigger unmount
    unmount();
    
    // Verify event listener was removed
    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("should update state when media query changes", () => {
    // Store the change handler to trigger it later
    let changeHandler: ((event: { matches: boolean }) => void) | undefined;
    mockMediaQueryList.addEventListener.mockImplementation((eventType, handler) => {
      if (eventType === 'change') {
        changeHandler = handler as (event: { matches: boolean }) => void;
      }
    });
    
    // Start as non-mobile
    mockMediaQueryList.matches = false;
    
    // Render the hook
    const { result } = renderHook(() => useIsMobile());
    
    // Verify initial state is non-mobile
    expect(result.current).toBe(false);
    
    // Simulate changing to mobile
    mockMediaQueryList.matches = true;
    
    // Call the stored handler with a mock event - wrap in act
    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true });
      }
    });
    
    // State should be updated to mobile - no need for rerender with act
    expect(result.current).toBe(true);
  });

  it("should use correct mobile breakpoint value", () => {
    // Render the hook
    renderHook(() => useIsMobile());
    
    // Verify matchMedia was called with expected breakpoint (768 - 1 = 767)
    expect(window.matchMedia).toHaveBeenCalledWith("(max-width: 767px)");
  });
}); 