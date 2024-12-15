import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

import { EventFormValues } from "../components/AddEventForm";

const useAddEvent = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const transformValues = (values: EventFormValues) => ({
    title: values.title,
    date: {
      start: values.datetime,
      end: values.endDatetime || values.datetime,
    },
    location: {
      venue: values.venue,
      city: values.city,
    },
    description: values.description,
    category: values.category,
  });

  const addEvent = async (values: EventFormValues) => {
    const transformedValues = transformValues(values);
    const { data } = await api.post("/events", transformedValues, {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    return data;
  };

  return useMutation({
    mutationFn: addEvent,
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.error(`${error.message}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.success("Event added successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
  });
};

export default useAddEvent;
