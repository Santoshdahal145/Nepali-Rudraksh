import { BlogType } from "@/app/types";

export type BlogDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export interface BlogDetailResponse {
  blog: BlogType;
}
