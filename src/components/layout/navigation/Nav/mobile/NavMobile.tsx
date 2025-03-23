import { Calendar, LogOut, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import UserInitials from "@/components/user/UserInitials/UserInitials";
import { useSidebar } from "@/contexts/Sidebar/mobile/SidebarContext";
import useUser from "@/hooks/user/useUser";
import useAuth from "@/pages/Auth/hooks/useAuth";

import { NAV_HEIGHT } from "../../../../../constants/app";
import { useScrollVisibility } from "../../../../../hooks/utility/useScrollVisibility";
import Hamburger from "../../Hamburger/Hamburger";

const NavMobile = () => {
  const { isExpanded, toggleSidebar } = useSidebar();
  const location = useLocation();
  const isAuthPage = location.pathname === "/";
  const { isVisible: isNavbarVisible } = useScrollVisibility();
  const { user } = useUser();
  const { logout } = useAuth();

  const handleLinkClick = () => {
    toggleSidebar();
  };

  if (isAuthPage) return null;

  return (
    <>
      <div
        className="fixed top-4 right-4 z-[45] transition-transform duration-300"
        style={{
          transform: `translateY(${isNavbarVisible ? "0px" : `-${NAV_HEIGHT}`})`,
        }}
      >
        <Hamburger />
      </div>
      <div
        className={`fixed top-0 left-0 h-full bg-primary text-primary-foreground transform w-full ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out z-40`}
      >
        <div className="flex flex-col items-center pt-16 px-6">
          {/* Large Avatar */}
          <div className="mb-6">
            <UserInitials size="xl" name={user?.name} />
          </div>

          {/* User Name */}
          <h2 className="text-3xl font-semibold mb-16">{user?.name}</h2>

          {/* Navigation Links */}
          <nav className="w-full space-y-6">
            <Link
              to="/connections"
              onClick={handleLinkClick}
              className="flex items-center gap-3 text-lg hover:text-accent-foreground transition-colors"
            >
              <Users className="h-5 w-5" />
              Connections
            </Link>
            <Link
              to="/events"
              className="flex items-center gap-3 text-lg hover:text-accent-foreground transition-colors"
              onClick={handleLinkClick}
            >
              <Calendar className="h-5 w-5" />
              Events
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 text-lg w-full text-left"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </nav>
          <div className="flex flex-wrap gap-2">
            <div className="h-20 w-20 rounded-full bg-background text-xs text-foreground flex justify-center items-center">
              background
              <br />
              foreground
            </div>
            <div className="h-20 w-20 rounded-full bg-card text-card-foreground text-xs flex justify-center items-center">
              card
            </div>
            <div className="h-20 w-20 rounded-full bg-popover text-popover-foreground text-xs flex justify-center items-center">
              popover
            </div>
            <div className="h-20 w-20 rounded-full bg-primary text-primary-foreground text-xs flex justify-center items-center">
              primary
            </div>
            <div className="h-20 w-20 rounded-full bg-secondary text-secondary-foreground text-xs flex justify-center items-center">
              secondary
            </div>
            <div className="h-20 w-20 rounded-full bg-muted text-muted-foreground text-xs flex justify-center items-center">
              muted
            </div>
            <div className="h-20 w-20 rounded-full bg-accent text-accent-foreground text-xs flex justify-center items-center">
              accent
            </div>
            <div className="h-20 w-20 rounded-full bg-destructive text-destructive-foreground text-xs flex justify-center items-center">
              destructive
            </div>
            <div className="h-20 w-20 rounded-full bg-input text-xs flex justify-center items-center">
              input
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavMobile;
