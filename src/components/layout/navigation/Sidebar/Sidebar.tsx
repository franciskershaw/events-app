import { LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";

import UserInitials from "@/components/user/UserInitials/UserInitials";
import { useSidebar } from "@/contexts/Sidebar/SidebarContext";
import useUser from "@/hooks/user/useUser";
import useAuth from "@/pages/Auth/hooks/useAuth";

const Sidebar = () => {
  const { isExpanded } = useSidebar();
  const location = useLocation();
  const isEventsPage = location.pathname === "/events";
  const { user } = useUser();
  const { logout } = useAuth();

  if (!isEventsPage) return null;

  return (
    <div
      className={`fixed top-0 left-0 h-full w-full bg-primary text-primary-foreground transform ${
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
          {/* <Link
            to="/connections"
            className="flex items-center gap-3 text-lg hover:text-accent-foreground transition-colors"
          >
            <Users className="h-5 w-5" />
            Connections
          </Link>
          <Link
            to="/config"
            className="flex items-center gap-3 text-lg hover:text-accent-foreground transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link> */}
          <button
            onClick={logout}
            className="flex items-center gap-3 text-lg hover:text-accent-foreground transition-colors w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
