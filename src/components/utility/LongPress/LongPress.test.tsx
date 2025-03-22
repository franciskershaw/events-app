import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import LongPress from "./LongPress";

// Mock setTimeout and clearTimeout
vi.useFakeTimers();

describe("LongPress Component", () => {
  const onLongPressMock = vi.fn();
  const onClickMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("renders children correctly", () => {
    render(
      <LongPress onLongPress={onLongPressMock} onClick={onClickMock}>
        <div data-testid="test-child">Test Child</div>
      </LongPress>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });

  it("triggers onClick when clicked (short press)", () => {
    render(
      <LongPress onLongPress={onLongPressMock} onClick={onClickMock}>
        <div data-testid="test-child">Test Child</div>
      </LongPress>
    );

    const container = screen.getByTestId("test-child").parentElement;
    expect(container).not.toBeNull();

    // Simulate mouse down and up (short press)
    if (container) {
      fireEvent.mouseDown(container);
      fireEvent.mouseUp(container);
    }

    // onClick should be called, but not onLongPress
    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onLongPressMock).not.toHaveBeenCalled();
  });

  it("triggers onLongPress after default delay (500ms)", () => {
    render(
      <LongPress onLongPress={onLongPressMock} onClick={onClickMock}>
        <div data-testid="test-child">Test Child</div>
      </LongPress>
    );

    const container = screen.getByTestId("test-child").parentElement;
    expect(container).not.toBeNull();

    if (container) {
      // Start the long press
      fireEvent.mouseDown(container);

      // Fast-forward time to trigger the long press
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Finish the press
      fireEvent.mouseUp(container);
    }

    // onLongPress should be called, but not onClick
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it("triggers onLongPress after custom delay", () => {
    const customDelay = 1000;

    render(
      <LongPress
        onLongPress={onLongPressMock}
        onClick={onClickMock}
        delay={customDelay}
      >
        <div data-testid="test-child">Test Child</div>
      </LongPress>
    );

    const container = screen.getByTestId("test-child").parentElement;
    expect(container).not.toBeNull();

    if (container) {
      // Start the long press
      fireEvent.mouseDown(container);

      // Fast-forward time to just before the long press threshold
      act(() => {
        vi.advanceTimersByTime(customDelay - 100);
      });

      // onLongPress should not be called yet
      expect(onLongPressMock).not.toHaveBeenCalled();

      // Fast-forward time to trigger the long press
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Finish the press
      fireEvent.mouseUp(container);
    }

    // onLongPress should be called, but not onClick
    expect(onLongPressMock).toHaveBeenCalledTimes(1);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  it("cancels long press when mouse leaves during press", () => {
    render(
      <LongPress onLongPress={onLongPressMock} onClick={onClickMock}>
        <div data-testid="test-child">Test Child</div>
      </LongPress>
    );

    const container = screen.getByTestId("test-child").parentElement;
    expect(container).not.toBeNull();

    if (container) {
      // Start the long press
      fireEvent.mouseDown(container);

      // Move mouse out before long press triggers
      fireEvent.mouseLeave(container);

      // Fast-forward time past the long press threshold
      act(() => {
        vi.advanceTimersByTime(600);
      });

      // Click elsewhere to end the sequence
      fireEvent.mouseUp(document.body);
    }

    // Neither callback should be called
    expect(onLongPressMock).not.toHaveBeenCalled();
    expect(onClickMock).not.toHaveBeenCalled();
  });
});
