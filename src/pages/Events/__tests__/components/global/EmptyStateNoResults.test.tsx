import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyStateNoResults } from "@/pages/Events/components/global/EmptyStateNoResults/EmptyStateNoResults";

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
