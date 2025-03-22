import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SwipeableIndicator from "./SwipeableIndicator";

describe("SwipeableIndicator Component", () => {
  it("renders vertical indicator with left alignment", () => {
    render(<SwipeableIndicator orientation="vertical" alignment="left" />);

    // Find the container
    const container = screen.getByTestId("swipeable-container");
    expect(container).toBeInTheDocument();

    // Check alignment class
    expect(container).toHaveClass("left-0");
    expect(container).not.toHaveClass("right-0");

    // Check the indicator element
    const indicator = screen.getByTestId("swipeable-indicator");
    expect(indicator).toHaveClass(
      "w-1",
      "h-full",
      "bg-secondary",
      "rounded-full"
    );
    expect(indicator).toHaveAttribute("aria-hidden", "true");
  });

  it("renders vertical indicator with right alignment", () => {
    render(<SwipeableIndicator orientation="vertical" alignment="right" />);

    // Find the container
    const container = screen.getByTestId("swipeable-container");
    expect(container).toBeInTheDocument();

    // Check alignment class
    expect(container).toHaveClass("right-0");
    expect(container).not.toHaveClass("left-0");

    // Check the indicator element
    const indicator = screen.getByTestId("swipeable-indicator");
    expect(indicator).toHaveClass(
      "w-1",
      "h-full",
      "bg-secondary",
      "rounded-full"
    );
  });

  it("renders vertical indicator with default right alignment when not specified", () => {
    render(<SwipeableIndicator orientation="vertical" />);

    // Find the container
    const container = screen.getByTestId("swipeable-container");
    expect(container).toBeInTheDocument();

    // Check default alignment is right
    expect(container).toHaveClass("right-0");
    expect(container).not.toHaveClass("left-0");
  });

  it("renders horizontal indicator", () => {
    render(<SwipeableIndicator orientation="horizontal" />);

    // Find the container for horizontal orientation
    const container = screen.getByTestId("swipeable-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("mx-auto", "pt-4");

    // Check the indicator element
    const indicator = screen.getByTestId("swipeable-indicator");
    expect(indicator).toHaveClass(
      "h-1",
      "w-[100px]",
      "bg-secondary",
      "rounded-full"
    );
  });

  it("ignores alignment prop when orientation is horizontal", () => {
    render(<SwipeableIndicator orientation="horizontal" alignment="left" />);

    // Find the container for horizontal orientation
    const container = screen.getByTestId("swipeable-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("mx-auto", "pt-4");
    expect(container).not.toHaveClass("left-0");
    expect(container).not.toHaveClass("right-0");
  });

  it("applies correct positioning classes for vertical orientation", () => {
    render(<SwipeableIndicator orientation="vertical" />);

    // Find the container
    const container = screen.getByTestId("swipeable-container");
    expect(container).toBeInTheDocument();

    // Check positioning classes
    expect(container).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "absolute",
      "top-0",
      "bottom-0",
      "px-1",
      "py-2"
    );
  });

  it("sets aria-hidden attribute for accessibility", () => {
    render(<SwipeableIndicator orientation="vertical" />);

    // Get the indicator element
    const indicator = screen.getByTestId("swipeable-indicator");
    expect(indicator).toHaveAttribute("aria-hidden", "true");
  });
});
