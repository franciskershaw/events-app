import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

const SharedLayout = () => {
  return (
    <div className="min-h-screen">
      <main>
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default SharedLayout;
