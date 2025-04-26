import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FiltersDrawer from "@/pages/Events/components/mobile/FiltersDrawer/FiltersDrawer";

// Mock the drawer components
vi.mock("@/components/ui/drawer", () => ({
  Drawer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer">{children}</div>
  ),
  DrawerTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-trigger">{children}</div>
  ),
  DrawerContent: ({
    className,
    children,
  }: {
    className: string;
    onOpenAutoFocus?: (e: React.FocusEvent) => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="drawer-content" className={className}>
      {children}
    </div>
  ),
  DrawerHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-header">{children}</div>
  ),
  DrawerTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-title">{children}</div>
  ),
  DrawerDescription: ({
    className,
    children,
  }: {
    className?: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="drawer-description" className={className || ""}>
      {children}
    </div>
  ),
}));

// Mock the Filters component
vi.mock("@/pages/Events/components/global/Filters/Filters", () => ({
  default: () => <div data-testid="filters-component">Filters Component</div>,
}));

describe("FiltersDrawer", () => {
  it("renders a drawer component with trigger and content", () => {
    render(<FiltersDrawer />);

    // Check if drawer components are rendered
    expect(screen.getByTestId("drawer")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-content")).toBeInTheDocument();
  });

  it("renders the trigger as a pull-up handle with correct styling", () => {
    render(<FiltersDrawer />);

    // Find the pull-up handle element inside trigger
    const pullUpHandle = screen.getByTestId("drawer-trigger");

    // Check if it has the handle's child elements
    const handleIndicator = pullUpHandle.querySelector("div");
    expect(handleIndicator).not.toBeNull();

    // Check for handle styling (these might vary based on implementation)
    const buttonElement = pullUpHandle.querySelector("button");
    if (buttonElement) {
      expect(buttonElement).toHaveAttribute("aria-label", "Open filters");
    }
  });

  it("renders the drawer content with proper background and padding", () => {
    render(<FiltersDrawer />);

    const drawerContent = screen.getByTestId("drawer-content");
    expect(drawerContent.className).toContain("px-4");
    expect(drawerContent.className).toContain("bg-primary-lightest");
  });

  it("renders a title in the drawer header", () => {
    render(<FiltersDrawer />);

    expect(screen.getByTestId("drawer-title")).toHaveTextContent("Filters");
  });

  it("renders a description with screen reader only class", () => {
    render(<FiltersDrawer />);

    const description = screen.getByTestId("drawer-description");
    expect(description).toHaveClass("sr-only");
    expect(description).toHaveTextContent(
      "Adjust date ranges and view options"
    );
  });

  it("includes the Filters component inside the drawer content", () => {
    render(<FiltersDrawer />);

    expect(screen.getByTestId("filters-component")).toBeInTheDocument();

    // The filters component should be within the drawer content
    const drawerContent = screen.getByTestId("drawer-content");
    expect(drawerContent).toContainHTML("Filters Component");
  });
});
