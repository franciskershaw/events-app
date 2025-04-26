import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import EventsNavbarTop from "@/pages/Events/components/mobile/EventsNavbarTop/EventsNavbarTop";

import { useScrollVisibility } from "../../../../../hooks/utility/useScrollVisibility";

// Mock the SearchBar component
vi.mock("@/components/ui/search-bar", () => ({
  SearchBar: ({
    query,
    setQuery,
    clearFilters,
    activeFilterCount,
  }: {
    query: string;
    setQuery: (query: string) => void;
    clearFilters: () => void;
    activeFilterCount: number;
  }) => (
    <div
      data-testid="search-bar"
      data-query={query}
      data-filter-count={activeFilterCount}
      onClick={() => {
        setQuery("new query");
        clearFilters();
      }}
    >
      Search Bar
    </div>
  ),
}));

// Mock the UsersInitials component
vi.mock("../../../../../components/user/UsersInitials/UsersInitials", () => ({
  default: () => <div data-testid="users-initials">User Initials</div>,
}));

// Mock the useScrollVisibility hook
vi.mock("../../../../../hooks/utility/useScrollVisibility", () => ({
  useScrollVisibility: vi.fn(() => ({
    isVisible: true,
    isNearBottom: false,
  })),
}));

// Mock the useSearch context
const mockClearAllFilters = vi.fn();
const mockSetQuery = vi.fn();
vi.mock("../../../../../contexts/SearchEvents/SearchEventsContext", () => ({
  useSearch: vi.fn(() => ({
    activeFilterCount: 2,
    clearAllFilters: mockClearAllFilters,
    query: "test query",
    setQuery: mockSetQuery,
  })),
}));

// Mock the NAV_HEIGHT constant
vi.mock("../../../../../constants/app", () => ({
  NAV_HEIGHT: "60px",
}));

describe("EventsNavbarTop", () => {
  it("renders the UsersInitials component", () => {
    render(<EventsNavbarTop />);

    expect(screen.getByTestId("users-initials")).toBeInTheDocument();
  });

  it("renders the SearchBar component with correct props", () => {
    render(<EventsNavbarTop />);

    const searchBar = screen.getByTestId("search-bar");
    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toHaveAttribute("data-query", "test query");
    expect(searchBar).toHaveAttribute("data-filter-count", "2");
  });

  it("shows navbar when isVisible is true", () => {
    // Mock the useScrollVisibility hook to return visible: true
    vi.mocked(useScrollVisibility).mockReturnValue({
      isVisible: true,
      isNearBottom: false,
    });

    const { container } = render(<EventsNavbarTop />);

    const navElement = container.querySelector("nav");
    expect(navElement).toHaveStyle("transform: translateY(0px)");
  });

  it("hides navbar when isVisible is false", () => {
    // Mock the useScrollVisibility hook to return visible: false
    vi.mocked(useScrollVisibility).mockReturnValue({
      isVisible: false,
      isNearBottom: false,
    });

    const { container } = render(<EventsNavbarTop />);

    const navElement = container.querySelector("nav");
    expect(navElement).toHaveStyle("transform: translateY(-60px)");
  });

  it("has correct navbar styling", () => {
    const { container } = render(<EventsNavbarTop />);

    const navElement = container.querySelector("nav");
    expect(navElement).toHaveClass("fixed");
    expect(navElement).toHaveClass("top-0");
    expect(navElement).toHaveClass("left-0");
    expect(navElement).toHaveClass("right-0");
    expect(navElement).toHaveClass("bg-primary");
    expect(navElement).toHaveClass("z-30");
    expect(navElement).toHaveClass("transition-transform");
    expect(navElement).toHaveClass("duration-300");
  });
});
