import { ApiRequestType } from "@/lib/requestAPI";

const getDashboardData = (): ApiRequestType => {
  return {
    method: "get",
    route: `/dashboard`,
    showToast: false,
  };
};

export const adminDashboardApi = { getDashboardData };
