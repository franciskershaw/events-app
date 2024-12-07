import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
// import useAuth from "../../../pages/Auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import AddEventModal from "@/pages/Events/components/AddEventModal";
import { useModals } from "@/contexts/ModalsContext";

const SharedLayout = () => {
  // const { logout } = useAuth();
  const { openEventModal, isEventModalOpen, closeModal, selectedEvent } =
    useModals();
  return (
    <>
      <div className="min-h-screen">
        {/* <nav className="box fixed top-0 left-0 right-0 bg-white">
        <Button onClick={logout}>Logout</Button>
      </nav> */}
        <main className="p-4">
          <Outlet />
        </main>
        {/* <nav className="box fixed bottom-0 left-0 right-0 bg-white">
        Bottom nav
      </nav> */}
        <Button onClick={() => openEventModal()}>Add event</Button>
        <Toaster />
      </div>
      <AddEventModal
        open={isEventModalOpen}
        onOpenChange={(open) =>
          open && selectedEvent ? openEventModal(selectedEvent) : closeModal()
        }
        closeModal={closeModal}
      />
    </>
  );
};

export default SharedLayout;
