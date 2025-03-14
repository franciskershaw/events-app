import { http, HttpResponse } from "msw";

import { Event } from "@/types/globalTypes";

// Define your API mocks
export const handlers = [
  // Auth endpoints
  http.post("/auth/login", async ({ request }) => {
    const credentials = (await request.json()) as {
      email: string;
      password: string;
    };
    return HttpResponse.json({
      _id: "user123",
      name: "Test User",
      email: credentials.email,
      accessToken: "mock-access-token",
      connections: [],
    });
  }),

  http.post("/auth/register", async ({ request }) => {
    const userData = (await request.json()) as {
      name: string;
      email: string;
      password: string;
    };
    return HttpResponse.json({
      _id: "user123",
      name: userData.name,
      email: userData.email,
      accessToken: "mock-access-token",
      connections: [],
    });
  }),

  http.post("/auth/logout", () => {
    return HttpResponse.json({ success: true });
  }),

  http.get("/auth/refresh-token", () => {
    return HttpResponse.json({
      accessToken: "mock-refreshed-token",
    });
  }),

  // User endpoints
  http.get("/users", () => {
    return HttpResponse.json({
      _id: "user123",
      name: "Test User",
      email: "user@example.com",
      connections: [
        {
          _id: "conn1",
          name: "Connection 1",
          email: "conn1@example.com",
          hideEvents: false,
        },
        {
          _id: "conn2",
          name: "Connection 2",
          email: "conn2@example.com",
          hideEvents: true,
        },
      ],
      connectionId: "connect-with-me-123",
    });
  }),

  http.post("/users/connections", () => {
    return HttpResponse.json({
      _id: "conn3",
      name: "New Connection",
      email: "new.connection@example.com",
      hideEvents: false,
    });
  }),

  http.post("/users/connection-id", () => {
    return HttpResponse.json("new-connection-id-456");
  }),

  http.delete("/users/connections/:id", ({ params }) => {
    return HttpResponse.json({ _id: params.id, success: true });
  }),

  http.patch(
    "/users/connections/:connectionId/preferences",
    async ({ params, request }) => {
      const data = (await request.json()) as { hideEvents: boolean };
      return HttpResponse.json({
        _id: params.connectionId,
        hideEvents: data.hideEvents,
      });
    }
  ),

  // Event endpoints
  http.get("/events", () => {
    return HttpResponse.json([
      {
        _id: "event1",
        title: "Event 1",
        date: "2023-10-01",
        description: "First event",
        category: { _id: "cat1", name: "Social" },
        private: false,
        unConfirmed: false,
        userId: "user123",
      },
      {
        _id: "event2",
        title: "Event 2",
        date: "2023-10-15",
        description: "Second event",
        category: { _id: "cat2", name: "Work" },
        private: true,
        unConfirmed: true,
        userId: "user123",
      },
    ]);
  }),

  http.post("/events", async ({ request }) => {
    const newEvent = (await request.json()) as Event;
    return HttpResponse.json({
      ...newEvent,
      _id: "new-event-123",
    });
  }),

  http.put("/events/:id", async ({ params, request }) => {
    const updates = (await request.json()) as Event;
    return HttpResponse.json({
      ...updates,
      _id: params.id,
    });
  }),

  http.delete("/events/:id", ({ params }) => {
    return HttpResponse.json({ _id: params.id, success: true });
  }),

  http.get("/events/categories", () => {
    return HttpResponse.json([
      { _id: "cat1", name: "Social" },
      { _id: "cat2", name: "Work" },
      { _id: "cat3", name: "Family" },
      { _id: "cat4", name: "Health" },
    ]);
  }),

  http.patch("/events/:eventId/privacy", ({ params }) => {
    return HttpResponse.json({
      _id: params.eventId,
      private: true,
    });
  }),
];
