import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyStateNoConnections } from "./EmptyStateNoConnections";

describe("EmptyStateNoConnections", () => {
  it("renders the correct heading and description", () => {
    render(<EmptyStateNoConnections />);

    // Check heading is displayed with correct text
    const heading = screen.getByRole("heading", { name: "No connections yet" });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass("mt-4 text-sm font-semibold");

    // Check description paragraph is displayed with correct text
    const description = screen.getByText(
      "Get started by connecting with friends to see each other's events."
    );
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("mt-2 text-sm");
  });

  it("renders component as a fragment without wrapper element", () => {
    const { container } = render(<EmptyStateNoConnections />);

    // The fragment should not add any direct container element
    // So the first child of the test container should be the h3
    expect(container.firstChild?.nodeName).toBe("H3");

    // The second child should be the paragraph
    expect(container.firstChild?.nextSibling?.nodeName).toBe("P");

    // There should be only two children (h3 and p)
    expect(container.childNodes.length).toBe(2);
  });
});
