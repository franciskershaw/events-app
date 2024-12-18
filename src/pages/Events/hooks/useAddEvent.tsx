import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

import { EventFormValues } from "../components/AddEventForm";
import { transformEventFormValues } from "../helper/helper";

const useAddEvent = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const addEvent = async (values: EventFormValues) => {
    const transformedValues = transformEventFormValues(values);

    const { data } = await api.post("/events", transformedValues, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    return data;
  };

  return useMutation({
    mutationFn: addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.success("Event added successfully");
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.error(`${error.message}`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
  });
};

export default useAddEvent;
