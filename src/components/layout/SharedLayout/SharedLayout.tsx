import { FaPlus } from "react-icons/fa";
import { Outlet, useLocation } from "react-router-dom";

import NavMobile from "@/components/layout/navigation/Nav/mobile/NavMobile";
import { Toaster } from "@/components/ui/sonner";
import { useModals } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";
import AddEventModal from "@/pages/Events/components/EventModals/AddEventModal";
import DeleteEventModal from "@/pages/Events/components/EventModals/DeleteEventModal";

import { useIsMobile } from "../../../hooks/use-mobile";
import ConnectionsModal from "../../../pages/Events/components/ConnectionsModal/ConnectionsModal";
import { Button } from "../../ui/button";
import { NavDesktop } from "../navigation/Nav/desktop/NavDesktop";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { openEventModal } = useModals();
  const location = useLocation();
  const isEventsPage = location.pathname === "/events";
  const isMobile = useIsMobile();

  return (
    <div className="relative flex min-h-screen">
      {isMobile ? (
        <>
          <NavMobile />
          <Button
            size="round"
            onClick={() => openEventModal()}
            className="fixed bottom-4 right-4 z-40 h-14 w-14 shadow-lg"
          >
            <FaPlus className="h-5 w-5" />
          </Button>
        </>
      ) : (
        <NavDesktop />
      )}

      <main
        className={`bg-white flex-grow ${isEventsPage && isMobile ? "mt-[84px] mb-4" : ""}`}
      >
        {children}
      </main>
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

  if (fetchingUser && !user) {
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
