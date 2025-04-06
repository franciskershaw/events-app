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

  return (
    <nav className="nav-desktop">
      <button className="nav-link-wrapper">
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
        onClick={() => setSidebarContent("events")}
        className="nav-link-wrapper"
      >
        <div className="nav-link-icon">
          <Calendar />
        </div>
        <h3>Events</h3>
      </Link>
      <Link
        to="/events"
        onClick={() => setSidebarContent("search")}
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
