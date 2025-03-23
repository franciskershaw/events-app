import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer";

describe("Drawer component", () => {
  // Test 1: Basic rendering and opening with DrawerTrigger
  it("renders and opens when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Test Drawer</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerHeader>
          <p>Drawer content</p>
        </DrawerContent>
      </Drawer>
    );

    // Initially, the drawer content should not be in the document
    expect(screen.queryByText("Test Drawer")).not.toBeInTheDocument();

    // Click the trigger
    const trigger = screen.getByText("Open Drawer");
    await user.click(trigger);

    // Now the drawer content should be visible
    await waitFor(() => {
      expect(screen.getByText("Test Drawer")).toBeInTheDocument();
      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });
  });

  // Test 2: Drawer with orientation bottom (default)
  it("renders with bottom orientation by default", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent data-testid="drawer-content">
          <DrawerHeader>
            <DrawerTitle>Bottom Drawer</DrawerTitle>
            <DrawerDescription>
              Bottom orientation description
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    // Open the drawer
    const trigger = screen.getByText("Open Drawer");
    await user.click(trigger);

    // Check that it has the appropriate classes for bottom orientation
    await waitFor(() => {
      const content = screen.getByTestId("drawer-content");
      expect(content).toHaveClass("inset-x-0");
      expect(content).toHaveClass("bottom-0");
      expect(content).toHaveClass("rounded-t-[10px]");
    });
  });

  // Test 3: Drawer with left orientation
  it("renders with left orientation when specified", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent orientation="left" data-testid="drawer-content">
          <DrawerHeader>
            <DrawerTitle>Left Drawer</DrawerTitle>
            <DrawerDescription>Left orientation description</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    // Open the drawer
    const trigger = screen.getByText("Open Drawer");
    await user.click(trigger);

    // Check that it has the appropriate classes for left orientation
    await waitFor(() => {
      const content = screen.getByTestId("drawer-content");
      expect(content).toHaveClass("inset-y-0");
      expect(content).toHaveClass("left-0");
      expect(content).toHaveClass("rounded-r-[10px]");
    });
  });

  // Test 4: Drawer with header, description and footer
  it("renders with header, description and footer", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Complete Drawer</DrawerTitle>
            <DrawerDescription>This is a drawer description</DrawerDescription>
          </DrawerHeader>
          <p>Main content</p>
          <DrawerFooter>
            <button>Cancel</button>
            <button>Save</button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    // Open the drawer
    const trigger = screen.getByText("Open Drawer");
    await user.click(trigger);

    // Verify all parts render
    await waitFor(() => {
      expect(screen.getByText("Complete Drawer")).toBeInTheDocument();
      expect(
        screen.getByText("This is a drawer description")
      ).toBeInTheDocument();
      expect(screen.getByText("Main content")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });

  // Test 5: Drawer with SwipeableIndicator
  it("renders with SwipeableIndicator for horizontal orientation", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent data-testid="drawer-content">
          <DrawerHeader>
            <DrawerTitle>Drawer with Indicator</DrawerTitle>
            <DrawerDescription>
              Drawer with indicator description
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    // Open the drawer
    const trigger = screen.getByText("Open Drawer");
    await user.click(trigger);

    // Check that the SwipeableIndicator is rendered
    await waitFor(() => {
      const content = screen.getByTestId("drawer-content");
      // Look for div with the indicator's structure instead of role attribute
      const indicator = content.querySelector(".mx-auto.pt-4 div.rounded-full");
      expect(indicator).not.toBeNull();
      expect(indicator).toBeInTheDocument();
    });
  });

  // Test 6: Drawer with custom className
  it("applies custom class names to components", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent
          className="custom-content-class"
          data-testid="drawer-content"
        >
          <DrawerHeader
            className="custom-header-class"
            data-testid="drawer-header"
          >
            <DrawerTitle
              className="custom-title-class"
              data-testid="drawer-title"
            >
              Custom Classes
            </DrawerTitle>
            <DrawerDescription className="custom-desc-class">
              Custom class description
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    // Open the drawer
    const trigger = screen.getByText("Open Drawer");
    await user.click(trigger);

    // Check that custom classes are applied
    await waitFor(() => {
      expect(screen.getByTestId("drawer-content")).toHaveClass(
        "custom-content-class"
      );
      expect(screen.getByTestId("drawer-header")).toHaveClass(
        "custom-header-class"
      );
      expect(screen.getByTestId("drawer-title")).toHaveClass(
        "custom-title-class"
      );
    });
  });

  // Test 7: Drawer without overlay
  it("can render without an overlay when specified", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent overlay={false} data-testid="drawer-content">
          <DrawerHeader>
            <DrawerTitle>Drawer without Overlay</DrawerTitle>
            <DrawerDescription>No overlay description</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    // Open the drawer
    const trigger = screen.getByText("Open Drawer");
    await user.click(trigger);

    // Check that the drawer is visible but no overlay is present
    await waitFor(() => {
      expect(screen.getByText("Drawer without Overlay")).toBeInTheDocument();
      // This is a bit of an implementation detail, but we can check that there's no element with bg-foreground/80 class
      const overlays = document.querySelectorAll(".bg-foreground\\/80");
      expect(overlays.length).toBe(0);
    });
  });
});
