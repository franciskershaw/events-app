import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import usePageTitle from "./usePageTitle";

describe("usePageTitle Hook", () => {
  // Store the original document.title
  const originalTitle = document.title;

  beforeEach(() => {
    // Reset document title before each test
    document.title = originalTitle;
  });

  afterEach(() => {
    // Restore original document title after tests
    document.title = originalTitle;
  });

  it("should set the document title with app name by default", () => {
    // Render the hook with a test title
    renderHook(() => usePageTitle("Test Page"));

    // Check that the title includes both the page title and app name
    expect(document.title).toBe("Test Page | Organisey");
  });

  it("should set the document title without app name when includeAppName is false", () => {
    // Render the hook with includeAppName set to false
    renderHook(() => usePageTitle("Test Page", false));

    // Check that the title only includes the page title
    expect(document.title).toBe("Test Page");
  });

  it("should update the title when title prop changes", () => {
    // Render the hook with initial title
    const { rerender } = renderHook(({ title }) => usePageTitle(title), {
      initialProps: { title: "Initial Page" },
    });

    // Check initial title
    expect(document.title).toBe("Initial Page | Organisey");

    // Re-render with new title
    rerender({ title: "Updated Page" });

    // Check that title was updated
    expect(document.title).toBe("Updated Page | Organisey");
  });

  it("should handle empty title gracefully", () => {
    // Render the hook with an empty string
    renderHook(() => usePageTitle(""));

    // Check title still includes app name with empty page name
    expect(document.title).toBe("| Organisey");
  });
});
