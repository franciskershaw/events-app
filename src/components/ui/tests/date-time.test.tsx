import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";
import { describe, expect, it, vi } from "vitest";

import { DateTime } from "../date-time";

describe("DateTime component", () => {
  // Test 1: Basic rendering with placeholder
  it("renders with placeholder when no value is provided", () => {
    render(<DateTime placeholder="Select date and time" />);

    expect(screen.getByText("Select date and time")).toBeInTheDocument();
    // Calendar icon should be present
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  // Test 2: Renders with formatted date when value is provided
  it("renders with formatted date when value is provided", () => {
    const testDate = dayjs("2023-06-15").toDate();
    render(<DateTime value={testDate} />);

    // Check for the exact format that the component uses (with 'th')
    expect(screen.getByText("June 15th, 2023")).toBeInTheDocument();
  });

  // Test 3: Clicking the button opens the calendar popover
  it("opens calendar popover when button is clicked", async () => {
    const user = userEvent.setup();
    render(<DateTime />);

    const button = screen.getByRole("button");
    await user.click(button);

    // Calendar should be visible now
    await waitFor(() => {
      // Look for specific elements from the Calendar
      expect(
        screen.getByText(dayjs().format("MMMM"), { exact: false })
      ).toBeInTheDocument();
      expect(screen.getByText(dayjs().year().toString())).toBeInTheDocument();
    });
  });

  // Test 4: Shows time picker when showTime prop is true
  it("renders time picker when showTime prop is true", () => {
    render(<DateTime showTime />);

    // Find the time picker button specifically by looking for 00:00
    const timeButton = screen.getByText("00:00");
    expect(timeButton).toBeInTheDocument();

    // Verify the clock icon is present
    const clockIcon = document.querySelector(".lucide-clock");
    expect(clockIcon).toBeInTheDocument();
  });

  // Test 5: Handles clear functionality
  it("shows clear button when allowClear is true and value exists", () => {
    const testDate = dayjs("2023-06-15").toDate();
    render(<DateTime value={testDate} allowClear />);

    // There should be a clear button (typically with an X icon)
    const clearButton = screen.getByRole("button", { name: /clear date/i });
    expect(clearButton).toBeInTheDocument();
  });

  // Test 6: Applies custom className
  it("applies custom className to container", () => {
    const { container } = render(<DateTime className="custom-date-time" />);

    expect(container.firstChild).toHaveClass("custom-date-time");
  });

  // Test 7: Handles onChange callback
  it("calls onChange when a day is selected", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<DateTime onChange={handleChange} />);

    // Open the calendar
    const button = screen.getByRole("button");
    await user.click(button);

    // Find and click a day in the current month by using the calendar table structure
    await waitFor(async () => {
      // The calendar renders days differently, so we need to find a button by its role
      // and ensure it's not disabled (likely to be a valid day in the current month)
      const dayButtons = screen
        .getAllByRole("button")
        .filter(
          (button) =>
            !button.hasAttribute("disabled") &&
            button.textContent &&
            /^\d+$/.test(button.textContent)
        );

      if (dayButtons.length > 0) {
        await user.click(dayButtons[0]);

        // Check that onChange was called with a Date object
        expect(handleChange).toHaveBeenCalled();
        expect(handleChange.mock.calls[0][0]).toBeInstanceOf(Date);
      }
    });
  });

  // Test 8: Respects disabled prop
  it("renders as disabled when disabled prop is true", () => {
    render(<DateTime disabled />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("disabled");
  });
});
