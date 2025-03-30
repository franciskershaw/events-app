import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import UserInitials, { getInitials } from "./UserInitials";

// Mock the Avatar component and its children
vi.mock("@/components/ui/avatar", () => ({
  Avatar: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarFallback: ({
    className,
    children,
  }: {
    className: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
  ),
}));

describe("getInitials function", () => {
  it("returns empty string for empty name", () => {
    expect(getInitials("")).toBe("");
  });

  it("returns first letter of single name", () => {
    expect(getInitials("John")).toBe("J");
  });

  it("returns first letters of two names", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });

  it("returns first letters of first two names when more than two names", () => {
    expect(getInitials("John Middle Doe")).toBe("JM");
  });

  it("handles names with extra spaces", () => {
    expect(getInitials("  John  Doe  ")).toBe("JD");
  });

  it("handles lowercase names and returns uppercase initials", () => {
    expect(getInitials("john doe")).toBe("JD");
  });

  it("skips empty words", () => {
    expect(getInitials(" John  Doe")).toBe("JD");
  });
});

describe("UserInitials Component", () => {
  it("renders with default props", () => {
    render(<UserInitials />);

    const avatar = screen.getByTestId("avatar");
    const fallback = screen.getByTestId("avatar-fallback");

    // Default size should be md
    expect(avatar.className).toContain("h-12 w-12");
    // Default color should be default
    expect(fallback.className).toContain("text-secondary-foreground");
    // Default font size for md
    expect(fallback.className).toContain("text-lg");
    // Empty initials for default empty name
    expect(fallback.textContent).toBe("");
  });

  it("renders with small size", () => {
    render(<UserInitials size="sm" name="John Doe" />);

    const avatar = screen.getByTestId("avatar");
    const fallback = screen.getByTestId("avatar-fallback");

    expect(avatar.className).toContain("h-5 w-5");
    expect(fallback.className).toContain("text-[10px]");
    expect(fallback.textContent).toBe("JD");
  });

  it("renders with large size", () => {
    render(<UserInitials size="lg" name="John Doe" />);

    const avatar = screen.getByTestId("avatar");
    const fallback = screen.getByTestId("avatar-fallback");

    expect(avatar.className).toContain("h-16 w-16");
    expect(fallback.className).toContain("text-xl");
    expect(fallback.textContent).toBe("JD");
  });

  it("renders with extra-large size", () => {
    render(<UserInitials size="xl" name="John Doe" />);

    const avatar = screen.getByTestId("avatar");
    const fallback = screen.getByTestId("avatar-fallback");

    expect(avatar.className).toContain("h-32 w-32");
    expect(fallback.className).toContain("text-4xl");
    expect(fallback.textContent).toBe("JD");
  });

  it("renders with dark color", () => {
    render(<UserInitials colour="dark" name="John Doe" />);

    const fallback = screen.getByTestId("avatar-fallback");

    expect(fallback.className).toContain("bg-primary");
    expect(fallback.className).toContain("text-primary-foreground");
    expect(fallback.className).toContain("border");
    expect(fallback.className).toContain("border-secondary");
    expect(fallback.className).toContain("outline");
    expect(fallback.className).toContain("outline-primary");
  });

  it("renders with combination of size and color props", () => {
    render(<UserInitials size="lg" colour="dark" name="John Doe" />);

    const avatar = screen.getByTestId("avatar");
    const fallback = screen.getByTestId("avatar-fallback");

    expect(avatar.className).toContain("h-16 w-16");
    expect(fallback.className).toContain("text-xl");
    expect(fallback.className).toContain("bg-primary");
    expect(fallback.className).toContain("text-primary-foreground");
    expect(fallback.textContent).toBe("JD");
  });
});
