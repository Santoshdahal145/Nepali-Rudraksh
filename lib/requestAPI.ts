import { toast } from "sonner";

type MethodType = "post" | "get" | "put" | "patch" | "delete";

type ParamsType = {
    page?: number;
    limit?: number;
    [key: string]: unknown;
};

export type ApiRequestType = {
    route: string;
    method: MethodType;
    payload?: unknown;
    params?: ParamsType;
    showToast?: boolean;
    successMessage?: string;
};

export type ApiResponse<T = unknown> = {
    ok: boolean;
    status: number;
    data: T | null;
    message?: string;
};

export class ApiError extends Error {
    public readonly status: number;
    public readonly data: unknown;

    constructor(message: string, status: number, data?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.data = data;
    }
}

export const requestAPI = async <T = unknown>({
    route,
    method,
    payload,
    params,
    showToast = true,
    successMessage,
}: ApiRequestType): Promise<ApiResponse<T>> => {
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
    }

    const query = params
        ? new URLSearchParams(
            Object.entries(params)
                .filter(([, value]) => value !== undefined && value !== null)
                .map(([key, value]) => [key, String(value)])
        ).toString()
        : "";


    const cleanRoute = route.startsWith("/") ? route : `/${route}`;
    const url = `${apiUrl}/api${cleanRoute}${query ? `?${query}` : ""}`;


    const isPayloadAllowed = !["get", "head"].includes(method.toLowerCase());

    let response: Response;

    try {
        response = await fetch(url, {
            method: method.toUpperCase(),
            headers: {
                "Content-Type": "application/json",
            },
            body: isPayloadAllowed && payload !== undefined ? JSON.stringify(payload) : undefined,
        });
    } catch (err) {
        const networkErrorMessage = err instanceof Error ? err.message : "Network request failed";
        if (showToast) toast.error(networkErrorMessage);
        throw new ApiError(networkErrorMessage, 0);
    }

    const data = await response.json().catch(() => null);


    const errorMessage =
        (data && typeof data === "object" && "message" in data && typeof data.message === "string" && data.message) ||
        (data && typeof data === "object" && "error" in data && typeof data.error === "string" && data.error) ||
        response.statusText ||
        "An unexpected error occurred";

    if (!response.ok) {
        if (showToast) toast.error(errorMessage);
        throw new ApiError(errorMessage, response.status, data);
    }

    if (showToast && successMessage) {
        toast.success(successMessage);
    }

    return {
        ok: true,
        status: response.status,
        data: data as T,
        message: successMessage,
    };
};