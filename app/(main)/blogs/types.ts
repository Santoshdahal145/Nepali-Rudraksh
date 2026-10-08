import { PaginationType, BlogType } from "@/app/types";

export type AllBlogsSearchParamsPublic = Promise<{
  page?: string;
  limit?: string;
  search?: string;
  tag?: string;
}>;

export interface AllBlogsPublicResponseType {
  blogs: BlogType[];
  pagination: PaginationType;
}
