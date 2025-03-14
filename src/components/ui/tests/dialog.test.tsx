import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

describe("Dialog component", () => {
  // Test 1: Basic rendering and opening with DialogTrigger
  it("renders and opens when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogDescription className="sr-only">
              Test description
            </DialogDescription>
            <DialogTitle>Test Dialog</DialogTitle>
          </DialogHeader>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    );

    // Initially, the dialog content should not be in the document
    expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();

    // Click the trigger
    const trigger = screen.getByText("Open Dialog");
    await user.click(trigger);

    // Now the dialog content should be visible
    await waitFor(() => {
      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });
  });

  // Test 2: Closing dialog with the close button
  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogDescription className="sr-only">
            Test description
          </DialogDescription>
          <DialogTitle>Test Dialog</DialogTitle>
          <p>Dialog content</p>
        </DialogContent>
      </Dialog>
    );

    // Open the dialog
    const trigger = screen.getByText("Open Dialog");
    await user.click(trigger);

    // Ensure dialog is open
    await waitFor(() => {
      expect(screen.getByText("Test Dialog")).toBeInTheDocument();
    });

    // Find and click the close button (it has a "Close" accessible name)
    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);

    // Dialog should no longer be visible
    await waitFor(() => {
      expect(screen.queryByText("Test Dialog")).not.toBeInTheDocument();
    });
  });

  // Test 3: Dialog with controlled state
  it("can be controlled via open prop", async () => {
    const { rerender } = render(
      <Dialog open={true}>
        <DialogContent>
          <DialogDescription className="sr-only">
            Test description
          </DialogDescription>
          <DialogTitle>Controlled Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    // Dialog should be visible
    expect(screen.getByText("Controlled Dialog")).toBeInTheDocument();

    // Update the open prop to false
    rerender(
      <Dialog open={false}>
        <DialogContent>
          <DialogTitle>Controlled Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    // Dialog should not be visible
    await waitFor(() => {
      expect(screen.queryByText("Controlled Dialog")).not.toBeInTheDocument();
    });
  });

  // Test 4: Dialog with footer
  it("renders with footer content", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog with Footer</DialogTitle>
            <DialogDescription>This dialog has a footer</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button>Cancel</button>
            <button>Submit</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    // Open the dialog
    const trigger = screen.getByText("Open Dialog");
    await user.click(trigger);

    // Check that the footer buttons are visible
    await waitFor(() => {
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Submit")).toBeInTheDocument();
      expect(screen.getByText("This dialog has a footer")).toBeInTheDocument();
    });
  });

  // Test 5: Dialog with custom class names
  it("applies custom class names", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent className="custom-content-class">
          <DialogHeader className="custom-header-class">
            <DialogDescription className="sr-only">
              Test description
            </DialogDescription>
            <DialogTitle className="custom-title-class">
              Custom Classes
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    // Open the dialog
    const trigger = screen.getByText("Open Dialog");
    await user.click(trigger);

    // Check that custom classes are applied
    await waitFor(() => {
      const content = screen.getByRole("dialog");
      expect(content).toHaveClass("custom-content-class");

      const title = screen.getByText("Custom Classes");
      expect(title).toHaveClass("custom-title-class");

      const header = title.parentElement;
      expect(header).toHaveClass("custom-header-class");
    });
  });
});
