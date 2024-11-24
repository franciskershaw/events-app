import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";
import useAuth from "../../../pages/Auth/hooks/useAuth";

const SharedLayout = () => {
  const { logout } = useAuth();

  return (
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
      <Toaster />
    </div>
  );
};

export default SharedLayout;
