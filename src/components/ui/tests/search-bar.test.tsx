import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { SearchBar } from "../search-bar";

describe("SearchBar component", () => {
  const defaultProps = {
    query: "",
    setQuery: vi.fn(),
    clearFilters: vi.fn(),
    activeFilterCount: 0,
  };

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 1: Basic rendering
  it("renders with default placeholder when no filters are active", () => {
    render(<SearchBar {...defaultProps} />);

    expect(
      screen.getByPlaceholderText(
        "Search by title, venue, city, category or date"
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  // Test 2: Custom placeholder with active filters
  it("shows active filter count in placeholder", () => {
    // With one filter
    const { unmount } = render(
      <SearchBar {...defaultProps} activeFilterCount={1} />
    );
    expect(screen.getByPlaceholderText("1 filter applied")).toBeInTheDocument();

    // Cleanup and rerender with multiple filters
    unmount();
    render(<SearchBar {...defaultProps} activeFilterCount={3} />);
    expect(
      screen.getByPlaceholderText("3 filters applied")
    ).toBeInTheDocument();
  });

  // Test 3: Clear button visibility
  it("shows clear button when query or filters exist", () => {
    // No query or filters - no clear button
    const { rerender } = render(<SearchBar {...defaultProps} />);
    expect(screen.queryByRole("button", { name: "✕" })).not.toBeInTheDocument();

    // With query - shows clear button
    rerender(<SearchBar {...defaultProps} query="test" />);
    expect(screen.getByRole("button", { name: "✕" })).toBeInTheDocument();

    // With filters - shows clear button
    rerender(<SearchBar {...defaultProps} activeFilterCount={2} />);
    expect(screen.getByRole("button", { name: "✕" })).toBeInTheDocument();
  });

  // Test 4: Input handling
  it("calls setQuery when typing in the input field", async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    // When using userEvent.type, it calls setQuery for each character
    // Check if setQuery was called 4 times (once for each character)
    expect(defaultProps.setQuery).toHaveBeenCalledTimes(4);
    // Check that individual characters are passed to setQuery
    expect(defaultProps.setQuery).toHaveBeenNthCalledWith(1, "t");
    expect(defaultProps.setQuery).toHaveBeenNthCalledWith(2, "e");
    expect(defaultProps.setQuery).toHaveBeenNthCalledWith(3, "s");
    expect(defaultProps.setQuery).toHaveBeenNthCalledWith(4, "t");
  });

  // Test 5: Dropdown display
  it("shows dropdown with filtered options matching the query", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchBar {...defaultProps} />);

    // Type "this" to filter options
    const input = screen.getByRole("textbox");
    await user.type(input, "this");

    // Update query prop to simulate state update
    rerender(<SearchBar {...defaultProps} query="this" />);

    // Check if dropdown is shown with filtered options
    const dropdown = screen.getByText("This week");
    expect(dropdown).toBeInTheDocument();

    expect(screen.getByText("This month")).toBeInTheDocument();
    expect(screen.getByText("This year")).toBeInTheDocument();

    // Options not matching "this" should not be shown
    expect(screen.queryByText("Today")).not.toBeInTheDocument();
    expect(screen.queryByText("Tomorrow")).not.toBeInTheDocument();
  });

  // Test 6: Option selection
  it("selects an option and updates query when clicked", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<SearchBar {...defaultProps} />);

    // Type "this" to filter options
    const input = screen.getByRole("textbox");
    await user.type(input, "this");

    // Update query prop to simulate state update
    rerender(<SearchBar {...defaultProps} query="this" />);

    // Click on "This week" option
    await user.click(screen.getByText("This week"));

    // Check if setQuery was called with the selected option value
    expect(defaultProps.setQuery).toHaveBeenCalledWith("This week");
  });

  // Test 7: Clear button functionality with query only
  it("clears query when clear button is clicked (no filters)", async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} query="test" />);

    // Click clear button
    await user.click(screen.getByRole("button", { name: "✕" }));

    // Check if setQuery was called with empty string
    expect(defaultProps.setQuery).toHaveBeenCalledWith("");
  });

  // Test 8: Clear button functionality with active filters
  it("calls clearFilters when clear button is clicked and filters are active", async () => {
    const user = userEvent.setup();
    render(<SearchBar {...defaultProps} activeFilterCount={2} />);

    // Click clear button
    await user.click(screen.getByRole("button", { name: "✕" }));

    // Check if clearFilters was called
    expect(defaultProps.clearFilters).toHaveBeenCalled();
    expect(defaultProps.setQuery).not.toHaveBeenCalled();
  });

  // Test 9: Click outside behavior
  it("closes dropdown when clicking outside", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <div>
        <div data-testid="outside-element">Outside</div>
        <SearchBar {...defaultProps} query="this" />
      </div>
    );

    // Focus the input to show dropdown
    const input = screen.getByRole("textbox");
    await user.click(input);

    // Update query prop to simulate state update
    rerender(
      <div>
        <div data-testid="outside-element">Outside</div>
        <SearchBar {...defaultProps} query="this" />
      </div>
    );

    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.queryByText("This week")).toBeInTheDocument();
    });

    // Click outside the search bar
    await user.click(screen.getByTestId("outside-element"));

    // Wait for dropdown to disappear
    await waitFor(() => {
      expect(screen.queryByText("This week")).not.toBeInTheDocument();
    });
  });

  // Test 10: Focus behavior
  it("opens dropdown on focus if options exist", async () => {
    const user = userEvent.setup();
    // Start with a query that has matching options
    render(<SearchBar {...defaultProps} query="this" />);

    // Focus the input
    const input = screen.getByRole("textbox");
    await user.click(input);

    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByText("This week")).toBeInTheDocument();
    });
  });
});
