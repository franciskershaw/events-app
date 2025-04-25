import { ReactNode } from "react";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Event } from "@/types/globalTypes";

import { ModalsProvider, useModals } from "./ModalsContext";

// Test wrapper component
const wrapper = ({ children }: { children: ReactNode }) => (
  <ModalsProvider>{children}</ModalsProvider>
);

// Mock event for testing
const mockEvent: Event = {
  _id: "event-123",
  title: "Test Event",
  date: {
    start: "2023-01-01T10:00:00",
    end: "2023-01-01T11:00:00",
  },
  category: {
    _id: "category-123",
    name: "Test Category",
    icon: "test-icon",
  },
  createdBy: {
    _id: "user-123",
    name: "Test User",
  },
  description: "Test Description",
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  unConfirmed: false,
  private: false,
};

describe("ModalsContext", () => {
  it("should initialize with all modals closed", () => {
    const { result } = renderHook(() => useModals(), { wrapper });

    expect(result.current.isEventModalOpen).toBe(false);
    expect(result.current.isDeleteEventModalOpen).toBe(false);
    expect(result.current.isConnectionsModalOpen).toBe(false);
    expect(result.current.selectedEvent).toBeNull();
    expect(result.current.mode).toBeNull();
  });

  it("should open event modal with default add mode", () => {
    const { result } = renderHook(() => useModals(), { wrapper });

    act(() => {
      result.current.openEventModal();
    });

    expect(result.current.isEventModalOpen).toBe(true);
    expect(result.current.mode).toBe("add");
    expect(result.current.selectedEvent).toBeNull();
  });

  it("should open event modal with event data and edit mode", () => {
    const { result } = renderHook(() => useModals(), { wrapper });

    act(() => {
      result.current.openEventModal(mockEvent, "edit");
    });

    expect(result.current.isEventModalOpen).toBe(true);
    expect(result.current.mode).toBe("edit");
    expect(result.current.selectedEvent).toEqual(mockEvent);
  });

  it("should open delete event modal with event data", () => {
    const { result } = renderHook(() => useModals(), { wrapper });

    act(() => {
      result.current.openDeleteEventModal(mockEvent);
    });

    expect(result.current.isDeleteEventModalOpen).toBe(true);
    expect(result.current.selectedEvent).toEqual(mockEvent);
  });

  it("should open connections modal", () => {
    const { result } = renderHook(() => useModals(), { wrapper });

    act(() => {
      result.current.openConnectionsModal();
    });

    expect(result.current.isConnectionsModalOpen).toBe(true);
  });

  it("should close all modals", () => {
    const { result } = renderHook(() => useModals(), { wrapper });

    // First open a modal
    act(() => {
      result.current.openEventModal(mockEvent, "edit");
    });

    expect(result.current.isEventModalOpen).toBe(true);

    // Then close it
    act(() => {
      result.current.closeModal();
    });

    expect(result.current.isEventModalOpen).toBe(false);
    expect(result.current.isDeleteEventModalOpen).toBe(false);
    expect(result.current.isConnectionsModalOpen).toBe(false);
    expect(result.current.selectedEvent).toBeNull();
    expect(result.current.mode).toBeNull();
  });

  it("should reset selected data", () => {
    const { result } = renderHook(() => useModals(), { wrapper });

    // First set some data
    act(() => {
      result.current.openEventModal(mockEvent, "edit");
    });

    expect(result.current.selectedEvent).toEqual(mockEvent);
    expect(result.current.mode).toBe("edit");

    // Then reset just the data (modal remains open)
    act(() => {
      result.current.resetSelectedData();
    });

    expect(result.current.isEventModalOpen).toBe(true); // Modal still open
    expect(result.current.selectedEvent).toBeNull(); // But data is reset
    expect(result.current.mode).toBeNull();
  });

  it("should throw an error when useModals is used outside of ModalsProvider", () => {
    expect(() => renderHook(() => useModals())).toThrow(
      "useModals must be used within a ModalsProvider"
    );
  });
});
