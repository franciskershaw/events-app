import { ReactNode } from "react";

import { BrowserRouter, MemoryRouter } from "react-router-dom";

/**
 * A test router wrapper that includes the future flags to prevent warnings
 * in tests. This matches the configuration used in App.tsx.
 */
export const TestRouter = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      {children}
    </BrowserRouter>
  );
};

// Custom test router with future flags to avoid warnings
export const TestMemoryRouter = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <MemoryRouter
    future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}
  >
    {children}
  </MemoryRouter>
);
