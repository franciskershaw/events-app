// import useAuth from "../../../pages/Auth/hooks/useAuth";
import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import useUser from "@/hooks/user/useUser";
import AddEventModal from "@/pages/Events/components/AddEventModal";
import DeleteEventModal from "@/pages/Events/components/DeleteEventModal";

import NavbarBottom from "../navigation/NavbarBottom/NavbarBottom";
import NavbarTop from "../navigation/NavbarTop/NavbarTop";

const SharedLayout = () => {
  // const { logout } = useAuth();
  const { user } = useUser();

  return (
    <>
      <div className="min-h-screen">
        {user ? (
          <>
            <NavbarTop />
            <main className="mt-[84px]">
              <Outlet />
            </main>
            <NavbarBottom />
          </>
        ) : (
          <main>
            <Outlet />
          </main>
        )}
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
