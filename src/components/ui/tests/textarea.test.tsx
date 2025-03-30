import React from "react";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "../textarea";

describe("Textarea component", () => {
  it("renders properly", () => {
    render(<Textarea data-testid="test-textarea" />);

    expect(screen.getByTestId("test-textarea")).toBeInTheDocument();
    expect(screen.getByTestId("test-textarea").tagName).toBe("TEXTAREA");
  });

  it("applies default styling classes", () => {
    render(<Textarea data-testid="test-textarea" />);

    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveClass("flex");
    expect(textarea).toHaveClass("min-h-[60px]");
    expect(textarea).toHaveClass("w-full");
    expect(textarea).toHaveClass("rounded-md");
    expect(textarea).toHaveClass("border");
    expect(textarea).toHaveClass("bg-input");
  });

  it("merges custom className with default classes", () => {
    render(
      <Textarea
        data-testid="test-textarea"
        className="custom-class bg-red-500"
      />
    );

    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveClass("flex"); // Default class
    expect(textarea).toHaveClass("custom-class"); // Custom class
    expect(textarea).toHaveClass("bg-red-500"); // Custom class
  });

  it("forwards additional props to the textarea element", () => {
    render(
      <Textarea
        data-testid="test-textarea"
        placeholder="Enter text here"
        rows={5}
        maxLength={100}
        disabled
      />
    );

    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toHaveAttribute("placeholder", "Enter text here");
    expect(textarea).toHaveAttribute("rows", "5");
    expect(textarea).toHaveAttribute("maxLength", "100");
    expect(textarea).toBeDisabled();
  });

  it("forwards ref to the textarea element", () => {
    const ref = React.createRef<HTMLTextAreaElement>();

    render(<Textarea data-testid="test-textarea" ref={ref} />);

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });

  it("handles user input correctly", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Textarea data-testid="test-textarea" onChange={onChange} />);

    const textarea = screen.getByTestId("test-textarea");
    await user.type(textarea, "Hello world");

    expect(onChange).toHaveBeenCalled();
    expect(textarea).toHaveValue("Hello world");
  });

  it("applies disabled styling when disabled", () => {
    render(<Textarea data-testid="test-textarea" disabled />);

    const textarea = screen.getByTestId("test-textarea");
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("disabled:cursor-not-allowed");
    expect(textarea).toHaveClass("disabled:opacity-50");
  });
});
