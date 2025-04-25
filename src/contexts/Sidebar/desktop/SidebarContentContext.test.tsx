import { ReactNode } from "react";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  SidebarContentProvider,
  useSidebarContent,
} from "./SidebarContentContext";

// Test wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <SidebarContentProvider>{children}</SidebarContentProvider>
);

describe("SidebarContentContext", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useSidebarContent(), { wrapper });

    expect(result.current.sidebarContent).toBe("events");
    expect(result.current.sidebarOpenNavClick).toBe(false);
  });

  it("should update sidebarContent when setSidebarContent is called", () => {
    const { result } = renderHook(() => useSidebarContent(), { wrapper });

    act(() => {
      result.current.setSidebarContent("search");
    });

    expect(result.current.sidebarContent).toBe("search");
  });

  it("should update sidebarOpenNavClick when setSidebarOpenNavClick is called", () => {
    const { result } = renderHook(() => useSidebarContent(), { wrapper });

    act(() => {
      result.current.setSidebarOpenNavClick(true);
    });

    expect(result.current.sidebarOpenNavClick).toBe(true);
  });

  it("should reset sidebarOpenNavClick after a timeout when set to true", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() => useSidebarContent(), { wrapper });

    act(() => {
      result.current.setSidebarOpenNavClick(true);
    });

    expect(result.current.sidebarOpenNavClick).toBe(true);

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current.sidebarOpenNavClick).toBe(false);

    vi.useRealTimers();
  });

  it("should not set a timeout when setSidebarOpenNavClick is called with false", () => {
    const timeoutSpy = vi.spyOn(global, "setTimeout");

    const { result } = renderHook(() => useSidebarContent(), { wrapper });

    act(() => {
      result.current.setSidebarOpenNavClick(false);
    });

    expect(result.current.sidebarOpenNavClick).toBe(false);
    expect(timeoutSpy).not.toHaveBeenCalled();

    timeoutSpy.mockRestore();
  });

  it("should throw an error when useSidebarContent is used outside of SidebarContentProvider", () => {
    expect(() => renderHook(() => useSidebarContent())).toThrow(
      "useSidebarContent must be used within a SidebarContentProvider."
    );
  });
});
