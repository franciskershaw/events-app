import { createRef } from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "../input";

describe("Input component", () => {
  // Test 1: Basic rendering
  it("renders an input element with default attributes", () => {
    render(<Input placeholder="Test placeholder" data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("placeholder", "Test placeholder");
    expect(input).toHaveAttribute("type", "text"); // Default type
  });

  // Test 2: Passes type attribute correctly
  it("renders with the correct type attribute", () => {
    const { rerender } = render(
      <Input type="password" data-testid="test-input" />
    );

    let input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("type", "password");

    rerender(<Input type="email" data-testid="test-input" />);
    input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("type", "email");
  });

  // Test 3: Handles ref forwarding correctly
  it("forwards ref to the input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(ref.current).toBe(input);
  });

  // Test 4: Merges className prop with default styles
  it("merges provided className with default styles", () => {
    render(<Input className="custom-class" data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toHaveClass("custom-class");
    expect(input).toHaveClass("rounded-md"); // From default styles
  });

  // Test 5: Applies disabled styles correctly
  it("applies correct styles when disabled", () => {
    render(<Input disabled data-testid="test-input" />);

    const input = screen.getByTestId("test-input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:opacity-50");
  });

  // Test 6: Handles user input
  it("handles user input correctly", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Input
        onChange={handleChange}
        data-testid="test-input"
        placeholder="Enter text"
      />
    );

    const input = screen.getByTestId("test-input");
    await user.type(input, "Hello, world!");

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue("Hello, world!");
  });

  // Test 7: Spreads other props to the input element
  it("passes other props to the input element", () => {
    render(
      <Input
        data-testid="test-input"
        name="test-name"
        maxLength={10}
        required
        aria-label="Test input"
      />
    );

    const input = screen.getByTestId("test-input");
    expect(input).toHaveAttribute("name", "test-name");
    expect(input).toHaveAttribute("maxLength", "10");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("aria-label", "Test input");
  });

  // Test 8: Works with form submission
  it("works correctly in a form", async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    const user = userEvent.setup();

    render(
      <form onSubmit={handleSubmit} data-testid="test-form">
        <Input
          data-testid="test-input"
          name="test-input"
          defaultValue="initial value"
        />
        <button type="submit">Submit</button>
      </form>
    );

    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
