import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Combobox } from "../combobox";

// Mock the useIsMobile hook
vi.mock("../../../hooks/use-mobile", () => ({
  useIsMobile: () => false, // Default to desktop view for most tests
}));

const mockOptions = [
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
];

describe("Combobox component", () => {
  // Test 1: Basic rendering
  it("renders with the correct placeholder when no value is selected", () => {
    render(
      <Combobox
        value=""
        onChange={() => {}}
        options={mockOptions}
        placeholder="Select something"
      />
    );

    expect(screen.getByText("Select something")).toBeInTheDocument();
  });

  // Test 2: Renders selected value
  it("displays the selected option label when a value is provided", () => {
    render(
      <Combobox value="option2" onChange={() => {}} options={mockOptions} />
    );

    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  // Test 3: Opens dropdown when clicked
  it("opens the dropdown when clicked", async () => {
    const user = userEvent.setup();
    render(<Combobox value="" onChange={() => {}} options={mockOptions} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    // Check that the dropdown content is visible
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });
  });

  // Test 4: Calls onChange when an option is selected
  it("calls onChange with the correct value when an option is selected", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Combobox value="" onChange={handleChange} options={mockOptions} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    // Wait for the dropdown to open
    await waitFor(() => {
      expect(screen.getByText("Option 1")).toBeInTheDocument();
    });

    // Click on an option
    await user.click(screen.getByText("Option 1"));

    // Check that onChange was called with the correct value
    expect(handleChange).toHaveBeenCalledWith("option1");
  });

  // Test 5: Filters options when searching
  it("filters options based on search input", async () => {
    const user = userEvent.setup();

    render(<Combobox value="" onChange={() => {}} options={mockOptions} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    // Wait for the dropdown to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    // Type in the search box
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "Option 1");

    // Check that only matching options are shown
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.queryByText("Option 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
  });

  // Test 6: Handles disabled state
  it("renders as disabled when disabled prop is true", () => {
    render(
      <Combobox
        value=""
        onChange={() => {}}
        options={mockOptions}
        disabled={true}
      />
    );

    const combobox = screen.getByRole("combobox");
    expect(combobox).toHaveAttribute("disabled");
  });

  // Test 7: Tests "add" role functionality
  it("shows add option when role is 'add' and no matches found", async () => {
    const handleAddOption = vi.fn();
    const user = userEvent.setup();

    render(
      <Combobox
        value=""
        onChange={() => {}}
        options={mockOptions}
        role="add"
        onAddOption={handleAddOption}
      />
    );

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    // Wait for the dropdown to open
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    });

    // Type a value that doesn't match any option
    const searchInput = screen.getByPlaceholderText(/search/i);
    await user.type(searchInput, "New Option");

    // Check that the "Add" button appears
    await waitFor(() => {
      expect(screen.getByText(/Add "New Option"/)).toBeInTheDocument();
    });

    // Click the Add button
    await user.click(screen.getByText(/Add "New Option"/));

    // Check that onAddOption was called with the correct value
    expect(handleAddOption).toHaveBeenCalledWith("New Option");
  });
});
