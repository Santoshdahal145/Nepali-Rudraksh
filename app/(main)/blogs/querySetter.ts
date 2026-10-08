import { AllBlogsSearchParamsPublic } from "./types";

export function querySetter(params: Awaited<AllBlogsSearchParamsPublic>) {
  const page = params.page ? Math.max(1, parseInt(params.page, 10)) : 1;
  const limit = params.limit ? Math.max(1, parseInt(params.limit, 10)) : 9;
  const search = params.search?.trim();
  const tag = params.tag?.trim();

  const queryParams = new URLSearchParams();
  if (page) queryParams.set("page", String(page));
  if (limit) queryParams.set("limit", String(limit));
  if (search) queryParams.set("search", search);
  if (tag) queryParams.set("tag", tag);

  return queryParams;
}
