import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import useUser from "@/hooks/user/useUser";
import { User } from "@/types/globalTypes";

import ConnectionFormContent from "../../../components/ConnectionForm/ConnectionFormContent";
import useConnectUsers from "../../../hooks/useConnectUsers";
import useGenerateConnectionId from "../../../hooks/useGenerateConnectionId";

// Mock dependencies
vi.mock("@/hooks/user/useUser", () => ({
  default: vi.fn(),
}));

vi.mock("../../../hooks/useConnectUsers", () => ({
  default: vi.fn(),
}));

vi.mock("../../../hooks/useGenerateConnectionId", () => ({
  default: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Setup spy for the clipboard API without actually modifying the navigator object
const clipboardSpy = vi.fn();

describe("ConnectionFormContent", () => {
  // Mock user data
  const mockUser: User = {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    accessToken: "test-token",
    connections: [],
  };

  // Mock user with active connection ID
  const mockUserWithConnectionId: User = {
    ...mockUser,
    connectionId: {
      id: "test-connection-id-123",
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // valid for 24 hours
    },
  };

  // Mock expired connection ID
  const mockUserWithExpiredConnectionId: User = {
    ...mockUser,
    connectionId: {
      id: "expired-connection-id",
      expiry: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // expired 24 hours ago
    },
  };

  // Setup mocks for hooks
  const mockGenerateId = vi.fn();
  const mockConnectUsers = vi.fn();

  // Create a basic mock mutation object
  const createMockMutation = (isPending = false, mutateFn = vi.fn()) => ({
    mutate: mutateFn,
    isPending,
    isError: false,
    isSuccess: false,
    error: null,
    data: null,
    reset: vi.fn(),
    status: isPending ? "loading" : "idle",
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mocks
    clipboardSpy.mockReset().mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, "writeText").mockImplementation(clipboardSpy);

    vi.mocked(toast.success).mockClear();
    vi.mocked(toast.error).mockClear();

    // Default to user with no connection ID
    vi.mocked(useUser).mockReturnValue({
      user: mockUser,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    // Mock useGenerateConnectionId hook
    vi.mocked(useGenerateConnectionId).mockReturnValue(
      createMockMutation(false, mockGenerateId) as unknown as ReturnType<
        typeof useGenerateConnectionId
      >
    );

    // Mock useConnectUsers hook
    vi.mocked(useConnectUsers).mockReturnValue({
      ...createMockMutation(false, mockConnectUsers),
    } as unknown as ReturnType<typeof useConnectUsers>);
  });

  it("renders correctly with all required sections", () => {
    render(<ConnectionFormContent inputId="test-input" />);

    // Check for main sections
    expect(screen.getByText("Share Your Code")).toBeInTheDocument();
    expect(screen.getByText("Connect with Someone")).toBeInTheDocument();

    // Check for generate button when no connection ID exists
    expect(screen.getByText("Generate Connection Code")).toBeInTheDocument();

    // Check for input field and connect button
    expect(
      screen.getByPlaceholderText("Enter connection code")
    ).toBeInTheDocument();
    expect(screen.getByText("Connect")).toBeInTheDocument();
  });

  it("shows the connection ID when user has a valid one", () => {
    // Mock user with valid connection ID
    vi.mocked(useUser).mockReturnValue({
      user: mockUserWithConnectionId,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(<ConnectionFormContent inputId="test-input" />);

    // Connection ID should be visible
    expect(screen.getByText("test-connection-id-123")).toBeInTheDocument();

    // Generate button should not be visible
    expect(
      screen.queryByText("Generate Connection Code")
    ).not.toBeInTheDocument();
  });

  it("shows 'Generate Connection Code' when connection ID is expired", () => {
    // Mock user with expired connection ID
    vi.mocked(useUser).mockReturnValue({
      user: mockUserWithExpiredConnectionId,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    render(<ConnectionFormContent inputId="test-input" />);

    // Generate button should be visible for expired ID
    expect(screen.getByText("Generate Connection Code")).toBeInTheDocument();
  });

  it("displays success toast when connection ID is shown and button is clicked", async () => {
    // Mock user with valid connection ID
    vi.mocked(useUser).mockReturnValue({
      user: mockUserWithConnectionId,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    const user = userEvent.setup();
    render(<ConnectionFormContent inputId="test-input" />);

    // Click the button with the connection ID
    const button = screen.getByText("test-connection-id-123").closest("button");
    expect(button).toBeInTheDocument();
    await user.click(button!);

    // Success toast should be shown
    expect(toast.success).toHaveBeenCalledWith(
      "Connection code copied to clipboard!"
    );
  });

  it("generates a new connection ID when button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConnectionFormContent inputId="test-input" />);

    // Click the generate button
    const generateButton = screen.getByText("Generate Connection Code");
    await user.click(generateButton);

    // Verify generate mutation was called
    expect(mockGenerateId).toHaveBeenCalled();
  });

  it("shows 'Generating...' when connection ID is being generated", () => {
    // Mock pending state
    vi.mocked(useGenerateConnectionId).mockReturnValue({
      ...createMockMutation(true, mockGenerateId),
    } as unknown as ReturnType<typeof useGenerateConnectionId>);

    render(<ConnectionFormContent inputId="test-input" />);

    // Should show loading state
    expect(screen.getByText("Generating...")).toBeInTheDocument();

    // Button should be disabled
    expect(screen.getByText("Generating...").closest("button")).toBeDisabled();
  });

  it("calls connectUsers with input value when Connect button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConnectionFormContent inputId="test-input" />);

    // Type a connection ID
    const input = screen.getByPlaceholderText("Enter connection code");
    await user.type(input, "new-connection-id");

    // Click the connect button
    const connectButton = screen.getByText("Connect");
    await user.click(connectButton);

    // Verify connectUsers was called with the entered ID
    expect(mockConnectUsers).toHaveBeenCalledWith("new-connection-id");
  });

  it("shows 'Connecting...' when connection is in progress", () => {
    // Mock connecting state
    vi.mocked(useConnectUsers).mockReturnValue({
      ...createMockMutation(true, mockConnectUsers),
    } as unknown as ReturnType<typeof useConnectUsers>);

    render(<ConnectionFormContent inputId="test-input" />);

    // Should show loading state
    expect(screen.getByText("Connecting...")).toBeInTheDocument();

    // Button should be disabled
    expect(screen.getByText("Connecting...").closest("button")).toBeDisabled();
  });

  it("handles clipboard error gracefully", async () => {
    // Mock user with valid connection ID
    vi.mocked(useUser).mockReturnValue({
      user: mockUserWithConnectionId,
      fetchingUser: false,
      updateUser: vi.fn(),
      clearUser: vi.fn(),
    });

    // Mock clipboard failure for this test only
    clipboardSpy.mockRejectedValueOnce(new Error("Clipboard error"));

    const user = userEvent.setup();
    render(<ConnectionFormContent inputId="test-input" />);

    // Click the button with the connection ID
    const button = screen.getByText("test-connection-id-123").closest("button");
    await user.click(button!);

    // Error toast should be shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to copy code to clipboard"
      );
    });
  });

  it("applies custom className when provided", () => {
    const customClass = "custom-test-class";
    render(
      <ConnectionFormContent inputId="test-input" className={customClass} />
    );

    // The outermost div should have the custom class
    const container = screen
      .getByText("Share Your Code")
      .closest(`.${customClass}`);
    expect(container).toBeInTheDocument();
  });

  it("copies code to clipboard after generating a new ID", async () => {
    // Setup successful generation response
    const newConnectionId = { id: "newly-generated-id", expiry: "2023-12-31" };
    mockGenerateId.mockImplementation((_, options) => {
      if (options && options.onSuccess) {
        options.onSuccess(newConnectionId);
      }
    });

    const user = userEvent.setup();
    render(<ConnectionFormContent inputId="test-input" />);

    // Click the generate button
    const generateButton = screen.getByText("Generate Connection Code");
    await user.click(generateButton);

    // Verify generation was called
    expect(mockGenerateId).toHaveBeenCalled();

    // Success toast should be shown
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        "Connection code copied to clipboard!"
      );
    });
  });
});
