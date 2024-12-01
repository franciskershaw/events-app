import useAxios from "@/axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import useUser from "../../../hooks/user/useUser";

const useGetEvents = (type = "future") => {
  const api = useAxios();
  const { user } = useUser();

  const getEvents = async () => {
    if (!user?.accessToken) {
      throw new Error("User is not authenticated");
    }

    try {
      const endpoint = type === "past" ? "/events/past" : "/events";

      const res = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });

      console.log("API Response:", res);

      if (Array.isArray(res.data)) {
        return res.data; // Future events: array is directly in res.data
      } else if (res.data.events) {
        return res.data.events; // Past events: array is in res.data.events
      }

      throw new Error("Unexpected API response structure");
    } catch (error) {
      console.error("Error fetching events:", error);
      throw error;
    }
  };

  const {
    data: events = [],
    isFetching: fetchingEvents,
    isError: errorFetchingEvents,
  } = useQuery({
    queryKey: ["events", type],
    queryFn: getEvents,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const sortedEvents = [...events].sort((a, b) =>
    dayjs(a.date.start).isBefore(dayjs(b.date.start)) ? -1 : 1
  );

  return {
    events: sortedEvents,
    fetchingEvents,
    errorFetchingEvents,
  };
};

export default useGetEvents;
