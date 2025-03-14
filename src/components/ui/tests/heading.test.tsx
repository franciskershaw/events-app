import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Heading from "../heading";

describe("Heading component", () => {
  // Test 1: Renders with the correct tag based on type prop
  it("renders the correct HTML element based on type", () => {
    const { container, rerender } = render(
      <Heading type="h1">Heading 1</Heading>
    );
    expect(container.querySelector("h1")).toBeInTheDocument();

    rerender(<Heading type="h2">Heading 2</Heading>);
    expect(container.querySelector("h2")).toBeInTheDocument();

    rerender(<Heading type="h3">Heading 3</Heading>);
    expect(container.querySelector("h3")).toBeInTheDocument();

    rerender(<Heading type="h4">Heading 4</Heading>);
    expect(container.querySelector("h4")).toBeInTheDocument();
  });

  // Test 2: Default type is h1 when not specified
  it("defaults to h1 when type is not provided", () => {
    const { container } = render(<Heading>Default Heading</Heading>);
    expect(container.querySelector("h1")).toBeInTheDocument();
  });

  // Test 3: Applies the correct font weight class
  it("applies the correct font weight class", () => {
    const { container, rerender } = render(
      <Heading fontWeight="font-bold">Bold Heading</Heading>
    );
    expect(container.firstChild).toHaveClass("font-bold");

    rerender(<Heading fontWeight="font-light">Light Heading</Heading>);
    expect(container.firstChild).toHaveClass("font-light");
  });

  // Test 4: Applies the correct text size class based on type
  it("applies the correct text size class based on type", () => {
    const { container, rerender } = render(
      <Heading type="h1">Large Heading</Heading>
    );
    expect(container.firstChild).toHaveClass("text-2xl");
    expect(container.firstChild).toHaveClass("md:text-3xl");

    rerender(<Heading type="h3">Medium Heading</Heading>);
    expect(container.firstChild).toHaveClass("text-lg");
    expect(container.firstChild).toHaveClass("md:text-xl");
  });

  // Test 5: Applies additional custom classes
  it("applies additional custom classes", () => {
    const { container } = render(
      <Heading className="custom-class text-red-500">Custom Heading</Heading>
    );
    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("text-red-500");
  });

  // Test 6: Renders children correctly
  it("renders the children content", () => {
    render(<Heading>Hello World</Heading>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });
});
