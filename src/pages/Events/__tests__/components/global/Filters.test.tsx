import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { useSearch } from "@/contexts/SearchEvents/SearchEventsContext";
import Filters from "@/pages/Events/components/global/Filters/Filters";
import useFilters from "@/pages/Events/components/global/Filters/useFilters";

// Mock the dependencies
vi.mock("@/contexts/SearchEvents/SearchEventsContext");
vi.mock("@/pages/Events/components/global/Filters/useFilters");
vi.mock("@/components/ui/combobox", () => ({
  Combobox: ({
    placeholder,
    onChange,
  }: {
    placeholder: string;
    onChange?: (value: string) => void;
  }) => (
    <div data-testid={`combobox-${placeholder.toLowerCase()}`}>
      <button onClick={() => onChange && onChange("selected value")}>
        Select {placeholder}
      </button>
    </div>
  ),
}));
vi.mock("@/components/ui/date-time", () => ({
  DateTime: ({
    placeholder,
    onChange,
  }: {
    placeholder: string;
    onChange?: (date: Date) => void;
  }) => (
    <div
      data-testid={`datetime-${placeholder.toLowerCase().replace(/\s/g, "-")}`}
    >
      <button onClick={() => onChange && onChange(new Date("2023-05-15"))}>
        Select {placeholder}
      </button>
    </div>
  ),
}));
vi.mock("@/components/utility/LongPress/LongPress", () => ({
  default: ({
    children,
    onClick,
    onLongPress,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    onLongPress?: () => void;
  }) => (
    <div data-testid="long-press" onClick={onClick} onContextMenu={onLongPress}>
      {children}
    </div>
  ),
}));

describe("Filters", () => {
  // Default mock values
  const mockRemoveFilter = vi.fn();
  const mockHandleStartDateChange = vi.fn();
  const mockHandleEndDateChange = vi.fn();
  const mockHandleCopyEventClick = vi.fn();
  const mockSetShowEventsFree = vi.fn();
  const mockSetSelectedCategory = vi.fn();
  const mockSetSelectedLocation = vi.fn();
  const mockClearAllFilters = vi.fn();
  const mockSetStartDate = vi.fn();
  const mockSetEndDate = vi.fn();
  const mockSetOffset = vi.fn();
  const mockSetActiveButton = vi.fn();

  const mockDateButtons = [
    {
      label: "D",
      getDates: () => ({ startDate: new Date(), endDate: new Date() }),
    },
    {
      label: "W",
      getDates: () => ({ startDate: new Date(), endDate: new Date() }),
    },
    {
      label: "M",
      getDates: () => ({ startDate: new Date(), endDate: new Date() }),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup useFilters mock
    (useFilters as Mock).mockReturnValue({
      appliedFilters: [],
      removeFilter: mockRemoveFilter,
      handleStartDateChange: mockHandleStartDateChange,
      handleEndDateChange: mockHandleEndDateChange,
      dateButtons: mockDateButtons,
      buttonText: "Copy event text",
      buttonStatus: "outline",
      handleCopyEventClick: mockHandleCopyEventClick,
      getIcon: () => <span data-testid="button-icon" />,
    });

    // Setup useSearch mock
    (useSearch as Mock).mockReturnValue({
      filteredEvents: [],
      showEventsFree: false,
      setShowEventsFree: mockSetShowEventsFree,
      locations: ["London", "New York"],
      categories: ["Conference", "Workshop"],
      selectedCategory: "",
      setSelectedCategory: mockSetSelectedCategory,
      selectedLocation: "",
      setSelectedLocation: mockSetSelectedLocation,
      startDate: null,
      endDate: null,
      setStartDate: mockSetStartDate,
      setEndDate: mockSetEndDate,
      offset: 0,
      setOffset: mockSetOffset,
      activeButton: null,
      setActiveButton: mockSetActiveButton,
      clearAllFilters: mockClearAllFilters,
    });
  });

  it("should render without applied filters", () => {
    render(<Filters />);

    // Check comboboxes are rendered
    expect(screen.getByTestId("combobox-categories")).toBeInTheDocument();
    expect(screen.getByTestId("combobox-locations")).toBeInTheDocument();

    // Check date pickers are rendered
    expect(screen.getByTestId("datetime-start-date")).toBeInTheDocument();
    expect(screen.getByTestId("datetime-end-date")).toBeInTheDocument();

    // Check date shortcut buttons
    expect(screen.getAllByText(/[DWM]/)).toHaveLength(3);

    // Check show free days and copy event buttons
    expect(screen.getByText(/Show free days/)).toBeInTheDocument();
    expect(screen.getByText("Copy event text")).toBeInTheDocument();

    // No applied filters should be shown
    expect(screen.queryByText("Clear filters ✕")).not.toBeInTheDocument();
  });

  it("should render and handle applied filters", () => {
    // Mock applied filters
    (useFilters as Mock).mockReturnValue({
      appliedFilters: [
        { label: "Category: Conference", type: "category" },
        { label: "Location: New York", type: "location" },
      ],
      removeFilter: mockRemoveFilter,
      handleStartDateChange: mockHandleStartDateChange,
      handleEndDateChange: mockHandleEndDateChange,
      dateButtons: mockDateButtons,
      buttonText: "Copy event text",
      buttonStatus: "outline",
      handleCopyEventClick: mockHandleCopyEventClick,
      getIcon: () => <span data-testid="button-icon" />,
    });

    // Mock filtered events with appropriate shape
    (useSearch as Mock).mockReturnValue({
      filteredEvents: [
        { id: 1, category: { name: "Conference" } },
        { id: 2, category: { name: "Conference" } },
      ],
      showEventsFree: false,
      setShowEventsFree: mockSetShowEventsFree,
      locations: ["London", "New York"],
      categories: ["Conference", "Workshop"],
      selectedCategory: "Conference",
      setSelectedCategory: mockSetSelectedCategory,
      selectedLocation: "New York",
      setSelectedLocation: mockSetSelectedLocation,
      startDate: null,
      endDate: null,
      setStartDate: mockSetStartDate,
      setEndDate: mockSetEndDate,
      offset: 0,
      setOffset: mockSetOffset,
      activeButton: null,
      setActiveButton: mockSetActiveButton,
      clearAllFilters: mockClearAllFilters,
    });

    render(<Filters />);

    // Check if applied filters are displayed
    expect(screen.getByText("Category: Conference")).toBeInTheDocument();
    expect(screen.getByText("Location: New York")).toBeInTheDocument();

    // Check if results count is shown
    expect(screen.getByText("Showing 2 results.")).toBeInTheDocument();
    expect(screen.getByText("Clear filters ✕")).toBeInTheDocument();

    // Click one filter to remove it
    fireEvent.click(screen.getByText("Category: Conference"));
    expect(mockRemoveFilter).toHaveBeenCalledWith("category");

    // Click clear all filters
    fireEvent.click(screen.getByText("Clear filters ✕"));
    expect(mockClearAllFilters).toHaveBeenCalled();
  });

  it("should handle date selection", () => {
    render(<Filters />);

    // Click on start date picker
    fireEvent.click(screen.getByText("Select Start date"));
    expect(mockHandleStartDateChange).toHaveBeenCalledWith(
      new Date("2023-05-15")
    );

    // Click on end date picker
    fireEvent.click(screen.getByText("Select End date"));
    expect(mockHandleEndDateChange).toHaveBeenCalledWith(
      new Date("2023-05-15")
    );
  });

  it("should handle date shortcut buttons", () => {
    render(<Filters />);

    // Get all date buttons (D, W, M)
    const dateButtons = screen.getAllByText(/[DWM]/);

    // Click on first button (D)
    fireEvent.click(dateButtons[0]);
    // Pass a callback function matcher instead of exact value
    expect(mockSetOffset).toHaveBeenCalled();
    expect(mockSetActiveButton).toHaveBeenCalledWith("D");

    // Context menu (long press) should clear dates
    fireEvent.contextMenu(screen.getAllByTestId("long-press")[0]);
    expect(mockSetStartDate).toHaveBeenCalledWith(null);
    expect(mockSetEndDate).toHaveBeenCalledWith(null);
    expect(mockSetOffset).toHaveBeenCalledWith(0);
    expect(mockSetActiveButton).toHaveBeenCalledWith(null);
  });

  it("should toggle show free days button", () => {
    render(<Filters />);

    // Click on show free days button
    fireEvent.click(screen.getByText(/Show free days/));
    expect(mockSetShowEventsFree).toHaveBeenCalledWith(true);

    // Update the mock to return showEventsFree as true
    (useSearch as Mock).mockReturnValue({
      filteredEvents: [],
      showEventsFree: true,
      setShowEventsFree: mockSetShowEventsFree,
      locations: ["London", "New York"],
      categories: ["Conference", "Workshop"],
      selectedCategory: "",
      setSelectedCategory: mockSetSelectedCategory,
      selectedLocation: "",
      setSelectedLocation: mockSetSelectedLocation,
      startDate: null,
      endDate: null,
      setStartDate: mockSetStartDate,
      setEndDate: mockSetEndDate,
      offset: 0,
      setOffset: mockSetOffset,
      activeButton: null,
      setActiveButton: mockSetActiveButton,
      clearAllFilters: mockClearAllFilters,
    });

    render(<Filters />);

    // Now the button text should be "Hide free days"
    expect(screen.getByText(/Hide free days/)).toBeInTheDocument();
  });

  it("should handle copy event button click", () => {
    render(<Filters />);

    // Click on copy event text button
    fireEvent.click(screen.getByText("Copy event text"));
    expect(mockHandleCopyEventClick).toHaveBeenCalled();
  });

  it("should show correct counts when displaying free events", () => {
    // Mock with specific event counts
    const mockEvents = [
      { id: 1, category: { name: "Conference" } },
      { id: 2, category: { name: "Conference" } },
      { id: 3, category: { name: "Free" } },
    ];

    (useSearch as Mock).mockReturnValue({
      filteredEvents: mockEvents,
      showEventsFree: true,
      setShowEventsFree: mockSetShowEventsFree,
      locations: ["London", "New York"],
      categories: ["Conference", "Workshop", "Free"],
      selectedCategory: "",
      setSelectedCategory: mockSetSelectedCategory,
      selectedLocation: "",
      setSelectedLocation: mockSetSelectedLocation,
      startDate: null,
      endDate: null,
      setStartDate: mockSetStartDate,
      setEndDate: mockSetEndDate,
      offset: 0,
      setOffset: mockSetOffset,
      activeButton: null,
      setActiveButton: mockSetActiveButton,
      clearAllFilters: mockClearAllFilters,
    });

    (useFilters as Mock).mockReturnValue({
      appliedFilters: [{ label: "Showing free days", type: "eventsFree" }],
      removeFilter: mockRemoveFilter,
      handleStartDateChange: mockHandleStartDateChange,
      handleEndDateChange: mockHandleEndDateChange,
      dateButtons: mockDateButtons,
      buttonText: "Copy event text",
      buttonStatus: "outline",
      handleCopyEventClick: mockHandleCopyEventClick,
      getIcon: () => <span data-testid="button-icon" />,
    });

    render(<Filters />);

    // It should show "Showing 1 free day"
    expect(screen.getByText("Showing 1 free day.")).toBeInTheDocument();
  });
});
