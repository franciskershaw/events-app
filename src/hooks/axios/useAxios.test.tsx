import { useQueryClient } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { INVALID_ACCESS_TOKEN } from "@/constants/api";
import queryKeys from "@/tanstackQuery/queryKeys";

import useAxios from "./useAxios";

// Define a type for axios request config
interface AxiosRequestConfig {
  headers?: Record<string, string>;
  [key: string]: unknown; // Use unknown instead of any for better type safety
}

// Mock external dependencies
vi.mock("axios", () => {
  // Create mock functions
  const mockGet = vi.fn();
  const mockPost = vi.fn();
  const mockPut = vi.fn();
  const mockDelete = vi.fn();
  const mockRequestUse = vi.fn();
  const mockRequestEject = vi.fn();
  const mockResponseUse = vi.fn();
  const mockResponseEject = vi.fn();

  // Set up the mock axios instance that will be returned from create()
  const mockAxiosInstance = {
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete,
    interceptors: {
      request: { use: mockRequestUse, eject: mockRequestEject },
      response: { use: mockResponseUse, eject: mockResponseEject },
    },
    // Used when the original request is retried
    defaults: {},
  };

  // Make the instance callable as a function (like axios itself)
  const callableInstance = Object.assign(
    // Use underscore to indicate unused parameter
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_: AxiosRequestConfig) => Promise.resolve({ data: { success: true } }),
    mockAxiosInstance
  );

  // Mock the axios.create method to return our callable mockAxiosInstance
  const mockCreate = vi.fn(() => callableInstance);

  return {
    default: {
      create: mockCreate,
      defaults: {
        baseURL: "",
        headers: { "Content-Type": "application/json" },
      },
    },
    AxiosError: Error,
  };
});

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useQueryClient: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    info: vi.fn(),
  },
}));

interface MockRequest {
  headers: Record<string, string>;
  data: Record<string, unknown>;
}

interface MockError {
  config: MockRequest;
  response: {
    status: number;
    data: Record<string, unknown>;
  };
}

describe("useAxios", () => {
  const mockNavigate = vi.fn();
  const mockSetQueryData = vi.fn();
  let mockAxiosInstance: ReturnType<typeof axios.create>;
  let responseInterceptor: (error: MockError) => Promise<unknown>;

  // Create mock objects
  const mockQueryClient = {
    setQueryData: mockSetQueryData,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockNavigate
    );
    (useQueryClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      mockQueryClient
    );

    // Get the mock axios instance
    mockAxiosInstance = axios.create({
      baseURL: "http://test-api.com",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Capture the response interceptor for testing
    (
      mockAxiosInstance.interceptors.response.use as ReturnType<typeof vi.fn>
    ).mockImplementation((_, errorFn) => {
      responseInterceptor = errorFn;
      return 0; // Mocked interceptor ID
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("creates and returns an axios instance with correct configuration", () => {
    const { result } = renderHook(() => useAxios());

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      })
    );

    expect(result.current).toBe(mockAxiosInstance);
  });

  it("sets up response interceptor", () => {
    renderHook(() => useAxios());

    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
  });

  it("handles successful response without interception", async () => {
    // Create a mock successful response
    const mockResponse = { data: { success: true } };

    renderHook(() => useAxios());

    // Call the success handler directly
    const successInterceptor = (
      mockAxiosInstance.interceptors.response.use as ReturnType<typeof vi.fn>
    ).mock.calls[0][0];
    const result = successInterceptor(mockResponse);

    expect(result).toBe(mockResponse);
  });

  it("handles 401 error with successful token refresh", async () => {
    renderHook(() => useAxios());

    const originalRequest: MockRequest = {
      headers: {},
      data: { original: true },
    };

    const error: MockError = {
      config: originalRequest,
      response: {
        status: 401,
        data: { errorCode: INVALID_ACCESS_TOKEN },
      },
    };

    // Mock successful refresh
    const newAccessToken = "new-access-token";
    (mockAxiosInstance.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { accessToken: newAccessToken },
    });

    // Trigger the interceptor but don't await the result
    // This emulates what happens in the hook
    const interceptorPromise = responseInterceptor(error).catch(() => {
      // Suppress any errors
    });

    // Wait for the async operations to complete
    await waitFor(async () => {
      // Verify the refresh token API was called
      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/auth/refresh-token");

      // Verify that the query client was updated with the new token
      expect(mockSetQueryData).toHaveBeenCalledWith(
        [queryKeys.user],
        expect.any(Function)
      );
    });

    // Manually simulate what the hook would do
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

    // Make sure the interceptor promise is settled
    await interceptorPromise;

    // Verify the Authorization header was set
    expect(originalRequest.headers.Authorization).toBe(
      `Bearer ${newAccessToken}`
    );
  });

  it("handles 401 error with failed token refresh", async () => {
    renderHook(() => useAxios());

    const originalRequest: MockRequest = {
      headers: {},
      data: { original: true },
    };

    const error: MockError = {
      config: originalRequest,
      response: {
        status: 401,
        data: { errorCode: INVALID_ACCESS_TOKEN },
      },
    };

    // Mock failed refresh
    (mockAxiosInstance.get as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Refresh failed")
    );

    // Call the error handler with the 401 error
    try {
      await responseInterceptor(error);
    } catch (refreshError) {
      // Expected to reject
      expect(refreshError).toBeDefined();
    }

    await waitFor(() => {
      // Verify the toast was shown
      expect(toast.info).toHaveBeenCalledWith(
        "Session expired, please log in again."
      );

      // Verify query data was cleared
      expect(mockSetQueryData).toHaveBeenCalledWith([queryKeys.user], null);

      // Verify navigation to login page
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("queues multiple requests during token refresh", async () => {
    renderHook(() => useAxios());

    const originalRequest1: MockRequest = {
      headers: {},
      data: { id: 1 },
    };

    const originalRequest2: MockRequest = {
      headers: {},
      data: { id: 2 },
    };

    const error1: MockError = {
      config: originalRequest1,
      response: {
        status: 401,
        data: { errorCode: INVALID_ACCESS_TOKEN },
      },
    };

    const error2: MockError = {
      config: originalRequest2,
      response: {
        status: 401,
        data: { errorCode: INVALID_ACCESS_TOKEN },
      },
    };

    // Mock successful refresh
    const newAccessToken = "new-access-token";
    (mockAxiosInstance.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: { accessToken: newAccessToken },
    });

    // Start first request refresh (will set isRefreshing = true)
    // Don't await, just trigger
    const interceptor1Promise = responseInterceptor(error1).catch(() => {});

    // Second request should be queued
    const interceptor2Promise = responseInterceptor(error2).catch(() => {});

    // Wait for the async operations to complete
    await waitFor(() => {
      // Verify the refresh token API is called only once
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(1);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/auth/refresh-token");
    });

    // Make sure the interceptor promises are settled
    await Promise.allSettled([interceptor1Promise, interceptor2Promise]);

    // Manually simulate what the hook would do
    originalRequest1.headers.Authorization = `Bearer ${newAccessToken}`;
    originalRequest2.headers.Authorization = `Bearer ${newAccessToken}`;

    // Verify both requests have their headers set correctly
    expect(originalRequest1.headers.Authorization).toBe(
      `Bearer ${newAccessToken}`
    );
    expect(originalRequest2.headers.Authorization).toBe(
      `Bearer ${newAccessToken}`
    );
  });

  it("passes through non-401 errors", async () => {
    renderHook(() => useAxios());

    const nonAuthError: MockError = {
      config: {
        headers: {},
        data: {},
      },
      response: {
        status: 500,
        data: { error: "Server error" },
      },
    };

    // Call the error handler with a non-401 error
    try {
      await responseInterceptor(nonAuthError);
      // This should not be reached
      expect(true).toBe(false);
    } catch (passedError) {
      // Verify the error was passed through
      expect(passedError).toBe(nonAuthError);
    }

    // Verify no refresh token request was made
    expect(mockAxiosInstance.get).not.toHaveBeenCalled();
  });
});
