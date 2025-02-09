import { FaPlus } from "react-icons/fa";
import { Outlet, useLocation } from "react-router-dom";

import Hamburger from "@/components/layout/navigation/Hamburger/Hamburger";
import Sidebar from "@/components/layout/navigation/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useModals } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";
import AddEventModal from "@/pages/Events/components/EventModals/AddEventModal";
import DeleteEventModal from "@/pages/Events/components/EventModals/DeleteEventModal";

import { useIsMobile } from "../../../hooks/use-mobile";
import ConnectionsModal from "../../../pages/Events/components/ConnectionsModal/ConnectionsModal";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { openEventModal } = useModals();
  const location = useLocation();
  const isEventsPage = location.pathname === "/events";
  const isMobile = useIsMobile();

  return (
    <div className="relative">
      <Sidebar />
      {(!isEventsPage || !isMobile) && (
        <div
          className={`fixed ${isMobile ? "top-4 right-4" : "top-2 right-2"} z-50`}
        >
          <Hamburger />
        </div>
      )}
      <div className="min-h-screen flex flex-col">
        <main
          className={`bg-white flex-grow ${isEventsPage && isMobile ? "mt-[84px] mb-4" : ""}`}
        >
          {children}
        </main>
      </div>
      {isEventsPage && (
        <Button
          size="round"
          onClick={() => openEventModal()}
          className={`fixed ${isMobile ? "bottom-4 right-4" : "bottom-2 right-2"} z-30 h-14 w-14 shadow-lg`}
        >
          <FaPlus className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

const UnauthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <main>{children} hello</main>
    </div>
  );
};

const SharedLayout = () => {
  const { user, fetchingUser } = useUser();

  if (fetchingUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user ? (
        <AuthenticatedLayout>
          <Outlet />
        </AuthenticatedLayout>
      ) : (
        <UnauthenticatedLayout>
          <Outlet />
        </UnauthenticatedLayout>
      )}

      <Toaster />

      {user && (
        <>
          <AddEventModal />
          <DeleteEventModal />
          <ConnectionsModal />
        </>
      )}
    </>
  );
};

export default SharedLayout;
