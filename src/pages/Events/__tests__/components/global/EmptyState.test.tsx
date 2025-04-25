import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "@/pages/Events/components/global/EmptyState/EmptyState";

describe("EmptyState", () => {
  it("renders the heading correctly", () => {
    const testHeading = "Test Heading";
    render(<EmptyState heading={testHeading}>Child Content</EmptyState>);
    expect(
      screen.getByRole("heading", { name: testHeading })
    ).toBeInTheDocument();
    expect(screen.getByText(testHeading)).toBeInTheDocument(); // Check text content too
  });

  it("renders the children correctly", () => {
    const testChildText = "This is the child content";
    render(
      <EmptyState heading="Heading">
        <p>{testChildText}</p>
      </EmptyState>
    );
    expect(screen.getByText(testChildText)).toBeInTheDocument();
  });

  it("renders a child component correctly", () => {
    const TestChildComponent = () => <div>Test Child Component</div>;
    render(
      <EmptyState heading="Heading">
        <TestChildComponent />
      </EmptyState>
    );
    expect(screen.getByText("Test Child Component")).toBeInTheDocument();
  });

  it("applies basic layout classes", () => {
    const { container } = render(
      <EmptyState heading="Heading">Child</EmptyState>
    );
    // Check for the presence of key layout classes
    expect(container.firstChild).toHaveClass("absolute");
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("items-center");
    expect(container.firstChild).toHaveClass("justify-center");
  });
});
