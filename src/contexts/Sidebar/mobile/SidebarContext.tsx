import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface SidebarContextType {
  isExpanded: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollPositionRef = useRef(0);

  const toggleSidebar = () => setIsExpanded((prev) => !prev);
  const closeSidebar = () => setIsExpanded(false);

  // Handle body scroll locking with position restoration
  useEffect(() => {
    if (isExpanded) {
      // Store current scroll position before locking
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = "hidden";
      // Prevent content jump when locking scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = "100%";
    } else {
      // Restore scroll
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [isExpanded]);

  return (
    <SidebarContext.Provider
      value={{ isExpanded, toggleSidebar, closeSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
