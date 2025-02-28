import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import { useModals } from "@/contexts/Modals/ModalsContext";
import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

import { transformEventFormValues } from "../helpers/helpers";
import { EventFormValues } from "./useEventForm";

const useAddEvent = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();
  const { closeModal } = useModals();

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
      closeModal();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
      toast.error(error.response?.data?.message || error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.events] });
    },
  });
};

export default useAddEvent;
