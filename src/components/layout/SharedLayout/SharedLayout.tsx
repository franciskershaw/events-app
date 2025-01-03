import { FaPlus } from "react-icons/fa";
import { Outlet } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useModals } from "@/contexts/Modals/ModalsContext";
import useUser from "@/hooks/user/useUser";
import AddEventModal from "@/pages/Events/components/AddEventModal";
import DeleteEventModal from "@/pages/Events/components/DeleteEventModal";

// import NavbarBottom from "../navigation/NavbarBottom/NavbarBottom";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  const { openEventModal } = useModals();

  return (
    <>
      <main className="mt-[84px] bg-white min-h-screen relative">
        {children}
      </main>
      {/* <NavbarBottom /> */}
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
