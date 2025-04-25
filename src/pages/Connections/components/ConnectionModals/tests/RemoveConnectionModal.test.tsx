import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useRemoveConnection from "../../../hooks/useRemoveConnection";
import RemoveConnectionModal from "../RemoveConnectionModal";

// Mock the useRemoveConnection hook
vi.mock("../../../hooks/useRemoveConnection", () => ({
  default: vi.fn(),
}));

describe("RemoveConnectionModal", () => {
  const mockId = "connection123";
  const mockRemoveFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation for useRemoveConnection
    vi.mocked(useRemoveConnection).mockReturnValue({
      mutate: mockRemoveFn,
      isPending: false,
    } as unknown as ReturnType<typeof useRemoveConnection>);
  });

  it("renders a delete button to trigger the modal", () => {
    render(<RemoveConnectionModal _id={mockId} />);

    // Verify the trigger button is rendered with correct text and icon
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("gap-2");

    // Check for the Trash icon
    const trashIcon = button.querySelector("svg");
    expect(trashIcon).toBeInTheDocument();
  });

  it("shows confirmation modal content when button is clicked", async () => {
    const user = userEvent.setup();
    render(<RemoveConnectionModal _id={mockId} />);

    // Open the modal
    const button = screen.getByRole("button", { name: "Delete" });
    await user.click(button);

    // Verify modal content is shown - use getByRole for heading
    expect(
      screen.getByRole("heading", { name: "Remove Connection" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to remove this connection?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("You will no longer see their events.")
    ).toBeInTheDocument();

    // Confirm button should be present
    const confirmButton = screen.getByRole("button", {
      name: "Remove Connection",
    });
    expect(confirmButton).toBeInTheDocument();
  });

  it("calls removeConnection with correct ID when confirm button is clicked", async () => {
    const user = userEvent.setup();
    render(<RemoveConnectionModal _id={mockId} />);

    // Open the modal
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);

    // Click confirm button
    const confirmButton = screen.getByRole("button", {
      name: "Remove Connection",
    });
    await user.click(confirmButton);

    // Verify removeConnection was called with the correct ID
    expect(mockRemoveFn).toHaveBeenCalledWith({ _id: mockId });
  });

  it("shows loading state when removal is in progress", async () => {
    // Mock pending state
    vi.mocked(useRemoveConnection).mockReturnValue({
      mutate: mockRemoveFn,
      isPending: true,
    } as unknown as ReturnType<typeof useRemoveConnection>);

    const user = userEvent.setup();
    render(<RemoveConnectionModal _id={mockId} />);

    // Open the modal
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);

    // Confirm button should show loading state and be disabled
    const confirmButton = screen.getByRole("button", { name: "Removing..." });
    expect(confirmButton).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
  });

  it("applies proper styling to the modal elements", async () => {
    const user = userEvent.setup();
    render(<RemoveConnectionModal _id={mockId} />);

    // Open the modal
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);

    // Verify styling on elements
    const dialogContent = screen.getByRole("dialog");
    expect(dialogContent).toHaveClass("text-center md:text-left");

    // Check for destructive styling - it has bg-destructive class
    const confirmButton = screen.getByRole("button", {
      name: "Remove Connection",
    });
    expect(confirmButton).toHaveClass("bg-destructive");
  });
});
