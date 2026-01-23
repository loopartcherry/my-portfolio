/**
 * 订阅功能 API 端点测试
 * 
 * 测试所有订阅相关的 API 端点
 */

import { NextRequest } from 'next/server';
import { GET as getPlans } from '@/app/api/subscriptions/plans/route';
import { GET as getCurrent } from '@/app/api/subscriptions/current/route';
import { POST as subscribe } from '@/app/api/subscriptions/subscribe/route';
import { POST as upgrade } from '@/app/api/subscriptions/upgrade/route';
import { POST as cancel } from '@/app/api/subscriptions/cancel/route';
import { GET as getHistory } from '@/app/api/subscriptions/history/route';
import { GET as getUsage } from '@/app/api/subscriptions/usage/route';
import { POST as renewCallback } from '@/app/api/subscriptions/renew-callback/route';
import { mockPrisma } from '../__mocks__/prisma';
import { mockAuth } from '../__mocks__/auth';
import {
  mockUser,
  mockPlans,
  mockSubscription,
  mockOrder,
  mockProject,
} from '../__fixtures__/subscriptions';

// 在每个测试前重置 mock
beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.requireClient.mockResolvedValue(mockUser.id);
  mockAuth.getCurrentUserRole.mockReturnValue('customer');
});

describe('订阅 API 端点测试', () => {
  describe('GET /api/subscriptions/plans', () => {
    it('应该返回所有活跃的套餐列表', async () => {
      // Setup
      mockPrisma.subscriptionPlan.findMany.mockResolvedValue(mockPlans);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/plans');
      const response = await getPlans(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(3);
      expect(data.data[0]).toHaveProperty('id');
      expect(data.data[0]).toHaveProperty('name');
      expect(data.data[0]).toHaveProperty('price');
      expect(mockPrisma.subscriptionPlan.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { price: 'asc' },
        select: expect.any(Object),
      });
    });

    it('应该只返回活跃的套餐', async () => {
      // Setup
      const activePlans = mockPlans.filter((p) => p.isActive);
      mockPrisma.subscriptionPlan.findMany.mockResolvedValue(activePlans);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/plans');
      const response = await getPlans(request);
      const data = await response.json();

      // Assert
      expect(data.data.every((p: any) => p.isActive)).toBe(true);
    });
  });

  describe('GET /api/subscriptions/current', () => {
    it('应该返回当前用户的订阅信息', async () => {
      // Setup
      mockPrisma.subscription.findFirst.mockResolvedValue({
        ...mockSubscription,
        plan: mockPlans[1],
      });
      mockPrisma.project.count.mockResolvedValue(3);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/current', {
        headers: { 'x-user-id': mockUser.id },
      });
      const response = await getCurrent(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.subscription).toHaveProperty('id');
      expect(data.data.subscription).toHaveProperty('status', 'active');
      expect(data.data.plan).toHaveProperty('name');
      expect(data.data.quota).toHaveProperty('projects');
      expect(mockAuth.requireClient).toHaveBeenCalled();
    });

    it('未认证用户应该返回 401', async () => {
      // Setup
      mockAuth.requireClient.mockRejectedValue(new Error('UNAUTHORIZED'));

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/current');
      const response = await getCurrent(request);

      // Assert
      expect(response.status).toBe(401);
    });

    it('没有订阅时应该返回 null', async () => {
      // Setup
      mockPrisma.subscription.findFirst.mockResolvedValue(null);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/current', {
        headers: { 'x-user-id': mockUser.id },
      });
      const response = await getCurrent(request);
      const data = await response.json();

      // Assert
      expect(data.success).toBe(true);
      expect(data.data).toBeNull();
      expect(data.message).toContain('当前没有活跃的订阅');
    });
  });

  describe('POST /api/subscriptions/subscribe', () => {
    it('应该成功创建订阅和订单', async () => {
      // Setup
      mockPrisma.subscriptionPlan.findFirst.mockResolvedValue(mockPlans[1]);
      mockPrisma.subscription.findFirst.mockResolvedValue(null); // 没有现有订阅
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const subscription = { ...mockSubscription, id: 'sub_new' };
        const order = { ...mockOrder, id: 'order_new' };
        mockPrisma.subscription.create.mockResolvedValue(subscription);
        mockPrisma.order.create.mockResolvedValue(order);
        return callback(tx);
      });

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'plan_professional', type: 'monthly' }),
      });
      const response = await subscribe(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.subscription).toHaveProperty('id');
      expect(data.data.order).toHaveProperty('id');
      expect(data.data.paymentLink).toBeDefined();
    });

    it('已有活跃订阅时应该返回 422', async () => {
      // Setup
      mockPrisma.subscriptionPlan.findFirst.mockResolvedValue(mockPlans[1]);
      mockPrisma.subscription.findFirst.mockResolvedValue(mockSubscription);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'plan_professional', type: 'monthly' }),
      });
      const response = await subscribe(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(422);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('ALREADY_SUBSCRIBED');
    });

    it('套餐不存在时应该返回 404', async () => {
      // Setup
      mockPrisma.subscriptionPlan.findFirst.mockResolvedValue(null);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'plan_invalid', type: 'monthly' }),
      });
      const response = await subscribe(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error.code).toBe('PLAN_NOT_FOUND');
    });

    it('无效的请求体应该返回 400', async () => {
      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: '' }), // 缺少 type
      });
      const response = await subscribe(request);

      // Assert
      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/subscriptions/upgrade', () => {
    it('应该成功升级套餐并计算差价', async () => {
      // Setup
      const currentSub = { ...mockSubscription, plan: mockPlans[1] };
      const newPlan = mockPlans[2]; // Enterprise

      mockPrisma.subscriptionPlan.findUnique
        .mockResolvedValueOnce(newPlan) // 新套餐
        .mockResolvedValueOnce(mockPlans[1]); // 当前套餐（在事务中）

      mockPrisma.subscription.findFirst.mockResolvedValue({
        ...currentSub,
        plan: mockPlans[1],
      });

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const updatedSub = { ...currentSub, planId: newPlan.id, plan: newPlan };
        mockPrisma.subscription.update.mockResolvedValue(updatedSub);
        mockPrisma.order.create.mockResolvedValue({
          ...mockOrder,
          type: 'upgrade',
          amount: 700, // 差价
        });
        return callback(tx);
      });

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'plan_enterprise' }),
      });
      const response = await upgrade(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.subscription.plan.id).toBe('plan_enterprise');
      expect(data.data.upgradeInfo).toHaveProperty('upgradeAmount');
    });

    it('没有活跃订阅时应该返回 422', async () => {
      // Setup
      mockPrisma.subscription.findFirst.mockResolvedValue(null);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'plan_enterprise' }),
      });
      const response = await upgrade(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(422);
      expect(data.error.code).toBe('NO_ACTIVE_SUBSCRIPTION');
    });
  });

  describe('POST /api/subscriptions/cancel', () => {
    it('应该成功取消订阅', async () => {
      // Setup
      mockPrisma.subscription.findFirst.mockResolvedValue(mockSubscription);
      mockPrisma.subscription.update.mockResolvedValue({
        ...mockSubscription,
        status: 'cancelled',
        autoRenew: false,
        cancelledAt: new Date(),
      });

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/cancel', {
        method: 'POST',
      });
      const response = await cancel(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.subscription.status).toBe('cancelled');
      expect(data.data.subscription.autoRenew).toBe(false);
      expect(mockPrisma.subscription.update).toHaveBeenCalledWith({
        where: { id: mockSubscription.id },
        data: {
          autoRenew: false,
          status: 'cancelled',
          cancelledAt: expect.any(Date),
        },
      });
    });

    it('没有活跃订阅时应该返回 422', async () => {
      // Setup
      mockPrisma.subscription.findFirst.mockResolvedValue(null);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/cancel', {
        method: 'POST',
      });
      const response = await cancel(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(422);
      expect(data.error.code).toBe('NO_ACTIVE_SUBSCRIPTION');
    });
  });

  describe('GET /api/subscriptions/history', () => {
    it('应该返回订阅历史记录', async () => {
      // Setup
      const historyData = [
        {
          subscription: { ...mockSubscription, plan: mockPlans[1] },
          orders: [mockOrder],
        },
      ];
      mockPrisma.subscription.findMany.mockResolvedValue([mockSubscription]);
      mockPrisma.order.findMany.mockResolvedValue([mockOrder]);

      // Act
      const request = new NextRequest(
        'http://localhost/api/subscriptions/history?page=1&limit=10'
      );
      const response = await getHistory(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeInstanceOf(Array);
      expect(data.pagination).toHaveProperty('page');
      expect(data.pagination).toHaveProperty('total');
    });
  });

  describe('GET /api/subscriptions/usage', () => {
    it('应该返回额度使用情况', async () => {
      // Setup
      mockPrisma.subscription.findFirst.mockResolvedValue({
        ...mockSubscription,
        plan: mockPlans[1],
      });
      mockPrisma.project.findMany.mockResolvedValue([
        mockProject,
        { ...mockProject, id: 'project_2' },
      ]);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/usage');
      const response = await getUsage(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.usage).toHaveProperty('projects');
      expect(data.data.usage.projects.used).toBe(2);
      expect(data.data.usage.projects.total).toBe(20);
    });
  });

  describe('POST /api/subscriptions/renew-callback', () => {
    it('应该处理支付成功回调并更新订阅', async () => {
      // Setup
      const order = { ...mockOrder, status: 'pending' };
      mockPrisma.order.findUnique.mockResolvedValue({
        ...order,
        subscription: mockSubscription,
      });

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const updatedOrder = { ...order, status: 'paid', paidAt: new Date() };
        const updatedSub = {
          ...mockSubscription,
          status: 'active',
          endDate: new Date('2024-03-01'), // 延长一个月
        };
        mockPrisma.order.update.mockResolvedValue(updatedOrder);
        mockPrisma.subscription.update.mockResolvedValue(updatedSub);
        return { order: updatedOrder, subscription: updatedSub };
      });

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/renew-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: 'order_123',
          paymentStatus: 'success',
          transactionId: 'txn_456',
          paidAmount: 299,
          paidAt: new Date().toISOString(),
        }),
      });
      const response = await renewCallback(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.order.status).toBe('paid');
      expect(data.data.subscription.status).toBe('active');
    });

    it('订单不存在时应该返回 404', async () => {
      // Setup
      mockPrisma.order.findUnique.mockResolvedValue(null);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/renew-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: 'order_invalid',
          paymentStatus: 'success',
        }),
      });
      const response = await renewCallback(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(404);
      expect(data.error.code).toBe('ORDER_NOT_FOUND');
    });
  });
});
