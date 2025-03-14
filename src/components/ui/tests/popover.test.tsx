import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../popover";

describe("Popover component", () => {
  // Test 1: Basic rendering and toggling
  it("renders and shows content when triggered", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>Popover Content</PopoverContent>
      </Popover>
    );

    // Initially, the popover content should not be visible
    expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();

    // Click the trigger
    await user.click(screen.getByText("Open Popover"));

    // Now the content should be visible
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument();
    });
  });

  // Test 2: Testing default positioning and alignment
  it("applies default positioning and alignment", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent data-testid="popover-content">
          Default Positioning
        </PopoverContent>
      </Popover>
    );

    // Click to open
    await user.click(screen.getByText("Open Popover"));

    // Wait for content to appear
    await waitFor(() => {
      const content = screen.getByTestId("popover-content");
      expect(content).toBeInTheDocument();
      // Verify alignment is applied
      expect(content).toHaveAttribute("data-align", "center");

      // Check that the wrapper has the appropriate transform style with offset
      const wrapper = content.parentElement;
      expect(wrapper).toHaveAttribute("data-radix-popper-content-wrapper");
      // Check transform includes translation but don't check exact values
      expect(wrapper?.style.transform).toContain("translate");
    });
  });

  // Test 3: Custom alignment and offset
  it("respects custom alignment and sideOffset props", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={10}
          data-testid="popover-content"
        >
          Custom Positioning
        </PopoverContent>
      </Popover>
    );

    // Click to open
    await user.click(screen.getByText("Open Popover"));

    // Check custom alignment and offset
    await waitFor(() => {
      const content = screen.getByTestId("popover-content");
      expect(content).toHaveAttribute("data-align", "start");

      // Check for the wrapper's transform with 10px offset
      const wrapper = content.parentElement;
      expect(wrapper).toHaveAttribute("data-radix-popper-content-wrapper");
      // Verify it has a transform that includes 10px
      expect(wrapper?.style.transform).toContain("10px");
    });
  });

  // Test 4: Custom class name merging
  it("merges custom class names with default styles", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent
          className="custom-popover-class"
          data-testid="popover-content"
        >
          Custom Styled Popover
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByText("Open Popover"));

    await waitFor(() => {
      const content = screen.getByTestId("popover-content");
      expect(content).toHaveClass("custom-popover-class");
      // Should still have default classes
      expect(content).toHaveClass("z-50");
      expect(content).toHaveClass("rounded-md");
    });
  });

  // Test 5: Anchor positioning
  it("uses anchor for positioning when provided", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <div>
          <span>Some text before</span>
          <PopoverAnchor className="custom-anchor" data-testid="anchor" />
          <PopoverTrigger>Open Anchored Popover</PopoverTrigger>
        </div>
        <PopoverContent data-testid="popover-content">
          Anchored Content
        </PopoverContent>
      </Popover>
    );

    // Verify anchor is in the document
    expect(screen.getByTestId("anchor")).toBeInTheDocument();

    // Click to open
    await user.click(screen.getByText("Open Anchored Popover"));

    // Verify content appears
    await waitFor(() => {
      expect(screen.getByText("Anchored Content")).toBeInTheDocument();
    });
  });

  // Test 6: Closing functionality
  it("closes when clicked outside", async () => {
    const user = userEvent.setup();

    render(
      <>
        <div data-testid="outside-element">Click outside</div>
        <Popover>
          <PopoverTrigger>Open Popover</PopoverTrigger>
          <PopoverContent>Popover Content</PopoverContent>
        </Popover>
      </>
    );

    // Open the popover
    await user.click(screen.getByText("Open Popover"));

    // Wait for content to appear
    await waitFor(() => {
      expect(screen.getByText("Popover Content")).toBeInTheDocument();
    });

    // Click outside
    await user.click(screen.getByTestId("outside-element"));

    // Verify it's closed
    await waitFor(() => {
      expect(screen.queryByText("Popover Content")).not.toBeInTheDocument();
    });
  });

  // Test 7: Integration with Button component as trigger
  it("works with Button as trigger using asChild", async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger asChild>
          <button className="custom-button">Custom Button Trigger</button>
        </PopoverTrigger>
        <PopoverContent>Triggered from Button</PopoverContent>
      </Popover>
    );

    // Verify custom button is rendered
    const button = screen.getByText("Custom Button Trigger");
    expect(button).toHaveClass("custom-button");

    // Click the button
    await user.click(button);

    // Verify popover content appears
    await waitFor(() => {
      expect(screen.getByText("Triggered from Button")).toBeInTheDocument();
    });
  });
});
