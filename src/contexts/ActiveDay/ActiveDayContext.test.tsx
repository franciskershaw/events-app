import { ReactNode } from "react";

import { act, renderHook } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { ActiveDayProvider, useActiveDay } from "./ActiveDayContext";

// Wrapper component for testing the hook
const wrapper = ({ children }: { children: ReactNode }) => (
  <ActiveDayProvider>{children}</ActiveDayProvider>
);

describe("ActiveDayContext", () => {
  it("should provide the current day as the default active day", () => {
    const { result } = renderHook(() => useActiveDay(), { wrapper });

    // Check if activeDay is a dayjs instance
    expect(result.current.activeDay.isValid()).toBe(true);

    // Check if it's close to current date (within 1 second)
    const now = dayjs();
    const diff = Math.abs(result.current.activeDay.diff(now, "second"));
    expect(diff).toBeLessThan(1);
  });

  it("should update the active day when setActiveDay is called", () => {
    const { result } = renderHook(() => useActiveDay(), { wrapper });

    const newDate = dayjs("2023-01-01");

    act(() => {
      result.current.setActiveDay(newDate);
    });

    expect(result.current.activeDay.format("YYYY-MM-DD")).toBe("2023-01-01");
  });

  it("should throw an error when useActiveDay is used outside of ActiveDayProvider", () => {
    // Expect the hook to throw when used outside of provider
    expect(() => renderHook(() => useActiveDay())).toThrow(
      "useActiveDay must be used within an ActiveDayProvider"
    );
  });
});
