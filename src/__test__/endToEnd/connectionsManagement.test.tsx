import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { ModalsProvider } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";
import useAuth from "@/pages/Auth/hooks/useAuth";
import useConnectUsers from "@/pages/Connections/hooks/useConnectUsers";
import useGenerateConnectionId from "@/pages/Connections/hooks/useGenerateConnectionId";
import useRemoveConnection from "@/pages/Connections/hooks/useRemoveConnection";
import useUpdateConnectionPreferences from "@/pages/Connections/hooks/useUpdateConnectionPreferences";
import { User } from "@/types/globalTypes";

// Create a test wrapper with all the providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

function TestWrapper({ children }: { children: React.ReactNode }) {
  const testQueryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={testQueryClient}>
      <ModalsProvider>{children}</ModalsProvider>
    </QueryClientProvider>
  );
}

// Custom render method with providers
function customRender(ui: React.ReactNode) {
  return render(ui, { wrapper: TestWrapper });
}

// Mock the user hook for authentication control
vi.mock("@/hooks/user/useUser", () => ({
  default: vi.fn(),
}));

// Mock the auth hook
vi.mock("@/pages/Auth/hooks/useAuth", () => ({
  default: vi.fn(),
}));

// Mock connection hooks
vi.mock("@/pages/Connections/hooks/useGenerateConnectionId", () => ({
  default: vi.fn(),
}));

vi.mock("@/pages/Connections/hooks/useConnectUsers", () => ({
  default: vi.fn(),
}));

vi.mock("@/pages/Connections/hooks/useRemoveConnection", () => ({
  default: vi.fn(),
}));

vi.mock("@/pages/Connections/hooks/useUpdateConnectionPreferences", () => ({
  default: vi.fn(),
}));

// Mock the SidebarContext
vi.mock("@/contexts/Sidebar/mobile/SidebarContext", () => ({
  useSidebar: () => ({
    isExpanded: false,
    toggleSidebar: vi.fn(),
    closeSidebar: vi.fn(),
  }),
}));

// Mock the SidebarContentContext
vi.mock("@/contexts/Sidebar/desktop/SidebarContentContext", () => ({
  useSidebarContent: () => ({
    sidebarContent: "connections",
    setSidebarContent: vi.fn(),
    sidebarOpenNavClick: false,
    setSidebarOpenNavClick: vi.fn(),
  }),
}));

// Create user states for testing
const mockAuthenticatedUser = {
  user: {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    connections: [],
    connectionId: undefined,
    accessToken: "token123",
  } as User,
  fetchingUser: false,
  updateUser: vi.fn(),
  clearUser: vi.fn(),
};

const mockUserWithConnections = {
  user: {
    _id: "user123",
    name: "Test User",
    email: "test@example.com",
    connections: [
      {
        _id: "connection1",
        name: "Connected Friend",
        email: "friend@example.com",
        hideEvents: false,
      },
      {
        _id: "connection2",
        name: "Hidden Friend",
        email: "hidden@example.com",
        hideEvents: true,
      },
    ],
    connectionId: {
      id: "TESTCODE123",
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
    },
    accessToken: "token123",
  } as User,
  fetchingUser: false,
  updateUser: vi.fn(),
  clearUser: vi.fn(),
};

describe("Connection Management Flow (End-to-End)", () => {
  // Mock functions for connections
  const connectUserMock = vi.fn();
  const generateIdMock = vi.fn();
  const removeConnectionMock = vi.fn();
  const updatePreferencesMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default to authenticated state without connections
    vi.mocked(useUser).mockReturnValue(mockAuthenticatedUser);

    // Set up mocks for connection operations

    vi.mocked(useGenerateConnectionId).mockReturnValue({
      mutate: generateIdMock,
      isPending: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    vi.mocked(useConnectUsers).mockReturnValue({
      mutate: connectUserMock,
      isPending: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    vi.mocked(useRemoveConnection).mockReturnValue({
      mutate: removeConnectionMock,
      isPending: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    vi.mocked(useUpdateConnectionPreferences).mockReturnValue({
      mutate: updatePreferencesMock,
      isPending: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    vi.mocked(useAuth).mockReturnValue({
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
    });

    // Set the active route to connections
    window.history.pushState({}, "", "/connections");
  });

  it("navigates to connections page when authenticated", async () => {
    // Render the app with authenticated user
    customRender(<App />);

    // Wait for the connections page to load
    await waitFor(() => {
      expect(screen.getByText(/your connections/i)).toBeInTheDocument();
    });
  });

  it("displays an empty state when user has no connections", async () => {
    // Render the app with authenticated user (has no connections by default)
    customRender(<App />);

    // Wait for the connections page to load
    await waitFor(() => {
      expect(screen.getByText(/your connections/i)).toBeInTheDocument();
    });

    // Check for empty state message
    expect(screen.getByText(/no connections yet/i)).toBeInTheDocument();
  });

  it("displays existing connections when user has connections", async () => {
    // Start with a user that has connections
    vi.mocked(useUser).mockReturnValue(mockUserWithConnections);

    // Render the app
    customRender(<App />);

    // Wait for the connections page to load
    await waitFor(() => {
      expect(screen.getByText(/your connections/i)).toBeInTheDocument();
    });

    // Check if connections are displayed
    expect(screen.getByText("Connected Friend")).toBeInTheDocument();
    expect(screen.getByText("Hidden Friend")).toBeInTheDocument();
  });

  it("lets the user generate a connection code", async () => {
    const user = userEvent.setup();

    // Render the app with authenticated user
    customRender(<App />);

    // Wait for the connections page to load
    await waitFor(() => {
      expect(screen.getByText(/your connections/i)).toBeInTheDocument();
    });

    // Find and click the "Generate Connection Code" button
    const generateButton = screen.getByText(/generate connection code/i);
    await user.click(generateButton);

    // Verify the generateId mutation was called
    expect(generateIdMock).toHaveBeenCalled();
  });

  it("allows user to connect with another user", async () => {
    const user = userEvent.setup();

    // Render the app with authenticated user
    customRender(<App />);

    // Wait for the connections page to load
    await waitFor(() => {
      expect(screen.getByText(/your connections/i)).toBeInTheDocument();
    });

    // Find the connection code input
    const connectionInput = screen.getByPlaceholderText(
      /enter connection code/i
    );
    await user.type(connectionInput, "FRIEND123");

    // Click the connect button - make it more specific by getting it by exact text
    const connectButtons = screen.getAllByRole("button", { name: /connect/i });
    // Find the exact "Connect" button (not "Connect with a friend" or similar)
    const connectButton = connectButtons.find(
      (button) => button.textContent === "Connect"
    );
    if (!connectButton) {
      throw new Error("Connect button not found");
    }
    await user.click(connectButton);

    // Verify the connect mutation was called with the right code
    expect(connectUserMock).toHaveBeenCalledWith("FRIEND123");
  });

  it("allows user to toggle event visibility for a connection", async () => {
    const user = userEvent.setup();

    // Start with a user that has connections
    vi.mocked(useUser).mockReturnValue(mockUserWithConnections);

    // Render the app
    customRender(<App />);

    // Wait for the connections page to load
    await waitFor(() => {
      expect(screen.getByText(/your connections/i)).toBeInTheDocument();
    });

    // Click the hide/show button for the first connection (not hidden initially)
    const firstConnectionToggleButton = screen.getByRole("button", {
      name: /hide events/i,
    });
    await user.click(firstConnectionToggleButton);

    // Verify updatePreferences was called with the right args
    expect(updatePreferencesMock).toHaveBeenCalledWith({
      connectionId: "connection1",
      hideEvents: true,
    });
  });

  it("allows user to show events for a hidden connection", async () => {
    const user = userEvent.setup();

    // Start with a user that has connections
    vi.mocked(useUser).mockReturnValue(mockUserWithConnections);

    // Render the app
    customRender(<App />);

    // Wait for the connections page to load
    await waitFor(() => {
      expect(screen.getByText(/your connections/i)).toBeInTheDocument();
    });

    // Click the hide/show button for the second connection (already hidden)
    const secondConnectionToggleButton = screen.getByRole("button", {
      name: /show events/i,
    });
    await user.click(secondConnectionToggleButton);

    // Verify updatePreferences was called with the right args
    expect(updatePreferencesMock).toHaveBeenCalledWith({
      connectionId: "connection2",
      hideEvents: false,
    });
  });

  it("allows user to remove a connection", async () => {
    const user = userEvent.setup();

    // Start with a user that has connections
    vi.mocked(useUser).mockReturnValue(mockUserWithConnections);

    // Render the app
    customRender(<App />);

    // Wait for the connections page to load
    await waitFor(() => {
      expect(screen.getByText(/your connections/i)).toBeInTheDocument();
    });

    // Find and click the delete button for the first connection
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    await user.click(deleteButtons[0]); // First delete button

    // A confirmation modal should appear, find and click the confirm button
    const confirmButton = await screen.findByRole("button", {
      name: /remove connection/i,
    });
    await user.click(confirmButton);

    // Verify removeConnection was called with the right connection id
    expect(removeConnectionMock).toHaveBeenCalledWith({ _id: "connection1" });
  });
});
