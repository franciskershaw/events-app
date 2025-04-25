import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ActiveDayProvider } from "../../../../../contexts/ActiveDay/ActiveDayContext";
import { useModals } from "../../../../../contexts/Modals/ModalsContext";
import { AddEventButton } from "../../../components/desktop/AddEventButton/AddEventButton";

// Mock the module path
vi.mock(
  "../../../../../contexts/Modals/ModalsContext",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("../../../../../contexts/Modals/ModalsContext")
      >();
    return {
      ...actual, // Keep other exports like ModalsProvider
      useModals: vi.fn(), // Mock the useModals hook
    };
  }
);

vi.mock("../../../../../contexts/ActiveDay/ActiveDayContext", () => ({
  useActiveDay: () => ({
    activeDay: null,
  }),
  ActiveDayProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Cast useModals to the mocked version for type safety
const mockedUseModals = vi.mocked(useModals);

describe("AddEventButton", () => {
  // Set a default mock implementation before each test
  beforeEach(() => {
    mockedUseModals.mockReturnValue({
      openEventModal: vi.fn(),
      openDeleteEventModal: vi.fn(),
      openConnectionsModal: vi.fn(),
      closeModal: vi.fn(),
      resetSelectedData: vi.fn(),
      isEventModalOpen: false,
      isDeleteEventModalOpen: false,
      isConnectionsModalOpen: false,
      selectedEvent: null,
      mode: null,
    });
  });

  it("renders with default text", () => {
    render(
      <ActiveDayProvider>
        <AddEventButton />
      </ActiveDayProvider>
    );

    const button = screen.getByRole("button", { name: "Add event +" });
    expect(button).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(
      <ActiveDayProvider>
        <AddEventButton text="Custom Button Text" />
      </ActiveDayProvider>
    );

    const button = screen.getByRole("button", { name: "Custom Button Text" });
    expect(button).toBeInTheDocument();
  });

  it("calls openEventModal when clicked", () => {
    const openEventModalMock = vi.fn();

    // Override the mock implementation specifically for this test
    mockedUseModals.mockReturnValue({
      openEventModal: openEventModalMock,
      openDeleteEventModal: vi.fn(),
      openConnectionsModal: vi.fn(),
      closeModal: vi.fn(),
      resetSelectedData: vi.fn(),
      isEventModalOpen: false,
      isDeleteEventModalOpen: false,
      isConnectionsModalOpen: false,
      selectedEvent: null,
      mode: null,
    });

    render(
      <ActiveDayProvider>
        <AddEventButton />
      </ActiveDayProvider>
    );

    const button = screen.getByRole("button", { name: "Add event +" });
    fireEvent.click(button);

    expect(openEventModalMock).toHaveBeenCalledTimes(1);
    expect(openEventModalMock).toHaveBeenCalledWith(
      expect.objectContaining({
        _id: "",
        title: "",
        date: expect.objectContaining({
          start: expect.any(String), // Active day is null, so start date will be ""
          end: "",
        }),
      }),
      "addFromFreeEvent"
    );
  });
});
