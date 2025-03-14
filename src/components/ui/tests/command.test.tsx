import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "../command";

describe("Command components", () => {
  // Test 1: Main Command component renders
  it("renders Command component with proper classes", () => {
    const { container } = render(<Command />);
    expect(container.firstChild).toHaveClass("flex");
    expect(container.firstChild).toHaveClass("h-full");
    expect(container.firstChild).toHaveClass("w-full");
  });

  // Test 2: CommandShortcut renders (works because it doesn't use context)
  it("renders CommandShortcut with text", () => {
    render(<CommandShortcut>⌘K</CommandShortcut>);
    const shortcut = screen.getByText("⌘K");
    expect(shortcut).toBeInTheDocument();
    expect(shortcut).toHaveClass("ml-auto");
    expect(shortcut).toHaveClass("text-xs");
  });

  // Test 3: Test a complete Command component structure
  it("renders complete Command structure", () => {
    const { container } = render(
      <Command className="test-command">
        <CommandInput placeholder="Search..." className="test-input" />
        <CommandList className="test-list">
          <CommandGroup heading="Test Group" className="test-group">
            <CommandItem className="test-item">Item 1</CommandItem>
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
          <CommandEmpty>No results</CommandEmpty>
        </CommandList>
      </Command>
    );

    // Check that the main Command container has the right class
    expect(container.querySelector(".test-command")).toBeInTheDocument();

    // Check that content renders properly
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByText("Test Group")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });
});
