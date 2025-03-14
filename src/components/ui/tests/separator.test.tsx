import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Separator } from "../separator";

describe("Separator component", () => {
  it("renders with default horizontal orientation", () => {
    const { container } = render(<Separator />);

    // Test that it has the horizontal class
    expect(container.firstChild).toHaveClass("h-[1px]");
    expect(container.firstChild).toHaveClass("w-full");
  });

  it("renders with vertical orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);

    // Test that it has the vertical class
    expect(container.firstChild).toHaveClass("h-full");
    expect(container.firstChild).toHaveClass("w-[1px]");
  });

  it("accepts and merges custom classNames", () => {
    const { container } = render(<Separator className="custom-class" />);

    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("shrink-0");
  });
});
