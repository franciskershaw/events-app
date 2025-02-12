import React, { createContext, useContext, useState } from "react";

interface SidebarContentContextType {
  sidebarContent: "events" | "search";
  setSidebarContent: (content: "events" | "search") => void;
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

  return (
    <SidebarContentContext.Provider
      value={{ sidebarContent, setSidebarContent }}
    >
      {children}
    </SidebarContentContext.Provider>
  );
};
