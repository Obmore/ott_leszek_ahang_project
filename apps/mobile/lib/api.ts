/**
 * OttLeszek — API client. Base URL from env or default localhost.
 */

import Constants from "expo-constants";

const getBaseUrl = (): string => {
  const env = Constants.expoConfig?.extra ?? {};
  return (env.apiUrl as string) ?? "http://localhost:3000";
};

export const api = {
  baseUrl: getBaseUrl(),

  async request<T>(
    path: string,
    options: RequestInit & { token?: string } = {},
  ): Promise<T> {
    const { token, ...init } = options;
    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(url, { ...init, headers });
    if (res.status === 204) return undefined as T;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        (data as { error?: string }).error ?? `HTTP ${res.status}`,
      );
    }
    return data as T;
  },
};

export type Plan = {
  id: string;
  userId: string;
  title: string;
  steps: PlanStep[];
  createdAt: string;
  updatedAt: string;
};

export type PlanStep = {
  id: string;
  planId: string;
  orderIndex: number;
  title: string;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
};
