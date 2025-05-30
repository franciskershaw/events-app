import { Calendar, LogOut, Search, Users } from "lucide-react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useModals } from "../../../../../contexts/Modals/ModalsContext";
import { useSidebarContent } from "../../../../../contexts/Sidebar/desktop/SidebarContentContext";
import useUser from "../../../../../hooks/user/useUser";
import useAuth from "../../../../../pages/Auth/hooks/useAuth";
import UsersInitials from "../../../../user/UsersInitials/UsersInitials";

export const NavDesktop = () => {
  const { user } = useUser();
  const { logout } = useAuth();
  const { openEventModal } = useModals();
  const { setSidebarContent } = useSidebarContent();
  const { openConnectionsModal } = useModals();

  const { setSidebarOpenNavClick } = useSidebarContent();
  const handleNavClick = (content: "events" | "search") => {
    setSidebarContent(content);
    setSidebarOpenNavClick(true);
  };

  return (
    <nav className="nav-desktop">
      <button
        className="nav-link-wrapper"
        onClick={() => openConnectionsModal()}
      >
        <UsersInitials />
        {user?.name && <h3>{user.name}</h3>}
      </button>
      <button onClick={() => openEventModal()} className="nav-link-wrapper">
        <div className="nav-link-icon">
          <FaPlus />
        </div>
        <h3>Add event</h3>
      </button>
      <Link
        to="/events"
        onClick={() => handleNavClick("events")}
        className="nav-link-wrapper"
      >
        <div className="nav-link-icon">
          <Calendar />
        </div>
        <h3>Events</h3>
      </Link>
      <Link
        to="/events"
        onClick={() => handleNavClick("search")}
        className="nav-link-wrapper"
      >
        <div className="nav-link-icon">
          <Search />
        </div>
        <h3>Search</h3>
      </Link>
      <Link to="/connections" className="nav-link-wrapper">
        <div className="nav-link-icon">
          <Users />
        </div>
        <h3>Connections</h3>
      </Link>
      <Button
        onClick={logout}
        className="nav-link-wrapper"
        variant="naked"
        throttleClicks={true}
        throttleTime={5000}
      >
        <div className="nav-link-icon">
          <LogOut />
        </div>
        <h3>Logout</h3>
      </Button>
    </nav>
  );
};
