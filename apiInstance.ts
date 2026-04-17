import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE = process.env.EXPO_PUBLIC_S_TO_S_API_BASE;

type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
  auth?: boolean;
  body?: any;
  headers?: HeadersInit; // ✅ keep flexible
};

const normalizeHeaders = (headers?: HeadersInit): Record<string, string> => {
  if (!headers) return {};

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return headers; // already Record<string, string>
};

export const apiRequest = async (
  endpoint: string,
  options: RequestOptions = {},
) => {
  const { auth = false, body, headers: customHeaders, ...rest } = options;

  let finalBody: any;

  // ✅ Normalize headers first
  const headers: Record<string, string> = {
    accept: "application/json",
    ...normalizeHeaders(customHeaders),
  };

  // ✅ Handle body types
  if (body instanceof FormData) {
    finalBody = body;
  } else if (
    body &&
    typeof body === "object" &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer)
  ) {
    finalBody = JSON.stringify(body);
    headers["Content-Type"] = "application/json";
  } else {
    finalBody = body;
  }

  // ✅ Auth
  if (auth) {
    const token = await AsyncStorage.getItem("t");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...rest,
      headers,
      body: finalBody,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw data || { message: "Something went wrong" };
    }

    return data;
  } catch (error: any) {
    throw error?.message ? error : { message: "Network error" };
  }
};
