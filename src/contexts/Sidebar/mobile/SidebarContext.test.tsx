import { ReactNode } from "react";

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SidebarProvider, useSidebar } from "./SidebarContext";

// Test wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <SidebarProvider>{children}</SidebarProvider>
);

describe("SidebarContext", () => {
  beforeEach(() => {
    // Setup document body style properties for test
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  });

  afterEach(() => {
    // Cleanup document body styles
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
  });

  it("should initialize with isExpanded as false", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });

    expect(result.current.isExpanded).toBe(false);
  });

  it("should toggle isExpanded when toggleSidebar is called", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });

    expect(result.current.isExpanded).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isExpanded).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isExpanded).toBe(false);
  });

  it("should set isExpanded to false when closeSidebar is called", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });

    // First expand the sidebar
    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.isExpanded).toBe(true);

    // Then close it
    act(() => {
      result.current.closeSidebar();
    });

    expect(result.current.isExpanded).toBe(false);
  });

  it("should lock body scroll when sidebar is expanded", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });

    // Mock window.scrollY
    Object.defineProperty(window, "scrollY", {
      value: 100,
      writable: true,
    });

    act(() => {
      result.current.toggleSidebar();
    });

    expect(document.body.style.overflow).toBe("hidden");
    expect(document.body.style.position).toBe("fixed");
    expect(document.body.style.top).toBe("-100px");
    expect(document.body.style.width).toBe("100%");
  });

  it("should restore body scroll when sidebar is closed", () => {
    const { result } = renderHook(() => useSidebar(), { wrapper });

    // Mock window.scrollY and scrollTo
    Object.defineProperty(window, "scrollY", {
      value: 100,
      writable: true,
    });
    const scrollToSpy = vi
      .spyOn(window, "scrollTo")
      .mockImplementation(() => {});

    // First expand the sidebar
    act(() => {
      result.current.toggleSidebar();
    });

    // Then close it
    act(() => {
      result.current.closeSidebar();
    });

    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.position).toBe("");
    expect(document.body.style.top).toBe("");
    expect(document.body.style.width).toBe("");
    expect(scrollToSpy).toHaveBeenCalledWith(0, 100);

    scrollToSpy.mockRestore();
  });

  it("should throw an error when useSidebar is used outside of SidebarProvider", () => {
    // Silence React error boundary warning in test output
    const consoleSpy = vi.spyOn(console, "error");
    consoleSpy.mockImplementation(() => {});

    expect(() => {
      const { result } = renderHook(() => useSidebar());
      // Access result to trigger hook execution
      return result.current;
    }).toThrow("useSidebar must be used within a SidebarProvider");

    consoleSpy.mockRestore();
  });
});
