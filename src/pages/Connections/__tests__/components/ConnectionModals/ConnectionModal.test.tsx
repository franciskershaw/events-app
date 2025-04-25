import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import ConnectionFormContent from "@/pages/Connections/components/ConnectionForm/ConnectionFormContent";
import ConnectionModal from "@/pages/Connections/components/ConnectionModals/ConnectionModal";

// Mock the ConnectionFormContent component
vi.mock(
  "@/pages/Connections/components/ConnectionForm/ConnectionFormContent",
  () => ({
    default: vi.fn(() => <div data-testid="mocked-form-content" />),
  })
);

describe("ConnectionModal", () => {
  it("renders a button to trigger the modal", () => {
    render(<ConnectionModal />);

    // Verify the trigger button is rendered with correct text
    const button = screen.getByRole("button", {
      name: "Connect with a friend",
    });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("w-full mt-4");
  });

  it("shows modal content when button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConnectionModal />);

    // Find and click the trigger button
    const button = screen.getByRole("button", {
      name: "Connect with a friend",
    });
    await user.click(button);

    // Verify modal content is shown
    expect(screen.getByText("Connect with Friends")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Share your events with friends by either generating a code or entering theirs"
      )
    ).toBeInTheDocument();
  });

  it("renders ConnectionFormContent with the correct props when modal is open", async () => {
    const user = userEvent.setup();
    render(<ConnectionModal />);

    // Open the modal
    const button = screen.getByRole("button", {
      name: "Connect with a friend",
    });
    await user.click(button);

    // Verify the content component is rendered
    expect(screen.getByTestId("mocked-form-content")).toBeInTheDocument();

    // Check that ConnectionFormContent was called with the correct props
    expect(ConnectionFormContent).toHaveBeenCalledWith(
      { inputId: "modal-connection-id" },
      expect.anything()
    );
  });

  it("applies proper styling to the dialog content", async () => {
    const user = userEvent.setup();
    render(<ConnectionModal />);

    // Open the modal
    const button = screen.getByRole("button", {
      name: "Connect with a friend",
    });
    await user.click(button);

    // Verify dialog content has correct class
    const dialogContent = screen.getByRole("dialog");
    expect(dialogContent).toHaveClass("sm:max-w-md");
  });
});
