import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import queryKeys from "@/tanstackQuery/queryKeys";

import useUser from "../../../hooks/user/useUser";

const useGetPastMonthEvents = () => {
  const api = useAxios();
  const { user } = useUser();

  const getPastMonthEvents = async () => {
    const { data } = await api.get("/events/pastMonth", {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });

    return data;
  };

  console.log("Hook", getPastMonthEvents());

  const {
    data: eventsPastMonth = [],
    isFetching: fetchingEvents,
    isError: errorFetchingEvents,
  } = useQuery({
    queryKey: [queryKeys.eventsPastMonth],
    queryFn: getPastMonthEvents,
  });

  return {
    eventsPastMonth,
    fetchingEvents,
    errorFetchingEvents,
  };
};

export default useGetPastMonthEvents;
