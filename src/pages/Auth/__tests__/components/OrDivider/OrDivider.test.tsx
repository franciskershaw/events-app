import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OrDivider from "@/pages/Auth/components/OrDivider/OrDivider";

describe("OrDivider", () => {
  it("renders the divider with 'or' text", () => {
    render(<OrDivider />);

    // Check that the "or" text is rendered
    const orText = screen.getByText(/or/i);
    expect(orText).toBeInTheDocument();

    // Check that the component has the expected structure
    const dividerElement = orText.parentElement;
    expect(dividerElement).toHaveClass("flex items-center");

    // Check that there are two hr elements (the divider lines)
    const hrElements = dividerElement?.querySelectorAll("hr");
    expect(hrElements?.length).toBe(2);
  });
});
