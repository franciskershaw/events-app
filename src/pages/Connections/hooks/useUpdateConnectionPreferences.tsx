import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import useAxios from "@/hooks/axios/useAxios";
import useUser from "@/hooks/user/useUser";
import queryKeys from "@/tanstackQuery/queryKeys";

const useUpdateConnectionPreferences = () => {
  const queryClient = useQueryClient();
  const api = useAxios();
  const { user } = useUser();

  const updateConnectionVisibility = async ({
    connectionId,
    hideEvents,
  }: {
    connectionId: string;
    hideEvents: boolean;
  }) => {
    const { data } = await api.patch(
      `/users/connections/${connectionId}/preferences`,
      {
        hideEvents,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      }
    );
    return data;
  };

  return useMutation({
    mutationFn: updateConnectionVisibility,
    onSuccess: (response: { _id: string; hideEvents: boolean }) => {
      queryClient.setQueryData([queryKeys.user], (oldData: typeof user) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          connections: oldData.connections.map((connection) =>
            connection._id === response._id
              ? { ...connection, hideEvents: response.hideEvents }
              : connection
          ),
        };
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(error.response?.data?.message || error.message);
    },
  });
};

export default useUpdateConnectionPreferences;
