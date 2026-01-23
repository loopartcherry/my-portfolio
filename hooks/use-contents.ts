/**
 * 内容管理相关的 React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export type ContentType = 'article' | 'case_study' | 'faq' | 'page';
export type ContentStatus = 'draft' | 'published' | 'archived';

export interface ContentFilters {
  type?: ContentType;
  status?: ContentStatus;
  category?: string;
  search?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'views' | 'title';
  page?: number;
  limit?: number;
}

export function useContents(filters?: ContentFilters) {
  const params = new URLSearchParams();
  if (filters?.type) params.append('type', filters.type);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.page) params.append('page', String(filters.page));
  if (filters?.limit) params.append('limit', String(filters.limit ?? 20));

  return useQuery({
    queryKey: ['contents', 'list', filters],
    queryFn: async () => {
      const res = await fetch(`/api/admin/contents?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? '获取内容列表失败');
      }
      return res.json();
    },
  });
}

export function useContentDetail(id: string | null) {
  return useQuery({
    queryKey: ['contents', 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/admin/contents/${id}`, { credentials: 'include' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? '获取内容详情失败');
      }
      return res.json();
    },
    enabled: !!id,
  });
}

export function useContentCategories() {
  return useQuery({
    queryKey: ['contents', 'categories'],
    queryFn: async () => {
      const res = await fetch('/api/admin/contents/categories', { credentials: 'include' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? '获取分类失败');
      }
      return res.json();
    },
  });
}

export function useContentStats() {
  return useQuery({
    queryKey: ['contents', 'stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/contents/stats', { credentials: 'include' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? '获取统计失败');
      }
      return res.json();
    },
  });
}

export function useContentRevisions(id: string | null) {
  return useQuery({
    queryKey: ['contents', 'revisions', id],
    queryFn: async () => {
      if (!id) return { data: [], count: 0 };
      const res = await fetch(`/api/admin/contents/${id}/revisions`, { credentials: 'include' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? '获取版本历史失败');
      }
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCreateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      slug: string;
      type: ContentType;
      title: string;
      subtitle?: string;
      excerpt?: string;
      content: string;
      contentFormat?: 'html' | 'markdown';
      featuredImage?: string;
      categoryKeyword?: string;
      categoryId?: string;
      tags?: string[];
      seo?: { metaTitle?: string; metaDescription?: string; keywords?: string };
      status?: ContentStatus;
      isFeatured?: boolean;
      featuredOrder?: number;
      publishedAt?: string;
      expiresAt?: string;
    }) => {
      const res = await fetch('/api/admin/contents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? '创建失败');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] });
      toast.success('内容创建成功');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        slug?: string;
        type?: ContentType;
        title?: string;
        subtitle?: string;
        excerpt?: string;
        content?: string;
        contentFormat?: 'html' | 'markdown';
        featuredImage?: string;
        categoryKeyword?: string;
        categoryId?: string;
        tags?: string[];
        seo?: { metaTitle?: string; metaDescription?: string; keywords?: string };
        status?: ContentStatus;
        isFeatured?: boolean;
        featuredOrder?: number;
        publishedAt?: string;
        expiresAt?: string;
        changeNote?: string;
      };
    }) => {
      const res = await fetch(`/api/admin/contents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? '更新失败');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] });
      toast.success('内容已更新');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function usePublishContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      publishedAt,
    }: { id: string; status: ContentStatus; publishedAt?: string }) => {
      const res = await fetch(`/api/admin/contents/${id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status, publishedAt }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? '发布操作失败');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] });
      toast.success('状态已更新');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useSetContentFeatured() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      isFeatured,
      featuredOrder,
    }: { id: string; isFeatured: boolean; featuredOrder?: number }) => {
      const res = await fetch(`/api/admin/contents/${id}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isFeatured, featuredOrder }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? '设置失败');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] });
      toast.success('推荐设置已更新');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteContent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/contents/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? '删除失败');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] });
      toast.success('内容已删除');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRestoreRevision() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ contentId, revisionId }: { contentId: string; revisionId: string }) => {
      const res = await fetch(
        `/api/admin/contents/${contentId}/revisions/${revisionId}/restore`,
        { method: 'POST', credentials: 'include' }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? '恢复失败');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents'] });
      toast.success('已恢复到该版本');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUploadContentImage() {
  return useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/admin/contents/upload-image', {
        method: 'POST',
        credentials: 'include',
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? '上传失败');
      return json;
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCreateContentCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; slug: string; description?: string; icon?: string; order?: number }) => {
      const res = await fetch('/api/admin/contents/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? '创建失败');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents', 'categories'] });
      toast.success('分类已创建');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateContentCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { name?: string; slug?: string; description?: string; icon?: string; order?: number };
    }) => {
      const res = await fetch(`/api/admin/contents/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message ?? '更新失败');
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['contents', 'categories'] });
      toast.success('分类已更新');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
