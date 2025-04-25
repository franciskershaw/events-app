import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { useModals } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";
import ConnectionsModal from "@/pages/Events/components/global/ConnectionsModal/ConnectionsModal";
import { User } from "@/types/globalTypes";

// Mock the context and hook
vi.mock("@/contexts/Modals/ModalsContext");
vi.mock("@/hooks/user/useUser");
// Mock ConnectionListItem as it's tested elsewhere and simplifies this test
vi.mock(
  "@/pages/Connections/components/ConnectionListItem/ConnectionListItem",
  () => ({
    default: ({
      connection,
    }: {
      connection: { _id: string; name: string };
    }) => (
      <div data-testid={`connection-${connection._id}`}>{connection.name}</div>
    ),
  })
);

const mockCloseModal = vi.fn();
const mockConnections = [
  {
    _id: "1",
    name: "Connection One",
    email: "conn1@example.com",
    hideEvents: false,
  },
  {
    _id: "2",
    name: "Connection Two",
    email: "conn2@example.com",
    hideEvents: false,
  },
];

const mockUser: Partial<User> = {
  _id: "user1",
  name: "Test User",
  email: "test@example.com",
  connections: mockConnections,
  accessToken: "mockAccessToken",
};

describe("ConnectionsModal", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test

    // Setup default mock return values
    (useModals as Mock).mockReturnValue({
      isConnectionsModalOpen: true, // Assume modal is open for most tests
      closeModal: mockCloseModal,
      // Mock other modal states/functions if needed, set to false/noop
      isAddEventModalOpen: false,
      openAddEventModal: vi.fn(),
      isEditEventModalOpen: false,
      openEditEventModal: vi.fn(),
      isAuthModalOpen: false,
      openAuthModal: vi.fn(),
      isShareModalOpen: false,
      openShareModal: vi.fn(),
      isAddConnectionModalOpen: false,
      openAddConnectionModal: vi.fn(),
      isPendingRequestsModalOpen: false,
      openPendingRequestsModal: vi.fn(),
      isUserProfileModalOpen: false,
      openUserProfileModal: vi.fn(),
    });

    (useUser as Mock).mockReturnValue({
      user: mockUser,
      loading: false,
      error: null,
      refetchUser: vi.fn(),
      logout: vi.fn(),
    });
  });

  it("renders correctly when open", () => {
    render(<ConnectionsModal />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Connections" })
    ).toBeInTheDocument();
  });

  it("renders the correct number of connections", () => {
    render(<ConnectionsModal />);
    const connectionItems = screen.getAllByTestId(/connection-/);
    expect(connectionItems).toHaveLength(mockConnections.length);
    expect(screen.getByText("Connection One")).toBeInTheDocument();
    expect(screen.getByText("Connection Two")).toBeInTheDocument();
  });

  it("renders the close button", () => {
    render(<ConnectionsModal />);
    // Get the main text close button, not the 'X' button in the corner
    expect(
      screen.getByText("Close", { selector: "button" })
    ).toBeInTheDocument();
  });

  it("calls closeModal when the close button is clicked", () => {
    render(<ConnectionsModal />);
    // Get the main text close button, not the 'X' button in the corner
    const closeButton = screen.getByText("Close", { selector: "button" });
    fireEvent.click(closeButton);
    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it("does not render when isConnectionsModalOpen is false", () => {
    (useModals as Mock).mockReturnValue({
      ...(useModals() as ReturnType<typeof useModals>), // Spread previous mocks, ensure type safety
      isConnectionsModalOpen: false, // Override the open state
    });
    render(<ConnectionsModal />);
    // The Dialog component might still render wrapper divs, but the role='dialog' should not be present or visible
    // depending on Shadcn's implementation. A safer check might be queryByRole.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Connections" })
    ).not.toBeInTheDocument();
  });

  it("renders correctly with no connections", () => {
    (useUser as Mock).mockReturnValue({
      ...(useUser() as ReturnType<typeof useUser>), // Spread previous mocks, ensure type safety
      user: { ...(mockUser as User), connections: [] }, // Override connections, ensure type safety
    });
    render(<ConnectionsModal />);
    expect(
      screen.getByRole("heading", { name: "Connections" })
    ).toBeInTheDocument();
    // Expect no connection list items
    expect(screen.queryAllByTestId(/connection-/)).toHaveLength(0);
    // Get the main text close button, not the 'X' button in the corner
    expect(
      screen.getByText("Close", { selector: "button" })
    ).toBeInTheDocument();
  });
});
