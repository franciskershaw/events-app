import { useState } from "react";

import { FaPlus } from "react-icons/fa";
import { Outlet, useLocation } from "react-router-dom";

import Hamburger from "@/components/layout/navigation/Hamburger/Hamburger";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useModals } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";
import AddEventModal from "@/pages/Events/components/AddEventModal";
import DeleteEventModal from "@/pages/Events/components/DeleteEventModal";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { openEventModal } = useModals();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const isEventsPage = location.pathname === "/events";

  return (
    <>
      {!isEventsPage && (
        <div
          className="fixed top-4 right-4 z-50"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Hamburger />
        </div>
      )}
      <main className="mt-[84px] bg-white min-h-screen relative">
        {children}
      </main>
      <Button
        size="round"
        onClick={() => openEventModal()}
        className="fixed bottom-2 right-4 z-50 h-14 w-14 shadow-lg"
      >
        <FaPlus className="h-5 w-5" />
      </Button>
    </>
  );
};

const UnauthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return <main>{children}</main>;
};

const SharedLayout = () => {
  const { user, fetchingUser } = useUser();

  if (fetchingUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
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
        </>
      )}
    </div>
  );
};

export default SharedLayout;
