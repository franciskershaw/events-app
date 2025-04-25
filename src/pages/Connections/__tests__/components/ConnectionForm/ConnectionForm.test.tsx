import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConnectionForm from "@/pages/Connections/components/ConnectionForm/ConnectionForm";
import ConnectionFormContent from "@/pages/Connections/components/ConnectionForm/ConnectionFormContent";

// Mock the ConnectionFormContent component
vi.mock(
  "@/pages/Connections/components/ConnectionForm/ConnectionFormContent",
  () => ({
    default: vi.fn(() => <div data-testid="mocked-form-content" />),
  })
);

describe("ConnectionForm", () => {
  it("renders with correct heading and description", () => {
    render(<ConnectionForm />);

    // Verify heading and text content
    expect(screen.getByText("Connect with Friends")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Share your events with friends by either generating a code or entering theirs"
      )
    ).toBeInTheDocument();
  });

  it("renders ConnectionFormContent with the correct props", () => {
    render(<ConnectionForm />);

    // Verify the content component is rendered
    expect(screen.getByTestId("mocked-form-content")).toBeInTheDocument();

    // Check that ConnectionFormContent was called with the correct props
    expect(ConnectionFormContent).toHaveBeenCalledWith(
      { inputId: "form-connection-id" },
      expect.anything()
    );
  });

  it("applies proper styling to the container", () => {
    render(<ConnectionForm />);

    // Verify the outer container has the correct classes
    const container = screen.getByText("Connect with Friends").closest("div");
    expect(container).toHaveClass("rounded-lg border p-6 h-full md:p-8");
  });
});
