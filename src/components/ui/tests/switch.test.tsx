import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "../switch";

// Mock the Radix UI components
vi.mock("@radix-ui/react-switch", () => {
  // Create a simple mock implementation of the Root component
  //   eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Root = React.forwardRef((props: any, ref: any) => {
    const {
      className,
      checked = false,
      onCheckedChange,
      disabled = false,
      children,
      ...rest
    } = props;

    return (
      <button
        ref={ref}
        role="switch"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled || undefined}
        className={className}
        onClick={() => onCheckedChange?.(checked === true ? false : true)}
        disabled={disabled}
        {...rest}
      >
        {/* Always render a thumb component for testing */}
        <span
          data-testid="thumb"
          // Use type assertion to address the 'children.props is of type unknown' error
          className={
            React.isValidElement(children) && children.props
              ? (children.props as { className?: string }).className
              : ""
          }
        />
      </button>
    );
  });

  // Set display name to match the actual component
  Root.displayName = "Root";

  // Simple mock for Thumb component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Thumb = (props: any) => <span {...props} />;

  return {
    Root,
    Thumb,
  };
});

describe("Switch component", () => {
  it("renders in unchecked state by default", () => {
    render(<Switch data-testid="test-switch" />);

    const switchEl = screen.getByTestId("test-switch");
    expect(switchEl).toHaveAttribute("data-state", "unchecked");
    expect(switchEl).toHaveAttribute("aria-checked", "false");
  });

  it("renders in checked state when specified", () => {
    render(<Switch data-testid="test-switch" checked />);

    const switchEl = screen.getByTestId("test-switch");
    expect(switchEl).toHaveAttribute("data-state", "checked");
    expect(switchEl).toHaveAttribute("aria-checked", "true");
  });

  it("applies default classes for styling", () => {
    render(<Switch data-testid="test-switch" />);

    const switchEl = screen.getByTestId("test-switch");
    expect(switchEl).toHaveClass("peer");
    expect(switchEl).toHaveClass("inline-flex");
    expect(switchEl).toHaveClass("rounded-full");

    // Check that thumb also has appropriate classes
    const thumb = screen.getByTestId("thumb");
    expect(thumb).toHaveClass("pointer-events-none");
    expect(thumb).toHaveClass("rounded-full");
  });

  it("merges custom className with default classes", () => {
    render(
      <Switch data-testid="test-switch" className="test-class bg-red-500" />
    );

    const switchEl = screen.getByTestId("test-switch");
    expect(switchEl).toHaveClass("peer"); // Default class
    expect(switchEl).toHaveClass("test-class"); // Custom class
    expect(switchEl).toHaveClass("bg-red-500"); // Custom class
  });

  it("applies disabled styling when disabled", () => {
    render(<Switch data-testid="test-switch" disabled />);

    const switchEl = screen.getByTestId("test-switch");
    expect(switchEl).toBeDisabled();
    expect(switchEl).toHaveAttribute("data-disabled", "true");
  });

  it("calls onCheckedChange when clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Switch data-testid="test-switch" onCheckedChange={handleChange} />);

    const switchEl = screen.getByTestId("test-switch");
    await user.click(switchEl);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true); // Toggled from default false to true
  });

  it("does not call onCheckedChange when disabled", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Switch
        data-testid="test-switch"
        onCheckedChange={handleChange}
        disabled
      />
    );

    const switchEl = screen.getByTestId("test-switch");
    await user.click(switchEl);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("passes additional props to the switch element", () => {
    render(
      <Switch
        data-testid="test-switch"
        aria-label="Toggle feature"
        id="feature-toggle"
      />
    );

    const switchEl = screen.getByTestId("test-switch");
    expect(switchEl).toHaveAttribute("aria-label", "Toggle feature");
    expect(switchEl).toHaveAttribute("id", "feature-toggle");
  });
});
