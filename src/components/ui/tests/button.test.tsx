import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button";

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button", { name: /click me/i }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeDisabled();
  });

  it("applies variant classes correctly", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: /delete/i });

    // Check for the destructive class - adjust based on your actual implementation
    expect(button).toHaveClass("bg-destructive");
  });

  it("prevents multiple rapid clicks when throttleClicks is enabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button throttleClicks throttleTime={500} onClick={handleClick}>
        Throttled Button
      </Button>
    );

    const button = screen.getByRole("button", { name: "Throttled Button" });

    // First click should work
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Rapid second click should be ignored
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Rapid third click should be ignored
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Wait for throttle timeout
    await new Promise((resolve) => setTimeout(resolve, 600));

    // After timeout, clicks should work again
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it("allows multiple clicks when throttleClicks is disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={handleClick} throttleClicks={false}>
        Regular Button
      </Button>
    );

    const button = screen.getByRole("button", { name: "Regular Button" });

    // First click
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Second click should also work
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(2);

    // Third click should also work
    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(3);
  });
});
