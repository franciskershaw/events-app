import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../badge";

describe("Badge component", () => {
  // Test 1: Basic rendering with default variant
  it("renders with default variant", () => {
    render(<Badge>Default Badge</Badge>);

    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-primary");
    expect(badge).toHaveClass("text-primary-foreground");
  });

  // Test 2: Secondary variant
  it("renders with secondary variant", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);

    const badge = screen.getByText("Secondary Badge");
    expect(badge).toHaveClass("bg-secondary");
    expect(badge).toHaveClass("text-secondary-foreground");
  });

  // Test 3: Destructive variant
  it("renders with destructive variant", () => {
    render(<Badge variant="destructive">Warning Badge</Badge>);

    const badge = screen.getByText("Warning Badge");
    expect(badge).toHaveClass("bg-destructive");
    expect(badge).toHaveClass("text-destructive-foreground");
  });

  // Test 4: Outline variant
  it("renders with outline variant", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);

    const badge = screen.getByText("Outline Badge");
    expect(badge).toHaveClass("text-foreground");
    // Should not have bg-* classes
    expect(badge).not.toHaveClass("bg-primary");
    expect(badge).not.toHaveClass("bg-secondary");
    expect(badge).not.toHaveClass("bg-destructive");
  });

  // Test 5: Custom className
  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom Badge</Badge>);

    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("custom-class");
  });

  // Test 6: Additional props
  it("passes additional props to the div element", () => {
    render(
      <Badge data-testid="test-badge" aria-label="badge">
        Props Badge
      </Badge>
    );

    const badge = screen.getByTestId("test-badge");
    expect(badge).toHaveAttribute("aria-label", "badge");
  });

  // Test 7: Real-world usage with icons (as in your project)
  it("renders with icon and text as used in the project", () => {
    render(
      <Badge variant="secondary" className="flex items-center gap-1">
        <span data-testid="icon">🔍</span>
        <span>Category Name</span>
      </Badge>
    );

    const badge = screen.getByText("Category Name").closest("div");
    const icon = screen.getByTestId("icon");

    expect(badge).toHaveClass("bg-secondary");
    expect(icon).toBeInTheDocument();
    expect(badge).toHaveClass("flex");
    expect(badge).toHaveClass("items-center");
    expect(badge).toHaveClass("gap-1");
  });

  // Test 8: Real-world usage with close button (as in Filters)
  it("renders with close button as used in Filters", () => {
    render(
      <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
        Filter Label
        <span className="ml-0.5">✕</span>
      </Badge>
    );

    const badge = screen.getByText("Filter Label").closest("div");
    const closeIcon = screen.getByText("✕");

    expect(badge).toHaveClass("px-2");
    expect(badge).toHaveClass("py-1");
    expect(closeIcon).toBeInTheDocument();
  });
});
