import { Outlet } from "react-router-dom";

// import useAuth from "../../../pages/Auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useModals } from "@/contexts/ModalsContext";
import useUser from "@/hooks/user/useUser";
import AddEventModal from "@/pages/Events/components/AddEventModal";
import DeleteEventModal from "@/pages/Events/components/DeleteEventModal";

const SharedLayout = () => {
  // const { logout } = useAuth();
  const { openEventModal } = useModals();
  const { user } = useUser();
  return (
    <>
      <div className="min-h-screen">
        {/* <nav className="box fixed top-0 left-0 right-0 bg-white">
        <Button onClick={logout}>Logout</Button>
      </nav> */}
        <main>
          <Outlet />
        </main>
        {/* <nav className="box fixed bottom-0 left-0 right-0 bg-white">
        Bottom nav
      </nav> */}
        {user && <Button onClick={() => openEventModal()}>Add event</Button>}
        <Toaster />
      </div>

      {user && (
        <>
          <AddEventModal />
          <DeleteEventModal />
        </>
      )}
    </>
  );
};

export default SharedLayout;
