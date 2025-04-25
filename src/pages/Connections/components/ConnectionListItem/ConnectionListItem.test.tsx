import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useUpdateConnectionPreferences from "../../hooks/useUpdateConnectionPreferences";
import ConnectionListItem from "./ConnectionListItem";

// Mock the hooks and components
vi.mock("../../hooks/useUpdateConnectionPreferences", () => ({
  default: vi.fn(),
}));

vi.mock("../ConnectionModals/RemoveConnectionModal", () => ({
  default: vi.fn(({ _id }) => (
    <button data-testid="mock-remove-modal" data-connection-id={_id}>
      Delete
    </button>
  )),
}));

describe("ConnectionListItem", () => {
  const mockVisibleConnection = {
    _id: "conn123",
    name: "John Doe",
    hideEvents: false,
  };

  const mockHiddenConnection = {
    _id: "conn456",
    name: "Jane Smith",
    hideEvents: true,
  };

  const mockUpdateFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementation
    vi.mocked(useUpdateConnectionPreferences).mockReturnValue({
      mutate: mockUpdateFn,
      isPending: false,
    } as unknown as ReturnType<typeof useUpdateConnectionPreferences>);
  });

  it("renders visible connection correctly with eye icon", () => {
    render(<ConnectionListItem connection={mockVisibleConnection} />);

    // Check connection name is displayed
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Check visibility status is shown
    expect(screen.getByText("Visible")).toBeInTheDocument();

    // Check for visible eye icon (not eye-off)
    const eyeIcons = document.querySelectorAll("svg");
    const visibleEyeIcon = Array.from(eyeIcons).find(
      (icon) => !icon.classList.contains("lucide-eye-off")
    );
    expect(visibleEyeIcon).toBeInTheDocument();

    // Check for "Hide events" button
    expect(
      screen.getByRole("button", { name: "Hide events" })
    ).toBeInTheDocument();
  });

  it("renders hidden connection correctly with eye-off icon", () => {
    render(<ConnectionListItem connection={mockHiddenConnection} />);

    // Check connection name is displayed
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    // Check hidden status is shown
    expect(screen.getByText("Hidden")).toBeInTheDocument();

    // Check for eye-off icon
    const eyeIcons = document.querySelectorAll("svg");
    const hiddenEyeIcon = Array.from(eyeIcons).find(
      (icon) => !icon.classList.contains("lucide-eye")
    );
    expect(hiddenEyeIcon).toBeInTheDocument();

    // Check for "Show events" button
    expect(
      screen.getByRole("button", { name: "Show events" })
    ).toBeInTheDocument();
  });

  it("toggles visibility when button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConnectionListItem connection={mockVisibleConnection} />);

    // Find and click the hide events button
    const toggleButton = screen.getByRole("button", { name: "Hide events" });
    await user.click(toggleButton);

    // Verify updateConnectionVisibility was called with the correct arguments
    expect(mockUpdateFn).toHaveBeenCalledWith({
      connectionId: "conn123",
      hideEvents: true,
    });
  });

  it("shows correct button for hidden connection", async () => {
    const user = userEvent.setup();
    render(<ConnectionListItem connection={mockHiddenConnection} />);

    // Find and click the show events button
    const toggleButton = screen.getByRole("button", { name: "Show events" });
    await user.click(toggleButton);

    // Verify updateConnectionVisibility was called with the correct arguments
    expect(mockUpdateFn).toHaveBeenCalledWith({
      connectionId: "conn456",
      hideEvents: false,
    });
  });

  it("renders RemoveConnectionModal with the correct connection ID", () => {
    render(<ConnectionListItem connection={mockVisibleConnection} />);

    // Check that RemoveConnectionModal is rendered with the correct props
    const removeModal = screen.getByTestId("mock-remove-modal");
    expect(removeModal).toBeInTheDocument();
    expect(removeModal).toHaveAttribute("data-connection-id", "conn123");
  });

  it("disables visibility toggle button when update is in progress", () => {
    // Mock pending state
    vi.mocked(useUpdateConnectionPreferences).mockReturnValue({
      mutate: mockUpdateFn,
      isPending: true,
    } as unknown as ReturnType<typeof useUpdateConnectionPreferences>);

    render(<ConnectionListItem connection={mockVisibleConnection} />);

    // Check button is disabled
    const toggleButton = screen.getByRole("button", { name: "Hide events" });
    expect(toggleButton).toBeDisabled();
  });
});
