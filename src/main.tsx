import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import { ModalsProvider } from "./contexts/Modals/ModalsContext.tsx";
import { SidebarContentProvider } from "./contexts/Sidebar/desktop/SidebarContentContext.tsx";
import { SidebarProvider } from "./contexts/Sidebar/mobile/SidebarContext.tsx";
import TanstackProvider from "./tanstackQuery/TanstackProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackProvider>
      <ModalsProvider>
        <SidebarProvider>
          <SidebarContentProvider>
            <App />
          </SidebarContentProvider>
        </SidebarProvider>
      </ModalsProvider>
    </TanstackProvider>
  </StrictMode>
);
