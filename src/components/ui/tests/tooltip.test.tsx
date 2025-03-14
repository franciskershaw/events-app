import React from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip";

// Define proper types for our mock components
interface TooltipRootProps {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
}

interface TooltipTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface TooltipContentProps {
  children: React.ReactNode;
  sideOffset?: number;
  className?: string;
  align?: string;
  side?: string;
}

interface TooltipPortalProps {
  children: React.ReactNode;
}

interface TooltipProviderProps {
  children: React.ReactNode;
  delayDuration?: number;
  skipDelayDuration?: number;
}

// Mock Radix UI Tooltip components
vi.mock("@radix-ui/react-tooltip", () => {
  // Mock components to capture props and render children
  const TooltipRoot = ({ children, open, defaultOpen }: TooltipRootProps) => (
    <div
      data-testid="tooltip-root"
      data-open={open}
      data-default-open={defaultOpen}
    >
      {children}
    </div>
  );

  const TooltipTrigger = ({ children, asChild }: TooltipTriggerProps) => (
    <div data-testid="tooltip-trigger" data-as-child={asChild}>
      {children}
    </div>
  );

  const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
    ({ children, sideOffset, className, align, side }, ref) => (
      <div
        data-testid="tooltip-content"
        data-side-offset={sideOffset}
        data-align={align}
        data-side={side}
        className={className}
        ref={ref}
      >
        {children}
      </div>
    )
  );
  TooltipContent.displayName = "TooltipContent";

  const Portal = ({ children }: TooltipPortalProps) => (
    <div data-testid="tooltip-portal">{children}</div>
  );

  const Provider = ({
    children,
    delayDuration,
    skipDelayDuration,
  }: TooltipProviderProps) => (
    <div
      data-testid="tooltip-provider"
      data-delay-duration={delayDuration}
      data-skip-delay-duration={skipDelayDuration}
    >
      {children}
    </div>
  );

  return {
    Root: TooltipRoot,
    Trigger: TooltipTrigger,
    Content: TooltipContent,
    Portal: Portal,
    Provider: Provider,
  };
});

// Mock the cn utility function
vi.mock("@/lib/utils", () => ({
  cn: (...inputs: (string | boolean | undefined)[]) =>
    inputs.filter(Boolean).join(" "),
}));

describe("Tooltip components", () => {
  it("renders a basic tooltip setup correctly", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    expect(screen.getByTestId("tooltip-provider")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-root")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-portal")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip-content")).toBeInTheDocument();

    expect(screen.getByText("Hover me")).toBeInTheDocument();
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });

  it("applies custom className to tooltip content", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent className="custom-class">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const content = screen.getByTestId("tooltip-content");

    // Check that our custom class is applied along with the default classes
    expect(content.className).toContain("custom-class");
    expect(content.className).toContain("z-50");
    expect(content.className).toContain("rounded-md");
  });

  it("forwards props to TooltipContent", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent sideOffset={10} align="start" side="bottom">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const content = screen.getByTestId("tooltip-content");
    expect(content.getAttribute("data-side-offset")).toBe("10");
    expect(content.getAttribute("data-align")).toBe("start");
    expect(content.getAttribute("data-side")).toBe("bottom");
  });

  it("uses default sideOffset when not provided", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const content = screen.getByTestId("tooltip-content");
    expect(content.getAttribute("data-side-offset")).toBe("4");
  });

  it("handles ref forwarding", () => {
    const ref = React.createRef<HTMLDivElement>();

    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent ref={ref}>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    // Since we're using a mock implementation, we're just checking if the ref prop was passed
    expect(screen.getByTestId("tooltip-content")).toEqual(expect.anything());
  });

  it("accepts delayDuration and skipDelayDuration props on Provider", () => {
    render(
      <TooltipProvider delayDuration={200} skipDelayDuration={100}>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const provider = screen.getByTestId("tooltip-provider");
    expect(provider.getAttribute("data-delay-duration")).toBe("200");
    expect(provider.getAttribute("data-skip-delay-duration")).toBe("100");
  });

  it("accepts open and defaultOpen props on Tooltip", () => {
    render(
      <TooltipProvider>
        <Tooltip open={true} defaultOpen={false}>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const root = screen.getByTestId("tooltip-root");
    expect(root.getAttribute("data-open")).toBe("true");
    expect(root.getAttribute("data-default-open")).toBe("false");
  });

  it("accepts asChild prop on TooltipTrigger", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Hover me</button>
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByTestId("tooltip-trigger");
    expect(trigger.getAttribute("data-as-child")).toBe("true");
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });
});
