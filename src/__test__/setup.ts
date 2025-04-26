import "@testing-library/jest-dom";

import { cleanup } from "@testing-library/react";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll } from "vitest";

import { handlers } from "./handlers";

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
});

// Set up MSW server
const server = setupServer(...handlers);

beforeAll(() =>
  server.listen({
    onUnhandledRequest: ({ method, url }) => {
      // @ts-expect-error - url is a string in the test environment
      if (!url.pathname.startsWith("/api")) {
        throw new Error(`Unhandled ${method} request to ${url}`);
      }
    },
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
