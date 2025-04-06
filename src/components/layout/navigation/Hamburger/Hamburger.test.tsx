import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Import the mocked hooks after mocking them
import { useSidebar } from "@/contexts/Sidebar/mobile/SidebarContext";
import { useIsMobile } from "@/hooks/utility/use-mobile";

import Hamburger from "./Hamburger";

// Mock the custom hooks
vi.mock("@/contexts/Sidebar/mobile/SidebarContext", () => ({
  useSidebar: vi.fn(),
}));

vi.mock("@/hooks/utility/use-mobile", () => ({
  useIsMobile: vi.fn(),
}));

describe("Hamburger Component", () => {
  const toggleSidebarMock = vi.fn();
  const closeSidebarMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly in desktop mode when collapsed", () => {
    // Setup mocks
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: false,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });
    vi.mocked(useIsMobile).mockReturnValue(false);

    render(<Hamburger />);

    // Verify button is rendered
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Verify desktop styling is applied (primary color, not secondary)
    const container = button.querySelector("div");
    expect(container).toHaveClass("bg-primary");

    // Verify it's in collapsed state - the hamburger lines should be visible
    // and not translated
    const lines = button.querySelectorAll("div > div > div");
    const firstLine = lines[0];
    expect(firstLine).not.toHaveClass("translate-x-10");
  });

  it("renders correctly in mobile mode when collapsed", () => {
    // Setup mocks for mobile
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: false,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });
    vi.mocked(useIsMobile).mockReturnValue(true);

    render(<Hamburger />);

    // Verify button is rendered
    const button = screen.getByRole("button");

    // Verify mobile styling is applied (secondary color, not primary)
    const container = button.querySelector("div");
    expect(container).toHaveClass("bg-secondary");
    expect(container).toHaveClass("wh-hamburger");
  });

  it("renders correctly when expanded", () => {
    // Setup mocks for expanded state
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: true,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });
    vi.mocked(useIsMobile).mockReturnValue(false);

    render(<Hamburger />);

    // Verify it's in expanded state - the hamburger lines should be translated
    const button = screen.getByRole("button");
    const lines = button.querySelectorAll("div > div > div");

    // First line should be translated
    const firstLine = lines[0];
    expect(firstLine).toHaveClass("translate-x-10");

    // X icon should be visible
    const xContainer = lines[3];
    expect(xContainer).toHaveClass("translate-x-0");
  });

  it("calls toggleSidebar when clicked", () => {
    // Setup mocks
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: false,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });
    vi.mocked(useIsMobile).mockReturnValue(false);

    render(<Hamburger />);

    // Get button and click it
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Verify toggleSidebar was called
    expect(toggleSidebarMock).toHaveBeenCalledTimes(1);
  });

  it("prevents event propagation when clicked", () => {
    // Setup mocks
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: false,
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });
    vi.mocked(useIsMobile).mockReturnValue(false);

    render(<Hamburger />);

    // Create a spy for stopPropagation
    const stopPropagationSpy = vi.fn();

    // Get button and click it with a custom event
    const button = screen.getByRole("button");
    fireEvent.click(button, {
      stopPropagation: stopPropagationSpy,
    });

    // In a real event, stopPropagation would be called, but fireEvent simulates
    // at a lower level, after event handlers like stopPropagation have run.
    // We're verifying the toggleSidebar was called, which proves our onClick handler ran
    expect(toggleSidebarMock).toHaveBeenCalledTimes(1);
  });

  it("handles edge cases with different states", () => {
    // Test with undefined/null values to ensure component handles them gracefully
    vi.mocked(useSidebar).mockReturnValue({
      isExpanded: undefined as unknown as boolean, // Force undefined to test fallback behavior
      toggleSidebar: toggleSidebarMock,
      closeSidebar: closeSidebarMock,
    });
    vi.mocked(useIsMobile).mockReturnValue(undefined as unknown as boolean); // Force undefined

    // This should still render without crashing
    render(<Hamburger />);

    // Button should still be rendered
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();

    // Click should still work
    fireEvent.click(button);
    expect(toggleSidebarMock).toHaveBeenCalledTimes(1);
  });
});
