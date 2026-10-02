import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface User {
  id: number;
  email: string;
  credits: number;
  apiKeys?: ApiKey[];
  onrampTransactions?: OnrampTransaction[];
  conversations?: unknown[];
}

export interface ApiKey {
  id: number;
  userId: number;
  name: string;
  apiKey: string;
  disabled: boolean;
  deleted: boolean;
  lastUsed: string | null;
  creditsConsumed: number;
  credisConsumed?: number;
}

export interface Company {
  id: number;
  name: string;
  website: string;
}

export interface Provider {
  id: number;
  name: string;
  website: string;
}

export interface ModelProviderMapping {
  id: number;
  modelId: number;
  providerId: number;
  inputTokenCost: number;
  outputTokenCost: number;
  provider?: Provider;
}

export interface AIModel {
  id: number;
  name: string;
  slug: string;
  companyId: number;
  company?: Company;
  modelProviderMappings?: ModelProviderMapping[];
}

export interface OnrampTransaction {
  id: number;
  userId: number;
  amount: number;
  status: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const API_BASE = "/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401 && !endpoint.includes("/auth/signin") && !endpoint.includes("/auth/signup")) {
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path !== "/" && !path.includes("/signin") && !path.includes("/signup")) {
          window.location.href = "/signin";
        }
      }
    }
    const errorMessage =
      typeof data === "object" && data !== null && "message" in data
        ? (data as { message: string }).message
        : response.statusText || "An unexpected error occurred";
    throw new ApiError(errorMessage, response.status);
  }

  return data as T;
}

export const authApi = {
  signup: (payload: { email: string; password: string }) =>
    request<{ message: string; id: string }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  signin: (payload: { email: string; password: string }) =>
    request<{ message: string }>("/auth/signin", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
    }),

  getProfile: () => request<User>("/auth/profile"),
};

export const apiKeyApi = {
  getApiKeys: () => request<{ apiKeys: ApiKey[] }>("/api-keys"),

  createApiKey: (payload: { name: string }) =>
    request<ApiKey>("/api-keys", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateApiKey: (payload: { id: number; disabled: boolean }) =>
    request<{ message: string }>("/api-keys", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteApiKey: (id: number) =>
    request<{ message: string }>(`/api-keys/${id}`, {
      method: "DELETE",
    }),
};

export const modelsApi = {
  getModels: () => request<{ models: AIModel[] }>("/models"),
  getProviders: () => request<{ providers: Provider[] }>("/models/providers"),
  getModelProviders: (modelId: number) =>
    request<{ providers: Provider[] }>(`/models/${modelId}/providers`),
};

export const paymentsApi = {
  onramp: (payload?: { amount?: number }) =>
    request<{ message: string; credits: number; amount: number }>("/payments/onramp", {
      method: "POST",
      body: JSON.stringify(payload || {}),
    }),
  getHistory: () =>
    request<{ transactions: OnrampTransaction[] }>("/payments/history"),
};

export function useProfile() {
  return useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authApi.getProfile,
    retry: false,
    staleTime: 2000,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

export function useTransactions() {
  return useQuery({
    queryKey: ["payments", "history"],
    queryFn: paymentsApi.getHistory,
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });
}

export function useApiKeys() {
  return useQuery({
    queryKey: ["api-keys"],
    queryFn: apiKeyApi.getApiKeys,
    staleTime: 2000,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

export function useModels() {
  return useQuery({
    queryKey: ["models"],
    queryFn: modelsApi.getModels,
    staleTime: 1000 * 60 * 10,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.signin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] });
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear();
      window.location.href = "/signin";
    },
  });
}

export function useCreateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiKeyApi.createApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });
}

export function useUpdateApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiKeyApi.updateApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

export function useDeleteApiKey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: apiKeyApi.deleteApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
    },
  });
}

export function useOnramp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.onramp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["payments", "history"] });
    },
  });
}
