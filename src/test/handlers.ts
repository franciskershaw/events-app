import { http, HttpResponse } from "msw";

import { Event } from "@/types/globalTypes";

// Define your API mocks
export const handlers = [
  http.get("/api/events", () => {
    return HttpResponse.json([
      { id: 1, title: "Event 1", date: "2023-10-01" },
      { id: 2, title: "Event 2", date: "2023-10-15" },
    ]);
  }),

  http.post("/api/events", async ({ request }) => {
    const newEvent = (await request.json()) as Event;
    return HttpResponse.json({ ...newEvent, id: 3 }, { status: 201 });
  }),

  // Add more API mocks as needed
];
