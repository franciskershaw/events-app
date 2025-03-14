import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  BasicSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

// Mock data for testing
const options = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "orange", label: "Orange" },
];

describe("Select component", () => {
  describe("Base Select components", () => {
    it("renders with children and applies custom classes", () => {
      render(
        <Select>
          <SelectTrigger className="test-trigger-class">
            <SelectValue placeholder="Select something" />
          </SelectTrigger>
          <SelectContent className="test-content-class">
            <SelectItem value="test">Test Item</SelectItem>
          </SelectContent>
        </Select>
      );

      // Check trigger rendering
      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass("test-trigger-class");
      expect(screen.getByText("Select something")).toBeInTheDocument();
    });

    it("renders with a selected value", () => {
      render(
        <Select value="test" defaultValue="test">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Selected Option</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByText("Selected Option")).toBeInTheDocument();
    });

    it("renders in disabled state when disabled prop is true", () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select something" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Item</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });

    it("applies ARIA attributes correctly", () => {
      render(
        <Select>
          <SelectTrigger aria-label="Test select">
            <SelectValue placeholder="Select something" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test Item</SelectItem>
          </SelectContent>
        </Select>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-label", "Test select");
    });
  });

  describe("BasicSelect component", () => {
    it("renders with the provided value and options", () => {
      const onChange = vi.fn();

      render(
        <BasicSelect value="banana" onChange={onChange} options={options} />
      );

      // The selected value should be displayed
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("shows placeholder when no value is selected", () => {
      const onChange = vi.fn();

      render(
        <BasicSelect
          value=""
          onChange={onChange}
          options={options}
          placeholder="Choose an option"
        />
      );

      expect(screen.getByText("Choose an option")).toBeInTheDocument();
    });

    it("handles empty options array gracefully", () => {
      const onChange = vi.fn();

      render(<BasicSelect value="option1" onChange={onChange} options={[]} />);

      // The trigger should be disabled
      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();

      // It should still show the value
      expect(screen.getByText("option1")).toBeInTheDocument();
    });

    it("applies custom side prop to SelectContent", () => {
      const onChange = vi.fn();

      render(
        <BasicSelect
          value="banana"
          onChange={onChange}
          options={options}
          side="top"
        />
      );

      // We can only test that it renders correctly since
      // the actual positioning happens in a portal
      expect(screen.getByText("Banana")).toBeInTheDocument();
    });

    it("respects the disabled prop on the root component", () => {
      const onChange = vi.fn();

      render(
        <BasicSelect
          value="banana"
          onChange={onChange}
          options={options}
          disabled={true}
        />
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeDisabled();
    });
  });
});
