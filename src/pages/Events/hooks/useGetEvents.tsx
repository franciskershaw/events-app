import useAxios from "@/axios/useAxios";
import { useQuery } from "@tanstack/react-query";
import useUser from "../../../hooks/user/useUser";

const useGetEvents = () => {
  const api = useAxios();
  const { user, fetchingUser } = useUser();

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
    queryKey: ["events"],
    queryFn: getEvents,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    events,
    fetchingEvents,
    errorFetchingEvents,
  };
};

export default useGetEvents;