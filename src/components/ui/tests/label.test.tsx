import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "../input";
import { Label } from "../label";

describe("Label component", () => {
  // Test 1: Basic rendering
  it("renders with the provided text", () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  // Test 2: Applies default classes
  it("applies the default styling classes", () => {
    const { container } = render(<Label>Styled Label</Label>);
    const label = container.firstChild;

    expect(label).toHaveClass("text-sm");
    expect(label).toHaveClass("font-medium");
    expect(label).toHaveClass("leading-none");
  });

  // Test 3: Merges custom classes
  it("merges custom className with default styles", () => {
    const { container } = render(
      <Label className="custom-class text-red-500">Custom Label</Label>
    );
    const label = container.firstChild;

    expect(label).toHaveClass("custom-class");
    expect(label).toHaveClass("text-red-500");
    expect(label).toHaveClass("text-sm"); // Default class still present
  });

  // Test 4: Forwards ref correctly
  it("forwards ref to the underlying label element", () => {
    const ref = createRef<HTMLLabelElement>();
    const { container } = render(<Label ref={ref}>Ref Label</Label>);

    expect(ref.current).toBe(container.firstChild);
  });

  // Test 5: Properly passes htmlFor to associate with input
  it("associates with input using htmlFor attribute", () => {
    render(
      <>
        <Label htmlFor="test-input">Associated Label</Label>
        <Input id="test-input" data-testid="input" />
      </>
    );

    const label = screen.getByText("Associated Label");
    const input = screen.getByTestId("input");

    expect(label).toHaveAttribute("for", "test-input");
    expect(input).toHaveAttribute("id", "test-input");
  });

  // Test 6: Works with disabled inputs
  it("has styles for working with disabled inputs", () => {
    const { container } = render(<Label>Disabled Peer Label</Label>);
    const label = container.firstChild;

    // Check that the peer-disabled classes are present
    expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
    expect(label).toHaveClass("peer-disabled:opacity-70");
  });

  // Test 7: Passes additional props to the label element
  it("passes additional props to the label element", () => {
    render(
      <Label data-testid="test-label" aria-label="Accessible Label">
        Props Label
      </Label>
    );

    const label = screen.getByTestId("test-label");
    expect(label).toHaveAttribute("aria-label", "Accessible Label");
  });

  // Test 8: Works correctly within a form context
  it("renders correctly within a form", () => {
    render(
      <form>
        <div>
          <Label htmlFor="form-input">Form Label</Label>
          <Input id="form-input" name="test" />
        </div>
      </form>
    );

    const label = screen.getByText("Form Label");
    expect(label).toHaveAttribute("for", "form-input");
    expect(document.getElementById("form-input")).toBeInTheDocument();
  });
});
