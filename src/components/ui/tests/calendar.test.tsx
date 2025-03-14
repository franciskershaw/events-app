import { render, screen } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import { Calendar } from "../calendar";

describe("Calendar component", () => {
  // Test 1: Basic rendering
  it("renders calendar with current month and year", () => {
    render(<Calendar />);

    // Check for current month and year
    const currentMonth = dayjs().format("MMMM");
    const currentYear = dayjs().year().toString();

    expect(screen.getByText(currentMonth)).toBeInTheDocument();
    expect(screen.getByText(currentYear)).toBeInTheDocument();
  });

  // Test 2: Custom className is applied
  it("applies custom className", () => {
    const { container } = render(<Calendar className="custom-calendar" />);
    expect(container.firstChild).toHaveClass("custom-calendar");
  });

  // Test 3: Renders weekday headers
  it("renders weekday headers", () => {
    render(<Calendar />);

    // The actual headers are "Su", "Mo", etc.
    expect(screen.getByText("Su")).toBeInTheDocument();
    expect(screen.getByText("Mo")).toBeInTheDocument();
    expect(screen.getByText("Tu")).toBeInTheDocument();
    expect(screen.getByText("We")).toBeInTheDocument();
    expect(screen.getByText("Th")).toBeInTheDocument();
    expect(screen.getByText("Fr")).toBeInTheDocument();
    expect(screen.getByText("Sa")).toBeInTheDocument();
  });

  // Test 4: Renders navigation buttons
  it("renders navigation buttons", () => {
    render(<Calendar />);

    // Find navigation buttons
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(2); // Left arrow and right arrow
  });

  // Test 5: Renders month and year selectors
  it("renders month and year selector buttons", () => {
    render(<Calendar />);

    // Check for combobox roles for the month/year selectors
    const comboboxes = screen.getAllByRole("combobox");
    expect(comboboxes.length).toBe(2); // One for month, one for year
  });

  // Test 6: Test className props for custom styles
  it("has className props for styling with Tailwind", () => {
    const { container } = render(<Calendar />);

    // Check that some tailwind classes are applied to the container
    expect(container.firstChild).toHaveClass("p-3");
  });
});
