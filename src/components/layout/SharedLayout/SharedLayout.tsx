import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import useUser from "@/hooks/user/useUser";
import AddEventModal from "@/pages/Events/components/AddEventModal";
import DeleteEventModal from "@/pages/Events/components/DeleteEventModal";

import NavbarBottom from "../navigation/NavbarBottom/NavbarBottom";
import NavbarTop from "../navigation/NavbarTop/NavbarTop";

const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavbarTop />
      <main className="mt-[84px] bg-white min-h-screen relative">
        {children}
        <div className="fixed bottom-0 left-0 right-0 h-[125px] bg-white" />
      </main>
      <NavbarBottom />
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
