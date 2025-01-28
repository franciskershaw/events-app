import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import useUser from "@/hooks/user/useUser";
import AddEventModal from "@/pages/Events/components/EventModals/AddEventModal";
import DeleteEventModal from "@/pages/Events/components/EventModals/DeleteEventModal";

import { useViewport } from "../../../contexts/Viewport/ViewportContext";
import {
  AuthenticatedLayoutDesktop,
  UnauthenticatedLayoutDesktop,
} from "./desktop/SharedLayoutDesktop";
import {
  AuthenticatedLayoutMobile,
  UnauthenticatedLayoutMobile,
} from "./mobile/SharedLayoutMobile";

const SharedLayout = () => {
  const { isMobile } = useViewport();
  const { user, fetchingUser } = useUser();

  if (fetchingUser) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isMobile ? (
        user ? (
          <AuthenticatedLayoutMobile>
            <Outlet />
          </AuthenticatedLayoutMobile>
        ) : (
          <UnauthenticatedLayoutMobile>
            <Outlet />
          </UnauthenticatedLayoutMobile>
        )
      ) : user ? (
        <AuthenticatedLayoutDesktop>
          <Outlet />
        </AuthenticatedLayoutDesktop>
      ) : (
        <UnauthenticatedLayoutDesktop>
          <Outlet />
        </UnauthenticatedLayoutDesktop>
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
