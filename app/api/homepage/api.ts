import { ApiRequestType } from "@/lib/requestAPI";

const getHomePageData = (): ApiRequestType => {
  return {
    method: "get",
    route: `/homepage`,
    showToast: false,
  };
};

export const homepageApi = { getHomePageData };
