import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { INVALID_ACCESS_TOKEN } from "@/constants/api";
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

  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  const addSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  const notifySubscribers = (newToken: string) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        error.response.data.errorCode === INVALID_ACCESS_TOKEN
      ) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            addSubscriber((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;
        try {
          const { data } = await api.get("/auth/refresh-token");
          const newAccessToken = data.accessToken;

          queryClient.setQueryData<User>([queryKeys.user], (oldData) => {
            if (!oldData) return oldData;
            return { ...oldData, accessToken: newAccessToken };
          });

          notifySubscribers(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          toast.info("Session expired, please log in again.");
          queryClient.setQueryData([queryKeys.user], null);
          navigate("/");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default useAxios;
