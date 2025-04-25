import React, { createContext, useContext, useState } from "react";

export interface SidebarContentContextType {
  sidebarContent: "events" | "search";
  setSidebarContent: (content: "events" | "search") => void;
  sidebarOpenNavClick: boolean;
  setSidebarOpenNavClick: (open: boolean) => void;
}

const SidebarContentContext = createContext<
  SidebarContentContextType | undefined
>(undefined);

export const useSidebarContent = () => {
  const context = useContext(SidebarContentContext);
  if (!context) {
    throw new Error(
      "useSidebarContent must be used within a SidebarContentProvider."
    );
  }
  return context;
};

export const SidebarContentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sidebarContent, setSidebarContent] = useState<"events" | "search">(
    "events"
  );
  const [sidebarOpenNavClick, _setSidebarOpenNavClick] = useState(false);

  const setSidebarOpenNavClick = (open: boolean) => {
    _setSidebarOpenNavClick(open);
    if (open) {
      const timer = setTimeout(() => _setSidebarOpenNavClick(false), 100);
      return () => clearTimeout(timer);
    }
  };

  return (
    <SidebarContentContext.Provider
      value={{
        sidebarContent,
        setSidebarContent,
        sidebarOpenNavClick,
        setSidebarOpenNavClick,
      }}
    >
      {children}
    </SidebarContentContext.Provider>
  );
};
