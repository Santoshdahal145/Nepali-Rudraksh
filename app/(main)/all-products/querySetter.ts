//THIS FUNCTION MANAGES QUERY PARAMS AND MODIFY FOR NEW REQUEST
//PROPERLY SHOWS IN URL

import { AllProductsSearchParamsPublic } from "./types";

export function querySetter(params: Awaited<AllProductsSearchParamsPublic>) {
  const page = params.page ? Math.max(1, parseInt(params.page, 10)) : 1;

  const limit = params.limit ? Math.max(1, parseInt(params.limit, 10)) : 12;

  const search = params.search?.trim();

  const type =
    params.type === "INDIVIDUAL_RUDRAKSHA" || params.type === "RUDRAKSHA_MALA"
      ? params.type
      : undefined;

  const mukhi = params.mukhi ? parseInt(params.mukhi, 10) : undefined;

  const originId = params.originId ? parseInt(params.originId, 10) : undefined;

  const sortBy =
    params.sortBy === "name" ||
    params.sortBy === "price" ||
    params.sortBy === "createdAt"
      ? params.sortBy
      : "createdAt";

  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const minPrice =
    params.minPrice !== undefined ? parseInt(params.minPrice, 10) : undefined;
  const maxPrice =
    params.maxPrice !== undefined ? parseInt(params.maxPrice, 10) : undefined;

  //configuring query params before requesting

  const queryParams = new URLSearchParams();
  if (minPrice !== undefined) queryParams.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) queryParams.set("maxPrice", String(maxPrice));

  if (page) queryParams.set("page", String(page));
  if (limit) queryParams.set("limit", String(limit));
  if (search) queryParams.set("search", search);
  if (type) queryParams.set("type", type);
  if (mukhi) queryParams.set("mukhi", String(mukhi));
  if (originId) queryParams.set("originId", String(originId));
  if (sortBy) queryParams.set("sortBy", sortBy);
  if (sortOrder) queryParams.set("sortOrder", sortOrder);

  return queryParams;
}
