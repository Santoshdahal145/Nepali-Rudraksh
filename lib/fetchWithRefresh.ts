let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

const handleLogoutAndRedirect = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
    await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Ignore network failures on logout, proceed to redirect anyway
  } finally {
    window.location.href = "/login";
  }
};

export const fetchWithRefresh = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  let response = await fetch(input, init);

  const urlString =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

  // If unauthorized and it's not already the refresh or logout route itself
  if (
    response.status === 401 &&
    !urlString.includes("auth/refresh") &&
    !urlString.includes("auth/logout")
  ) {
    if (isRefreshing) {
      // Queue request until active refresh completes
      await new Promise<void>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
      return fetch(input, init);
    }

    isRefreshing = true;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
      const refreshRes = await fetch(`${apiUrl}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      console.log("🚀 ~ fetchWithRefresh ~ refreshRes:", refreshRes);

      if (refreshRes.ok) {
        isRefreshing = false;
        processQueue(null);
        return fetch(input, init);
      } else {
        isRefreshing = false;
        processQueue(new Error("Session expired"));
        await handleLogoutAndRedirect();
        return response;
      }
    } catch (err) {
      isRefreshing = false;
      const error = err instanceof Error ? err : new Error("Refresh failed");
      processQueue(error);
      await handleLogoutAndRedirect();
      throw error;
    }
  }

  return response;
};
