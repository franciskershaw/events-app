import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { useModals } from "@/contexts/Modals/ModalsContext";
import DeleteEventModal from "@/pages/Events/components/global/EventModals/DeleteEventModal";
import useDeleteEvent from "@/pages/Events/hooks/useDeleteEvent";

// Mock the hooks
vi.mock("@/contexts/Modals/ModalsContext");
vi.mock("@/pages/Events/hooks/useDeleteEvent");

describe("DeleteEventModal", () => {
  const mockCloseModal = vi.fn();
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useModals hook
    (useModals as Mock).mockReturnValue({
      selectedEvent: { _id: "event123", title: "Test Event" },
      closeModal: mockCloseModal,
      isDeleteEventModalOpen: true,
    });

    // Mock useDeleteEvent hook
    (useDeleteEvent as Mock).mockReturnValue({
      mutate: mockMutate,
    });
  });

  it("renders correctly when delete event modal is open", () => {
    render(<DeleteEventModal />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Delete event" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to delete 'Test Event'\?/)
    ).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone.")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("doesn't render when delete event modal is closed", () => {
    (useModals as Mock).mockReturnValue({
      selectedEvent: { _id: "event123", title: "Test Event" },
      closeModal: mockCloseModal,
      isDeleteEventModalOpen: false,
    });

    render(<DeleteEventModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls deleteEvent.mutate with correct ID when Delete button is clicked", () => {
    render(<DeleteEventModal />);

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    expect(mockMutate).toHaveBeenCalledWith(
      { _id: "event123" },
      { onSuccess: mockCloseModal }
    );
  });

  it("doesn't call deleteEvent.mutate when event ID is missing", () => {
    (useModals as Mock).mockReturnValue({
      selectedEvent: { title: "Test Event" }, // No _id
      closeModal: mockCloseModal,
      isDeleteEventModalOpen: true,
    });

    render(<DeleteEventModal />);

    const deleteButton = screen.getByRole("button", { name: "Delete" });
    fireEvent.click(deleteButton);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("closes modal when Dialog's onOpenChange is triggered", () => {
    render(<DeleteEventModal />);

    // Get the dialog component and simulate onOpenChange
    const dialog = screen.getByRole("dialog");
    // Trigger the onOpenChange by closing the dialog
    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(mockCloseModal).toHaveBeenCalled();
  });
});
