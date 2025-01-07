import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { ModalsProvider } from "./contexts/Modals/ModalsContext.tsx";
import { SidebarProvider } from "./contexts/Sidebar/SidebarContext.tsx";
import TanstackProvider from "./tanstackQuery/TanstackProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackProvider>
      <ModalsProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ModalsProvider>
    </TanstackProvider>
  </StrictMode>
);
