import { Outlet } from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

const SharedLayout = () => {
  return (
    <div className="min-h-screen">
      <nav className="box fixed top-0 left-0 right-0 bg-white">Top nav</nav>
      <main className="my-5">
        <Outlet />
      </main>
      <nav className="box fixed bottom-0 left-0 right-0 bg-white">
        Bottom nav
      </nav>
      <Toaster />
    </div>
  );
};

export default SharedLayout;
