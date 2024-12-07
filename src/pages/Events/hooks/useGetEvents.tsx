import { useQuery } from "@tanstack/react-query";

import useAxios from "@/axios/useAxios";
import queryKeys from "@/tanstackQuery/queryKeys";

import useUser from "../../../hooks/user/useUser";

const useGetEvents = () => {
  const api = useAxios();
  const { user } = useUser();

  const getEvents = async () => {
    if (!user?.accessToken) {
      throw new Error("User is not authenticated");
    }

    const res = await api.get("/events", {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });

    return res.data;
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
