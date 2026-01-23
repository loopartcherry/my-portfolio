/**
 * 订阅操作相关的 React Query Hooks
 * 
 * 注意：需要安装 @tanstack/react-query
 * npm install @tanstack/react-query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

/**
 * 订阅套餐
 */
export function useSubscribeAction() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { planId: string; type: 'monthly' | 'yearly' }) => {
      const res = await fetch('/api/subscriptions/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || '订阅失败');
      }

      return result;
    },
    onSuccess: (data) => {
      // 刷新订阅数据
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

      // 跳转到支付页面
      if (data.data?.paymentLink) {
        router.push(data.data.paymentLink);
      } else {
        toast.success('订阅创建成功');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || '订阅失败，请稍后重试');
    },
  });
}

/**
 * 升级套餐
 */
export function useUpgradeAction() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { planId: string }) => {
      const res = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || '升级失败');
      }

      return result;
    },
    onSuccess: (data) => {
      // 刷新订阅数据
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

      // 如果需要支付，跳转到支付页面
      if (data.data?.paymentLink) {
        router.push(data.data.paymentLink);
      } else {
        toast.success('升级成功，新套餐已立即生效');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || '升级失败，请稍后重试');
    },
  });
}

/**
 * 取消订阅
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        credentials: 'include',
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error?.message || '取消订阅失败');
      }

      return result;
    },
    onSuccess: () => {
      // 刷新订阅数据
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('订阅已取消，当前周期将在到期日结束');
    },
    onError: (error: Error) => {
      toast.error(error.message || '取消订阅失败，请稍后重试');
    },
  });
}

/**
 * 续费订阅
 */
export function useRenewSubscription() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { planId?: string; type?: 'monthly' | 'yearly' }) => {
      // 如果没有指定套餐，使用当前订阅的套餐和类型
      if (!data.planId || !data.type) {
        // 先获取当前订阅
        const currentRes = await fetch('/api/subscriptions/current', {
          credentials: 'include',
        });
        const currentData = await currentRes.json();

        if (!currentData.data?.subscription) {
          throw new Error('无法获取当前订阅信息');
        }

        // 使用当前订阅创建续费订单（通过订阅接口）
        const res = await fetch('/api/subscriptions/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            planId: currentData.data.subscription.plan.id,
            type: currentData.data.subscription.type,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error?.message || '续费失败');
        }

        return result;
      } else {
        // 使用指定套餐续费
        const res = await fetch('/api/subscriptions/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error?.message || '续费失败');
        }

        return result;
      }
    },
    onSuccess: (data) => {
      // 刷新订阅数据
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

      // 跳转到支付页面
      if (data.data?.paymentLink) {
        router.push(data.data.paymentLink);
      } else {
        toast.success('续费成功');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || '续费失败，请稍后重试');
    },
  });
}
