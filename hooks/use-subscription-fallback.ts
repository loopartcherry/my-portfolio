/**
 * 订阅相关的备用 Hooks（不使用 React Query）
 * 
 * 如果未安装 @tanstack/react-query，可以使用这些 hooks
 * 这些 hooks 使用原生的 useState 和 useEffect
 */

import { useState, useEffect } from 'react';

/**
 * 获取当前订阅信息（备用版本）
 */
export function useCurrentSubscriptionFallback() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('/api/subscriptions/current', {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('获取订阅信息失败');
        }

        const result = await res.json();

        if (!cancelled) {
          setData(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('未知错误'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}

/**
 * 获取所有可用套餐列表（备用版本）
 */
export function useSubscriptionPlansFallback() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('/api/subscriptions/plans');

        if (!res.ok) {
          throw new Error('获取套餐列表失败');
        }

        const result = await res.json();

        if (!cancelled) {
          setData(result.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('未知错误'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}

/**
 * 获取订阅额度使用情况（备用版本）
 */
export function useSubscriptionUsageFallback() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch('/api/subscriptions/usage', {
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('获取使用情况失败');
        }

        const result = await res.json();

        if (!cancelled) {
          setData(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('未知错误'));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, isLoading, error };
}
