import React from "react";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";

import { Time } from "../time";

// Define types for the mock components
type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: string;
  [key: string]: unknown;
};

type PopoverProps = {
  children: React.ReactNode;
  modal?: boolean;
};

type PopoverTriggerProps = {
  children: React.ReactNode;
  asChild?: boolean;
};

type PopoverContentProps = {
  children: React.ReactNode;
  className?: string;
  align?: string;
};

type ScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
};

// Mock the components used by Time to focus on Time's logic
vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    className,
    disabled,
    onClick,
    variant,
    ...props
  }: ButtonProps) => {
    // Add specific test IDs based on the variant and content to differentiate buttons
    let testId = "time-option-button";

    // If this button appears to be the main trigger button
    if (className?.includes("justify-start") || props.style) {
      testId = "time-trigger-button";
    }

    return (
      <button
        className={className}
        disabled={disabled}
        onClick={onClick}
        data-testid={testId}
        data-variant={variant}
        {...props}
      >
        {children}
      </button>
    );
  },
}));

vi.mock("@/components/ui/popover", () => ({
  Popover: ({ children }: PopoverProps) => (
    <div data-testid="popover">{children}</div>
  ),
  PopoverTrigger: ({ children }: PopoverTriggerProps) => (
    <div data-testid="popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children, className }: PopoverContentProps) => (
    <div data-testid="popover-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("@/components/ui/scroll-area", () => ({
  ScrollArea: ({ children, className }: ScrollAreaProps) => (
    <div data-testid="scroll-area" className={className}>
      {children}
    </div>
  ),
}));

vi.mock("lucide-react", () => ({
  Clock: () => <div data-testid="clock-icon">ClockIcon</div>,
}));

describe("Time component", () => {
  it("renders with default time (00:00) when no value is provided", () => {
    render(<Time />);

    const button = screen.getByTestId("time-trigger-button");
    expect(button).toHaveTextContent("00:00");
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();
  });

  it("renders with the provided string time value", () => {
    render(<Time value="14:30" />);

    const button = screen.getByTestId("time-trigger-button");
    expect(button).toHaveTextContent("14:30");
  });

  it("renders with the provided Date time value", () => {
    // Create a date with a specific time
    const date = dayjs().hour(9).minute(45).toDate();

    render(<Time value={date} />);

    const button = screen.getByTestId("time-trigger-button");
    expect(button).toHaveTextContent("09:45");
  });

  it("applies custom className to the button", () => {
    render(<Time className="custom-class" />);

    const button = screen.getByTestId("time-trigger-button");
    expect(button).toHaveClass("custom-class");
  });

  it("applies custom trigger width", () => {
    render(<Time triggerWidth="200px" />);

    const button = screen.getByTestId("time-trigger-button");
    expect(button).toHaveStyle({ width: "200px" });
  });

  it("disables the button when disabled prop is true", () => {
    render(<Time disabled />);

    const button = screen.getByTestId("time-trigger-button");
    expect(button).toBeDisabled();
  });

  it("renders popover content with hours and minutes", () => {
    render(<Time />);

    // Get the popover content
    const popoverContent = screen.getByTestId("popover-content");

    // Check hours (0-23) and minutes (0-55 in steps of 5)
    const hourButtons = within(popoverContent).getAllByText(
      /^(0[0-9]|1[0-9]|2[0-3])$/
    );
    const minuteButtons = within(popoverContent).getAllByText(
      /^(0[0-9]|[1-5][0-9])$/
    );

    // Should have 24 hour buttons (0-23)
    expect(hourButtons.length).toBeGreaterThanOrEqual(24);

    // Should have 12 minute buttons (0, 5, 10, ..., 55)
    expect(minuteButtons.length).toBeGreaterThanOrEqual(12);
  });

  it("calls onChange when a new hour is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Time value="10:30" onChange={onChange} />);

    // Find and simulate click on hour button (hour 15)
    const popoverContent = screen.getByTestId("popover-content");

    // Get all buttons in the first scroll area (hours)
    const hoursScrollArea =
      within(popoverContent).getAllByTestId("scroll-area")[0];
    const hourButton = within(hoursScrollArea).getByText("15");

    await user.click(hourButton);

    // Should call onChange with the new time (15:30)
    expect(onChange).toHaveBeenCalledWith("15:30");
  });

  it("calls onChange when a new minute is selected", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();

    render(<Time value="10:30" onChange={onChange} />);

    // Find and simulate click on minute button (minute 45)
    const popoverContent = screen.getByTestId("popover-content");

    // Get all buttons in the second scroll area (minutes)
    const minutesScrollArea =
      within(popoverContent).getAllByTestId("scroll-area")[1];
    const minuteButton = within(minutesScrollArea).getByText("45");

    await user.click(minuteButton);

    // Should call onChange with the new time (10:45)
    expect(onChange).toHaveBeenCalledWith("10:45");
  });

  it("calculates time correctly from string values", () => {
    render(<Time value="09:15" />);

    const button = screen.getByTestId("time-trigger-button");
    expect(button).toHaveTextContent("09:15");
  });

  it("handles null/undefined values gracefully", () => {
    render(<Time value={null} />);

    const button = screen.getByTestId("time-trigger-button");
    expect(button).toHaveTextContent("00:00");
  });

  it("applies active styling to the currently selected hour and minute", () => {
    render(<Time value="14:30" />);

    const popoverContent = screen.getByTestId("popover-content");

    // Find button elements for hour 14 and minute 30
    const hourButtons = within(popoverContent).getAllByText("14");
    const minuteButtons = within(popoverContent).getAllByText("30");

    // The first matching element should be our button (there might be multiple elements with the same text)
    expect(hourButtons.length).toBeGreaterThan(0);
    expect(minuteButtons.length).toBeGreaterThan(0);

    // Check if they have the default variant which is applied to selected values
    const hourButton = hourButtons[0];
    const minuteButton = minuteButtons[0];

    expect(hourButton.getAttribute("data-variant")).toBe("default");
    expect(minuteButton.getAttribute("data-variant")).toBe("default");
  });
});
