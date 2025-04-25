import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { EmptyStateNoEvents } from "@/pages/Events/components/desktop/EmptyStateNoEvents/EmptyStateNoEvents";

// Mock the child component
vi.mock(
  "@/pages/Events/components/desktop/AddEventButton/AddEventButton",
  () => ({
    AddEventButton: ({ text }: { text: string }) => <button>{text}</button>,
  })
);

describe("EmptyStateNoEvents", () => {
  it("renders the correct heading", () => {
    render(<EmptyStateNoEvents />);
    expect(
      screen.getByRole("heading", { name: "No events yet?" })
    ).toBeInTheDocument();
  });

  it("renders the list items with correct text", () => {
    render(<EmptyStateNoEvents />);
    // Check for specific text within list items

    // Find the list item containing the button and check its text content
    const listItem = screen.getByText(/Get started by/i).closest("li");
    expect(listItem).toHaveTextContent(/Get started by adding an event ➕/);

    expect(
      screen.getByText(
        /Click on a specific day to see a summary of what's going on on that date.*🗓️/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Hover over today's events to see your action buttons.*👋/
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/And use the filter menu to search your events.*🔎/)
    ).toBeInTheDocument();
  });

  it("renders the AddEventButton with correct text", () => {
    render(<EmptyStateNoEvents />);
    // Check that the mocked button is rendered with the specific text
    expect(
      screen.getByRole("button", { name: "adding an event" })
    ).toBeInTheDocument();
  });
});
