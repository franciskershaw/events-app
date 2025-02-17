import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import queryKeys from "@/tanstackQuery/queryKeys";

import useUser from "../../../hooks/user/useUser";

const useGetEvents = () => {
  const api = useAxios();
  const { user } = useUser();

  const getEvents = async () => {
    const { data } = await api.get("/events", {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });

    return data;
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
