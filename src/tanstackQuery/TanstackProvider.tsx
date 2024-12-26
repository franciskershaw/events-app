import { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const TanstackProvider = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default TanstackProvider;
