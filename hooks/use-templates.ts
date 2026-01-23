/**
 * 模板管理相关的 React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface TemplateFilters {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  search?: string;
  sortBy?: 'createdAt' | 'downloads' | 'rating' | 'views' | 'price';
  page?: number;
  limit?: number;
  featured?: boolean;
}

/**
 * 获取模板列表
 */
export function useTemplates(filters?: TemplateFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  return useQuery({
    queryKey: ['templates', 'list', filters],
    queryFn: async () => {
      const res = await fetch(`/api/admin/templates?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || '获取模板列表失败');
      }
      return res.json();
    },
  });
}

/**
 * 获取单个模板详情
 */
export function useTemplateDetail(id: string | null) {
  return useQuery({
    queryKey: ['templates', 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await fetch(`/api/admin/templates/${id}`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || '获取模板详情失败');
      }
      return res.json();
    },
    enabled: !!id,
  });
}

/**
 * 获取模板分类列表
 */
export function useTemplateCategories() {
  return useQuery({
    queryKey: ['templates', 'categories'],
    queryFn: async () => {
      const res = await fetch('/api/admin/templates/categories', {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || '获取分类列表失败');
      }
      return res.json();
    },
  });
}

/**
 * 获取模板统计
 */
export function useTemplateStats() {
  return useQuery({
    queryKey: ['templates', 'stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/templates/stats', {
        credentials: 'include',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error?.message || '获取统计信息失败');
      }
      return res.json();
    },
  });
}

/**
 * 上传模板
 */
export function useUploadTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      categoryIds?: string[];
      price?: number;
      discount?: number;
      tags?: string[];
      author?: string;
      status?: 'draft' | 'published' | 'archived';
      previewUrls?: string[];
      fileUrls?: Array<{ format: string; url: string; size: number }>;
    }) => {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '上传模板失败');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('模板上传成功');
    },
    onError: (error: Error) => {
      toast.error(error.message || '上传模板失败，请稍后重试');
    },
  });
}

/**
 * 更新模板
 */
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        description?: string;
        categoryIds?: string[];
        price?: number;
        discount?: number;
        tags?: string[];
        author?: string;
        status?: 'draft' | 'published' | 'archived';
      };
    }) => {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '更新模板失败');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('模板更新成功');
    },
    onError: (error: Error) => {
      toast.error(error.message || '更新模板失败，请稍后重试');
    },
  });
}

/**
 * 更新模板文件
 */
export function useUpdateTemplateFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      fileUrls,
    }: {
      id: string;
      fileUrls: Array<{ format: string; url: string; size: number }>;
    }) => {
      const res = await fetch(`/api/admin/templates/${id}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ fileUrls }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '更新文件失败');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('文件更新成功');
    },
    onError: (error: Error) => {
      toast.error(error.message || '更新文件失败，请稍后重试');
    },
  });
}

/**
 * 更新模板预览图
 */
export function useUpdateTemplatePreviews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      previewUrls,
    }: {
      id: string;
      previewUrls: string[];
    }) => {
      const res = await fetch(`/api/admin/templates/${id}/previews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ previewUrls }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '更新预览图失败');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('预览图更新成功');
    },
    onError: (error: Error) => {
      toast.error(error.message || '更新预览图失败，请稍后重试');
    },
  });
}

/**
 * 设置模板精选状态
 */
export function useSetTemplateFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isFeatured,
      featuredUntil,
    }: {
      id: string;
      isFeatured: boolean;
      featuredUntil?: string;
    }) => {
      const res = await fetch(`/api/admin/templates/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ isFeatured, featuredUntil }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '设置精选失败');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('精选状态已更新');
    },
    onError: (error: Error) => {
      toast.error(error.message || '设置精选失败，请稍后重试');
    },
  });
}

/**
 * 更新模板状态
 */
export function useUpdateTemplateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: 'draft' | 'published' | 'archived';
    }) => {
      const res = await fetch(`/api/admin/templates/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '更新状态失败');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('状态更新成功');
    },
    onError: (error: Error) => {
      toast.error(error.message || '更新状态失败，请稍后重试');
    },
  });
}

/**
 * 删除模板
 */
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '删除模板失败');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success('模板已删除');
    },
    onError: (error: Error) => {
      toast.error(error.message || '删除模板失败，请稍后重试');
    },
  });
}

/**
 * 批量操作模板
 */
export function useBatchActionTemplates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      action,
      templateIds,
    }: {
      action: 'publish' | 'archive' | 'delete';
      templateIds: string[];
    }) => {
      const res = await fetch('/api/admin/templates/batch-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action, templateIds }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '批量操作失败');
      }
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast.success(`成功${data.data.affectedCount}个模板`);
    },
    onError: (error: Error) => {
      toast.error(error.message || '批量操作失败，请稍后重试');
    },
  });
}

/**
 * 上传文件
 */
export function useUploadFiles() {
  return useMutation({
    mutationFn: async ({
      type,
      files,
    }: {
      type: 'design' | 'preview';
      files: File[];
    }) => {
      const formData = new FormData();
      formData.append('type', type);
      files.forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/admin/templates/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '文件上传失败');
      }
      return result;
    },
    onError: (error: Error) => {
      toast.error(error.message || '文件上传失败，请稍后重试');
    },
  });
}

/**
 * 创建分类
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      slug: string;
      description?: string;
      icon?: string;
      order?: number;
      active?: boolean;
    }) => {
      const res = await fetch('/api/admin/templates/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '创建分类失败');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates', 'categories'] });
      toast.success('分类创建成功');
    },
    onError: (error: Error) => {
      toast.error(error.message || '创建分类失败，请稍后重试');
    },
  });
}

/**
 * 更新分类
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        name?: string;
        slug?: string;
        description?: string;
        icon?: string;
        order?: number;
        active?: boolean;
      };
    }) => {
      const res = await fetch(`/api/admin/templates/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || '更新分类失败');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates', 'categories'] });
      toast.success('分类更新成功');
    },
    onError: (error: Error) => {
      toast.error(error.message || '更新分类失败，请稍后重试');
    },
  });
}
