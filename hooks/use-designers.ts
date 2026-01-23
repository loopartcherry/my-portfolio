/**
 * 设计师管理相关的 React Query Hooks
 * 需要安装 @tanstack/react-query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface DesignerFilters {
  status?: 'active' | 'inactive' | 'on_leave';
  specialty?: string;
  sortBy?: 'rating' | 'capacity' | 'load';
  search?: string;
}

/**
 * 获取设计师列表
 */
export function useDesignersList(filters?: DesignerFilters) {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.specialty) params.append('specialty', filters.specialty);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.search) params.append('search', filters.search);

  return useQuery({
    queryKey: ['designers', 'list', filters],
    queryFn: async () => {
      const res = await fetch(`/api/admin/designers?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('获取设计师列表失败');
      }

      const data = await res.json();
      return data.data || [];
    },
    staleTime: 30000,
    retry: 2,
  });
}

/**
 * 获取单个设计师详情
 */
export function useDesignerDetail(designerId: string | null) {
  return useQuery({
    queryKey: ['designers', 'detail', designerId],
    queryFn: async () => {
      if (!designerId) return null;

      const res = await fetch(`/api/admin/designers/${designerId}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('获取设计师详情失败');
      }

      const data = await res.json();
      return data.data;
    },
    enabled: !!designerId,
    staleTime: 30000,
    retry: 2,
  });
}

/**
 * 获取设计师工作负载统计
 */
export function useDesignerWorkload() {
  return useQuery({
    queryKey: ['designers', 'workload'],
    queryFn: async () => {
      const res = await fetch('/api/admin/designers/workload', {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('获取工作负载统计失败');
      }

      const data = await res.json();
      return data.data || [];
    },
    staleTime: 30000,
    retry: 2,
  });
}

/**
 * 获取设计师的项目列表
 */
export function useDesignerProjects(designerId: string | null, filters?: { status?: string; sortBy?: string }) {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);

  return useQuery({
    queryKey: ['designers', 'projects', designerId, filters],
    queryFn: async () => {
      if (!designerId) return [];

      const res = await fetch(`/api/admin/designers/${designerId}/projects?${params.toString()}`, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('获取项目列表失败');
      }

      const data = await res.json();
      return data.data || [];
    },
    enabled: !!designerId,
    staleTime: 30000,
    retry: 2,
  });
}

/**
 * 分配项目 mutation
 */
export function useAssignProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      designerId,
      projectId,
      estimatedHours,
      priority,
    }: {
      designerId: string;
      projectId: string;
      estimatedHours?: number;
      priority?: number;
    }) => {
      const res = await fetch(`/api/admin/designers/${designerId}/assign-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId, estimatedHours, priority }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || '分配项目失败');
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designers'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('项目分配成功');
    },
    onError: (error: Error) => {
      toast.error(error.message || '分配项目失败');
    },
  });
}

/**
 * 重新分配项目 mutation
 */
export function useReassignProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      designerId,
      projectId,
      newDesignerId,
      reason,
    }: {
      designerId: string;
      projectId: string;
      newDesignerId: string;
      reason?: string;
    }) => {
      const res = await fetch(`/api/admin/designers/${designerId}/reassign-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ projectId, newDesignerId, reason }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || '重新分配项目失败');
      }

      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designers'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('项目重新分配成功');
    },
    onError: (error: Error) => {
      toast.error(error.message || '重新分配项目失败');
    },
  });
}

/**
 * 更新设计师信息 mutation
 */
export function useUpdateDesigner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      designerId,
      data,
    }: {
      designerId: string;
      data: {
        specialties?: string[];
        hourlyRate?: number;
        maxCapacity?: number;
        status?: 'active' | 'inactive' | 'on_leave';
      };
    }) => {
      const res = await fetch(`/api/admin/designers/${designerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (!res.ok || !response.success) {
        throw new Error(response.error?.message || '更新设计师信息失败');
      }

      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['designers', 'detail', variables.designerId] });
      queryClient.invalidateQueries({ queryKey: ['designers', 'list'] });
      toast.success('设计师信息已更新');
    },
    onError: (error: Error) => {
      toast.error(error.message || '更新设计师信息失败');
    },
  });
}

/**
 * 创建设计师 mutation
 */
export function useCreateDesigner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      email: string;
      password?: string;
      name?: string;
      phone?: string;
      specialties?: string[];
      hourlyRate?: number;
      maxCapacity?: number;
    }) => {
      const res = await fetch('/api/admin/designers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (!res.ok || !response.success) {
        throw new Error(response.error?.message || '创建设计师失败');
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designers', 'list'] });
      toast.success('设计师账号已创建');
    },
    onError: (error: Error) => {
      toast.error(error.message || '创建设计师失败');
    },
  });
}
