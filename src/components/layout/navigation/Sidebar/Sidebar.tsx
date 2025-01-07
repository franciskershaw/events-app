import { useLocation } from "react-router-dom";

import { useSidebar } from "@/contexts/Sidebar/SidebarContext";

const Sidebar = () => {
  const { isExpanded } = useSidebar();
  const location = useLocation();
  const isEventsPage = location.pathname === "/events";

  if (!isEventsPage) return null;

  return (
    <div
      className={`fixed top-0 left-0 h-full w-full bg-primary text-primary-foreground transform ${
        isExpanded ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-500 ease-in-out z-40`}
    ></div>
  );
};

export default Sidebar;
