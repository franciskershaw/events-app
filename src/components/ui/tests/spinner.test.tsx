import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "../spinner";

describe("Spinner component", () => {
  it("renders with default props", () => {
    const { container } = render(<Spinner />);

    // Check that the outer div exists with correct classes
    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveClass("animate-spin");
    expect(spinner).toHaveClass("h-8"); // md size is default
    expect(spinner).toHaveClass("w-8");

    // Check that the inner div exists with correct classes
    const innerSpinner = spinner.firstChild as HTMLElement;
    expect(innerSpinner).toHaveClass("border-2");
    expect(innerSpinner).toHaveClass("border-t-primary");
    expect(innerSpinner).toHaveClass("border-r-transparent");
  });

  it("applies different sizes correctly", () => {
    // Test small size
    const { container: smallContainer } = render(<Spinner size="sm" />);
    expect(smallContainer.firstChild).toHaveClass("h-4");
    expect(smallContainer.firstChild).toHaveClass("w-4");

    // Test large size
    const { container: largeContainer } = render(<Spinner size="lg" />);
    expect(largeContainer.firstChild).toHaveClass("h-12");
    expect(largeContainer.firstChild).toHaveClass("w-12");
  });

  it("merges custom className with default classes", () => {
    const { container } = render(<Spinner className="test-class bg-red-500" />);

    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveClass("animate-spin"); // Default class
    expect(spinner).toHaveClass("test-class"); // Custom class
    expect(spinner).toHaveClass("bg-red-500"); // Custom class
  });

  it("passes additional props to the div element", () => {
    const { container } = render(
      <Spinner data-testid="test-spinner" aria-label="Loading" />
    );

    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveAttribute("data-testid", "test-spinner");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });
});
