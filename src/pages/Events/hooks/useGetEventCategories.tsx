import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";
import { EventCategory } from "@/types/globalTypes";

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
    useQuery<EventCategory[]>({
      queryKey: [queryKeys.eventCategories],
      queryFn: getEventCategories,
    });

  const eventCategorySelectOptions = useMemo(() => {
    return eventCategories.map((category) => ({
      label: category.name,
      value: category._id,
    }));
  }, [eventCategories]);

  return {
    eventCategories,
    eventCategorySelectOptions,
    fetchingEventCategories,
  };
};

export default useGetEventCategories;
