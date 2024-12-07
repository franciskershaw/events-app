import { useQuery } from "@tanstack/react-query";

import useAxios from "@/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useGetEventCategories = () => {
  const api = useAxios();
  const { user } = useUser();

  const getEventCategories = async () => {
    const res = await api.get("/events/categories", {
      headers: { Authorization: `Bearer ${user?.accessToken}` },
    });
    return res.data;
  };

  const { data: eventCategories = [], isFetching: fetchingEventCategories } =
    useQuery({
      queryKey: [queryKeys.eventCategories],
      queryFn: getEventCategories,
    });

  return {
    eventCategories,
    fetchingEventCategories,
  };
};

export default useGetEventCategories;
