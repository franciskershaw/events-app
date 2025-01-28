import { FaPlus } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import Hamburger from "@/components/layout/navigation/Hamburger/Hamburger";
import Sidebar from "@/components/layout/navigation/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { useModals } from "@/contexts/Modals/ModalsContext";

export const AuthenticatedLayoutMobile = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { openEventModal } = useModals();
  const location = useLocation();
  const isEventsPage = location.pathname === "/events";

  return (
    <div className="relative">
      <Sidebar />
      {!isEventsPage && (
        <div className="fixed top-4 right-4 z-50">
          <Hamburger />
        </div>
      )}
      <div className="min-h-screen flex flex-col">
        <main
          className={`bg-white flex-grow mb-4 ${isEventsPage ? "mt-[84px]" : ""}`}
        >
          {children}
        </main>
      </div>
      <Button
        size="round"
        onClick={() => openEventModal()}
        className="fixed bottom-2 right-4 z-30 h-14 w-14 shadow-lg"
      >
        <FaPlus className="h-5 w-5" />
      </Button>
    </div>
  );
};
