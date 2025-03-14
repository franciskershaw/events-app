import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar, AvatarFallback } from "../avatar";

describe("Avatar component", () => {
  // Test 1: Basic Avatar rendering
  it("renders Avatar with default styles", () => {
    const { container } = render(<Avatar />);
    const avatarElement = container.firstChild;

    expect(avatarElement).toHaveClass("relative");
    expect(avatarElement).toHaveClass("flex");
    expect(avatarElement).toHaveClass("h-10");
    expect(avatarElement).toHaveClass("w-10");
    expect(avatarElement).toHaveClass("rounded-full");
  });

  // Test 2: Avatar with custom class
  it("applies custom className to Avatar", () => {
    const { container } = render(<Avatar className="custom-size" />);
    const avatarElement = container.firstChild;

    expect(avatarElement).toHaveClass("custom-size");
  });

  // Test 3: AvatarFallback rendering (fixed to include Avatar parent)
  it("renders AvatarFallback with text content", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  // Test 4: AvatarFallback with custom class (fixed to include Avatar parent)
  it("applies custom className to AvatarFallback", () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback">JD</AvatarFallback>
      </Avatar>
    );

    // Find the element with the custom class containing the text
    const fallbackElement = screen.getByText("JD").closest(".custom-fallback");
    expect(fallbackElement).toBeInTheDocument();
    expect(fallbackElement).toHaveClass("custom-fallback");
  });

  // Test 5: Real-world usage pattern (as seen in your actual components)
  it("renders Avatar with AvatarFallback as used in the project", () => {
    render(
      <Avatar className="h-12 w-12">
        <AvatarFallback className="text-lg text-primary">JD</AvatarFallback>
      </Avatar>
    );

    // Check text is rendered
    expect(screen.getByText("JD")).toBeInTheDocument();

    // Check the structure (Avatar contains the text)
    const avatarContainer = screen.getByText("JD").closest(".h-12");
    expect(avatarContainer).toBeInTheDocument();
  });
});
