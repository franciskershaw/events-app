import { Calendar, LogOut, Users } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";
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

  // Reset scroll position when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLinkClick = () => {
    // Store current scroll position before toggling sidebar
    toggleSidebar();
  };

  const handleLogout = async () => {
    await logout();
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
              className="flex items-center gap-3 text-lg hover:underline transition-colors"
            >
              <Users className="h-5 w-5" />
              Connections
            </Link>
            <Link
              to="/events"
              className="flex items-center gap-3 text-lg hover:underline transition-colors"
              onClick={handleLinkClick}
            >
              <Calendar className="h-5 w-5" />
              Events
            </Link>
            <Button
              onClick={handleLogout}
              variant="naked"
              className="flex items-center gap-3 text-lg w-full text-left hover:underline"
              throttleClicks={true}
              throttleTime={5000}
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavMobile;
