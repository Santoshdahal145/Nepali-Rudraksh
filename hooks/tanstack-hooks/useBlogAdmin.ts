import {
  CreateBlogPayload,
  blogApi,
  UpdateBlogPayload,
} from "@/app/api/blogs/api";
import { AllBlogsResponseType, BlogType } from "@/app/types";
import { requestAPI } from "@/lib/requestAPI";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const enum BLOG_KEYS {
  create = "create-blog",
  update = "update-blog",
  getAll = "all-blogs",
  getSingle = "single-blog",
  delete = "delete-blog",
}

export default function useBlogAdminHook(
  page = 1,
  limit = 10,
  debouncedSearch = "",
) {
  const queryClient = useQueryClient();

  // GET ALL (with pagination & search)
  const getBlogs = useQuery({
    queryKey: [BLOG_KEYS.getAll, page, limit, debouncedSearch],
    queryFn: async () => {
      const res = await requestAPI<AllBlogsResponseType>(
        blogApi.getAllBlogs({
          page,
          limit,
          search: debouncedSearch,
        }),
      );
      return res.data as AllBlogsResponseType;
    },
  });

  // CREATE
  const createBlog = useMutation({
    mutationKey: [BLOG_KEYS.create],
    mutationFn: async (payload: CreateBlogPayload) => {
      const response = await requestAPI<BlogType>(blogApi.createBlog(payload));
      return response.data as BlogType;
    },

    onSuccess: (newBlog) => {
      queryClient.setQueryData(
        [BLOG_KEYS.getAll, page, limit, debouncedSearch],
        (oldData: AllBlogsResponseType | undefined) => {
          if (!oldData) return;
          return {
            ...oldData,
            blogs: [newBlog, ...oldData.blogs],
            pagination: {
              ...oldData.pagination,
              total: oldData.pagination.total + 1,
            },
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: [BLOG_KEYS.getAll],
      });
    },
  });

  // UPDATE
  const updateBlog = useMutation({
    mutationKey: [BLOG_KEYS.update],
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateBlogPayload;
    }) => {
      const response = await requestAPI<BlogType>(blogApi.updateBlog(id, data));
      return response.data as BlogType;
    },

    onSuccess: (updatedItem) => {
      queryClient.setQueryData(
        [BLOG_KEYS.getAll, page, limit, debouncedSearch],
        (oldData: AllBlogsResponseType | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            blogs: oldData.blogs.map((b) =>
              b.id === updatedItem.id ? updatedItem : b,
            ),
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: [BLOG_KEYS.getSingle, updatedItem.id],
      });
      queryClient.invalidateQueries({
        queryKey: [BLOG_KEYS.getAll],
      });
    },
  });

  // DELETE
  const deleteBlog = useMutation({
    mutationKey: [BLOG_KEYS.delete],
    mutationFn: async ({ id }: { id: number }) => {
      return await requestAPI(blogApi.deleteBlog(id));
    },

    onSuccess: (_, { id }) => {
      queryClient.setQueryData(
        [BLOG_KEYS.getAll, page, limit, debouncedSearch],
        (oldData: AllBlogsResponseType | undefined) => {
          if (!oldData) return;

          return {
            ...oldData,
            blogs: oldData.blogs.filter((b) => b.id !== id),
            pagination: {
              ...oldData.pagination,
              total: Math.max(0, oldData.pagination.total - 1),
            },
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: [BLOG_KEYS.getAll],
      });
    },
  });

  return {
    getBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}

export function useSingleBlogAdmin(blogId: number) {
  return useQuery({
    queryKey: [BLOG_KEYS.getSingle, blogId],
    queryFn: async () => {
      const res = await requestAPI<BlogType>(blogApi.getBlogById(blogId));
      return res.data as BlogType;
    },
    enabled: !isNaN(blogId) && blogId > 0,
  });
}
