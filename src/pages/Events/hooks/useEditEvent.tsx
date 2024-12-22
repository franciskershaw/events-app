import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

import { transformEventFormValues } from "../helper/helper";
import { EventFormValues } from "./useEventForm";

const useEditEvent = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const editEvent = async (values: EventFormValues) => {
    const transformedValues = transformEventFormValues(values);

    const { data } = await api.put(`/events/${values._id}`, transformedValues, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    return data;
  };

  return useMutation({
    mutationFn: editEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.success("Event edited successfully");
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.error(error.message);
    },
  });
};

export default useEditEvent;
