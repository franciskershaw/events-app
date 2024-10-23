import { useQueryClient } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import queryKeys from "@/tanstackQuery/queryKeys";
import { User } from "@/types/globalTypes";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const useAxios = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const api = axiosInstance;

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      if (
        error.response.status === 401 &&
        (error.response.data.errorCode === "SESSION_EXPIRED" ||
          error.response.data.errorCode === "INVALID_TOKEN")
      ) {
        try {
          const originalRequest = error.config;
          const response = await api.get("/auth/refresh-token");
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          queryClient.setQueryData<User>([queryKeys.user], (oldData) => {
            if (!oldData) {
              return oldData;
            }
            return {
              ...oldData,
              accessToken: response.data.accessToken,
            };
          });
          return api(originalRequest);
        } catch {
          toast.info("Session expired, please log in again.");
          queryClient.setQueryData([queryKeys.user], null);
          navigate("/");
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default useAxios;
