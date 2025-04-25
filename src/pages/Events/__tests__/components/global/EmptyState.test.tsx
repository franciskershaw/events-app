import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "@/pages/Events/components/global/EmptyState/EmptyState";
import { EmptyStateNoResults } from "@/pages/Events/components/global/EmptyStateNoResults/EmptyStateNoResults";
import { EmptyStateNoSearch } from "@/pages/Events/components/global/EmptyStateNoSearch/EmptyStateNoSearch";

describe("EmptyState Components", () => {
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

  describe("EmptyStateNoResults", () => {
    it("renders the correct heading", () => {
      render(<EmptyStateNoResults />);
      expect(
        screen.getByRole("heading", { name: "No search results?" })
      ).toBeInTheDocument();
    });

    it("renders the correct message", () => {
      render(<EmptyStateNoResults />);
      expect(
        screen.getByText("Try changing your search filters 🔎")
      ).toBeInTheDocument();
    });

    it("renders within the EmptyState component", () => {
      // This test confirms the content is rendered inside the EmptyState structure
      const { container } = render(<EmptyStateNoResults />);

      // The EmptyState component has specific classes we can check
      const emptyStateWrapper = container.firstChild;
      expect(emptyStateWrapper).toHaveClass("absolute");
      expect(emptyStateWrapper).toHaveClass("flex");
      expect(emptyStateWrapper).toHaveClass("items-center");
      expect(emptyStateWrapper).toHaveClass("justify-center");
    });
  });

  describe("EmptyStateNoSearch", () => {
    it("renders the correct heading", () => {
      render(<EmptyStateNoSearch />);
      expect(
        screen.getByRole("heading", { name: "Search events" })
      ).toBeInTheDocument();
    });

    it("renders the correct message", () => {
      render(<EmptyStateNoSearch />);
      expect(
        screen.getByText(
          "Try adding some filters to search through your events 🔎"
        )
      ).toBeInTheDocument();
    });

    it("renders within the EmptyState component", () => {
      const { container } = render(<EmptyStateNoSearch />);

      // The EmptyState component has specific classes we can check
      const emptyStateWrapper = container.firstChild;
      expect(emptyStateWrapper).toHaveClass("absolute");
      expect(emptyStateWrapper).toHaveClass("flex");
      expect(emptyStateWrapper).toHaveClass("items-center");
      expect(emptyStateWrapper).toHaveClass("justify-center");
    });
  });
});
