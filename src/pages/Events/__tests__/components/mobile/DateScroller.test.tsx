import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NAV_HEIGHT } from "@/constants/app";
import DateScroller from "@/pages/Events/components/mobile/DateScroller/DateScroller";

// Mock dayjs
vi.mock("dayjs", () => {
  return {
    default: vi.fn((date) => ({
      format: vi.fn(() => (date ? "January 2023" : "Invalid Date")),
    })),
  };
});

describe("DateScroller", () => {
  it("renders with the formatted date when date prop is provided", () => {
    render(<DateScroller date="2023-01-15" />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "January 2023"
    );
  });

  it("renders 'Today' when no date is provided", () => {
    render(<DateScroller />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Today"
    );
  });

  it("renders a custom label when label prop is provided", () => {
    const customLabel = "Custom Month View";
    render(<DateScroller label={customLabel} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      customLabel
    );
  });

  it("prioritizes label over date when both are provided", () => {
    const customLabel = "Custom Month View";
    render(<DateScroller date="2023-01-15" label={customLabel} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      customLabel
    );
  });

  it("has the correct sticky positioning based on NAV_HEIGHT", () => {
    render(<DateScroller />);

    const container = screen.getByRole("heading", { level: 2 }).parentElement
      ?.parentElement;
    // Use the NAV_HEIGHT without adding "px" since it already contains the unit
    expect(container).toHaveStyle(`top: ${NAV_HEIGHT}`);
  });

  it("has the correct styling classes", () => {
    render(<DateScroller />);

    const container = screen.getByRole("heading", { level: 2 }).parentElement
      ?.parentElement;
    expect(container).toHaveClass("sticky");
    expect(container).toHaveClass("z-20");
    expect(container).toHaveClass("bg-primary-light");

    const innerContainer = screen.getByRole("heading", {
      level: 2,
    }).parentElement;
    expect(innerContainer).toHaveClass("border");
    expect(innerContainer).toHaveClass("bg-event");
    expect(innerContainer).toHaveClass("rounded");
    expect(innerContainer).toHaveClass("text-center");
  });
});
