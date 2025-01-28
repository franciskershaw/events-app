import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import useUser from "@/hooks/user/useUser";
import AddEventModal from "@/pages/Events/mobile/components/EventModals/AddEventModal";
import DeleteEventModal from "@/pages/Events/mobile/components/EventModals/DeleteEventModal";

import { useViewport } from "../../../contexts/Viewport/ViewportContext";
import { AuthenticatedLayoutDesktop } from "./desktop/SharedLayoutDesktop";
import { AuthenticatedLayoutMobile } from "./mobile/SharedLayoutMobile";

const UnauthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
};

const SharedLayout = () => {
  const { isMobile } = useViewport();
  const { user, fetchingUser } = useUser();

  if (fetchingUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user ? (
        isMobile ? (
          <AuthenticatedLayoutMobile>
            <Outlet />
          </AuthenticatedLayoutMobile>
        ) : (
          <AuthenticatedLayoutDesktop>
            <Outlet />
          </AuthenticatedLayoutDesktop>
        )
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
    </>
  );
};

export default SharedLayout;
