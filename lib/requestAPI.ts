type MethodType = "post" | "get" | "put" | "patch" | "delete";

type ParamsType = {
    page?: number;
    limit?: number;
    [key: string]: unknown;
};

export type ApiRequestType = {
    route: string,
    method: MethodType,
    payload?: unknown,
    params?: ParamsType
}

export const requestAPI = async ({
    route,
    method,
    payload,
    params
}: ApiRequestType) => {
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL;

    if (!apiUrl) {
        throw new Error("NEXT_PUBLIC_SITE_URL is not defined");
    }

    const query = params
        ? new URLSearchParams(
            Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)])
        ).toString()
        : "";

    const url = `${apiUrl}/api${route}${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: payload ? JSON.stringify(payload) : undefined,
    });

    return response.json();
};