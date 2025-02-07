import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import queryKeys from "@/tanstackQuery/queryKeys";
import { Event } from "@/types/globalTypes";

import useUser from "../../../hooks/user/useUser";

const useGetEvents = () => {
  const api = useAxios();
  const { user } = useUser();

  const getEvents = async () => {
    const { data } = await api.get("/events", {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });

    // Filter out events from connections with hideEvents: true
    const filteredEvents = data.filter((event: Event) => {
      const connection = user?.connections.find(
        (conn) => conn._id === event.createdBy._id
      );
      return !connection || !connection.hideEvents;
    });

    return filteredEvents;
  };

  const {
    data: events = [],
    isFetching: fetchingEvents,
    isError: errorFetchingEvents,
  } = useQuery({
    queryKey: [queryKeys.events],
    queryFn: getEvents,
  });

  return {
    events,
    fetchingEvents,
    errorFetchingEvents,
  };
};

export default useGetEvents;
