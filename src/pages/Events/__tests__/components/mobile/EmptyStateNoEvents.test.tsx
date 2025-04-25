import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EmptyStateNoEvents } from "@/pages/Events/components/mobile/EmptyStateNoEvents/EmptyStateNoEvents";

// Mock the global EmptyState component
vi.mock("@/pages/Events/components/global/EmptyState/EmptyState", () => ({
  EmptyState: ({
    heading,
    children,
  }: {
    heading: string;
    children: React.ReactNode;
  }) => (
    <div data-testid="empty-state">
      <h2 data-testid="empty-state-heading">{heading}</h2>
      <div data-testid="empty-state-content">{children}</div>
    </div>
  ),
}));

describe("EmptyStateNoEvents (mobile)", () => {
  it("renders with the correct heading", () => {
    render(<EmptyStateNoEvents />);

    expect(screen.getByTestId("empty-state-heading")).toHaveTextContent(
      "No events yet?"
    );
  });

  it("contains all the instruction list items", () => {
    render(<EmptyStateNoEvents />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(5);

    // Check for specific instructions
    expect(listItems[0]).toHaveTextContent(
      "Get started by adding an event with the bottom right button"
    );
    expect(listItems[1]).toHaveTextContent(
      "Swipe left on the event to see your action buttons"
    );
    expect(listItems[2]).toHaveTextContent(
      "And swipe down to see all the event details"
    );
    expect(listItems[3]).toHaveTextContent(
      "Use the navbar at the top to quickly search your events"
    );
    expect(listItems[4]).toHaveTextContent(
      "Or use the menu at the bottom to apply specific filters"
    );
  });

  it("passes content to the EmptyState component", () => {
    render(<EmptyStateNoEvents />);

    const contentContainer = screen.getByTestId("empty-state-content");
    expect(contentContainer.querySelector("ul")).not.toBeNull();
    expect(contentContainer.querySelectorAll("li")).toHaveLength(5);
  });
});
