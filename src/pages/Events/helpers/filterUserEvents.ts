import { Event, User } from "../../../types/globalTypes";

export const filterUserEvents = (
  events: Event[],
  user: User | null | undefined
): Event[] => {
  if (!user || !events?.length) return events || [];

  return events.filter((event) => {
    if (event.createdBy._id === user._id) return true;

    const connection = user.connections.find(
      (conn) => conn._id === event.createdBy._id
    );

    return !connection?.hideEvents;
  });
};
