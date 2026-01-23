/**
 * 订阅相关的 React Query Hooks
 * 
 * 注意：需要安装 @tanstack/react-query
 * npm install @tanstack/react-query
 * 
 * 并在 app/layout.tsx 中添加 QueryClientProvider
 */

import { useQuery } from '@tanstack/react-query';

/**
 * 获取当前订阅信息
 */
export function useCurrentSubscription() {
  return useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: async () => {
      const res = await fetch('/api/subscriptions/current', {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('获取订阅信息失败');
      }
      
      const data = await res.json();
      return data.data;
    },
    staleTime: 30000, // 30秒内不重新获取
    retry: 2,
  });
}

/**
 * 获取所有可用套餐列表
 */
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: async () => {
      const res = await fetch('/api/subscriptions/plans');
      
      if (!res.ok) {
        throw new Error('获取套餐列表失败');
      }
      
      const data = await res.json();
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5分钟内不重新获取
    retry: 2,
  });
}

/**
 * 获取订阅额度使用情况
 */
export function useSubscriptionUsage() {
  return useQuery({
    queryKey: ['subscriptions', 'usage'],
    queryFn: async () => {
      const res = await fetch('/api/subscriptions/usage', {
        credentials: 'include',
      });
      
      if (!res.ok) {
        throw new Error('获取使用情况失败');
      }
      
      const data = await res.json();
      return data.data;
    },
    staleTime: 30000, // 30秒内不重新获取
    retry: 2,
  });
}

/**
 * 获取订阅历史记录
 */
export function useSubscriptionHistory(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['subscriptions', 'history', page, limit],
    queryFn: async () => {
      const res = await fetch(
        `/api/subscriptions/history?page=${page}&limit=${limit}`,
        {
          credentials: 'include',
        }
      );
      
      if (!res.ok) {
        throw new Error('获取订阅历史失败');
      }
      
      const data = await res.json();
      return data;
    },
    staleTime: 60000, // 1分钟内不重新获取
    retry: 2,
  });
}
