import { useQuery, useMutation } from '@tanstack/react-query';

/**
 * 获取订单列表
 */
export function useOrders(filters?: { status?: string; type?: string }) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.set('status', filters.status);
      if (filters?.type) params.set('type', filters.type);
      
      const res = await fetch(`/api/orders?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('获取订单失败');
      const data = await res.json();
      return data.data;
    },
  });
}

/**
 * 获取订单详情
 */
export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const res = await fetch(`/api/orders/${orderId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('获取订单详情失败');
      const data = await res.json();
      return data.data;
    },
    enabled: !!orderId,
  });
}

/**
 * 创建模板订单
 */
export function useCreateTemplateOrder() {
  return useMutation({
    mutationFn: async (templateId: string) => {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ templateId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || '创建订单失败');
      return data.data;
    },
  });
}

/**
 * 创建支付会话
 */
export function useCreatePaymentSession() {
  return useMutation({
    mutationFn: async (params: {
      orderId: string;
      paymentMethod?: 'stripe' | 'alipay' | 'wechat';
    }) => {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          orderId: params.orderId,
          paymentMethod: params.paymentMethod || 'alipay',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || '创建支付会话失败');
      return data.data;
    },
  });
}
