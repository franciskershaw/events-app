import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import useAxios from "@/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

interface EventFormValues {
  title: string;
  date: {
    start: Date;
    end?: Date;
  };
  location?: {
    venue?: string;
    city?: string;
  };
  description?: string;
  category: string;
}

const useAddEvent = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const addEvent = async (values: EventFormValues) => {
    const { data } = await api.post("/events", values, {
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
    mutationKey: ["addEvent"],
    onError: () => {
      toast.error("Failed to add event. Please try again.");
    },
  });
};

export default useAddEvent;
