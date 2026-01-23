/**
 * 订阅功能端到端集成测试
 * 
 * 测试完整的业务流程，包括多个 API 调用和数据库操作
 */

import { NextRequest } from 'next/server';
import { GET as getPlans } from '@/app/api/subscriptions/plans/route';
import { POST as subscribe } from '@/app/api/subscriptions/subscribe/route';
import { GET as getCurrent } from '@/app/api/subscriptions/current/route';
import { POST as upgrade } from '@/app/api/subscriptions/upgrade/route';
import { POST as cancel } from '@/app/api/subscriptions/cancel/route';
import { POST as renewCallback } from '@/app/api/subscriptions/renew-callback/route';
import {
  checkSubscriptionCredits,
  deductCredits,
} from '@/lib/services/subscription.service';
import { mockPrisma } from '../__mocks__/prisma';
import { mockAuth } from '../__mocks__/auth';
import {
  mockUser,
  mockPlans,
  mockSubscription,
  mockOrder,
  mockProject,
} from '../__fixtures__/subscriptions';

beforeEach(() => {
  jest.clearAllMocks();
  mockAuth.requireClient.mockResolvedValue(mockUser.id);
  mockAuth.getCurrentUserRole.mockReturnValue('customer');
});

describe('订阅功能端到端集成测试', () => {
  describe('完整的订阅流程', () => {
    it('应该完成从查看套餐到创建订阅的完整流程', async () => {
      // 1. 查看可用套餐
      mockPrisma.subscriptionPlan.findMany.mockResolvedValue(mockPlans);
      const plansRequest = new NextRequest('http://localhost/api/subscriptions/plans');
      const plansResponse = await getPlans(plansRequest);
      const plansData = await plansResponse.json();

      expect(plansData.success).toBe(true);
      expect(plansData.data.length).toBeGreaterThan(0);

      // 2. 创建订阅
      const selectedPlan = mockPlans[1];
      mockPrisma.subscriptionPlan.findFirst.mockResolvedValue(selectedPlan);
      mockPrisma.subscription.findFirst.mockResolvedValue(null); // 没有现有订阅

      const newSubscription = { ...mockSubscription, id: 'sub_new' };
      const newOrder = { ...mockOrder, id: 'order_new', status: 'pending' };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        mockPrisma.subscription.create.mockResolvedValue(newSubscription);
        mockPrisma.order.create.mockResolvedValue(newOrder);
        return callback(tx);
      });

      const subscribeRequest = new NextRequest('http://localhost/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          type: 'monthly',
        }),
      });
      const subscribeResponse = await subscribe(subscribeRequest);
      const subscribeData = await subscribeResponse.json();

      expect(subscribeData.success).toBe(true);
      expect(subscribeData.data.subscription.id).toBe('sub_new');
      expect(subscribeData.data.order.id).toBe('order_new');

      // 3. 支付回调（模拟支付成功）
      mockPrisma.order.findUnique.mockResolvedValue({
        ...newOrder,
        subscription: newSubscription,
      });

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const paidOrder = { ...newOrder, status: 'paid', paidAt: new Date() };
        const activeSub = {
          ...newSubscription,
          status: 'active',
          endDate: new Date('2024-02-01'),
        };
        mockPrisma.order.update.mockResolvedValue(paidOrder);
        mockPrisma.subscription.update.mockResolvedValue(activeSub);
        return { order: paidOrder, subscription: activeSub };
      });

      const callbackRequest = new NextRequest(
        'http://localhost/api/subscriptions/renew-callback',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: 'order_new',
            paymentStatus: 'success',
            transactionId: 'txn_123',
            paidAmount: selectedPlan.price,
            paidAt: new Date().toISOString(),
          }),
        }
      );
      const callbackResponse = await renewCallback(callbackRequest);
      const callbackData = await callbackResponse.json();

      expect(callbackData.success).toBe(true);
      expect(callbackData.data.order.status).toBe('paid');
      expect(callbackData.data.subscription.status).toBe('active');

      // 4. 查看当前订阅
      mockPrisma.subscription.findFirst.mockResolvedValue(activeSub);
      mockPrisma.project.count.mockResolvedValue(0);

      const currentRequest = new NextRequest('http://localhost/api/subscriptions/current');
      const currentResponse = await getCurrent(currentRequest);
      const currentData = await currentResponse.json();

      expect(currentData.success).toBe(true);
      expect(currentData.data.subscription.status).toBe('active');
      expect(currentData.data.plan.id).toBe(selectedPlan.id);
    });
  });

  describe('创建项目时的额度检查流程', () => {
    it('应该完成从检查额度到扣除额度的完整流程', async () => {
      // Setup: 用户有活跃订阅
      const subscription = {
        ...mockSubscription,
        plan: mockPlans[1], // Professional: 20个项目
        status: 'active',
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);
      mockPrisma.project.count.mockResolvedValue(5); // 已使用5个

      // 1. 检查额度
      const creditCheck = await checkSubscriptionCredits('sub_123', 1);
      expect(creditCheck.available).toBe(true);
      expect(creditCheck.remainingCredits).toBe(15);

      // 2. 创建项目并扣除额度
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const newProject = { ...mockProject, id: 'project_new' };
        mockPrisma.project.create.mockResolvedValue(newProject);
        return { project: newProject };
      });

      const deductResult = await deductCredits('sub_123', 'project_new', 1);
      expect(deductResult.success).toBe(true);
      expect(deductResult.remainingCredits).toBe(14);

      // 3. 再次检查额度（应该减少）
      mockPrisma.project.count.mockResolvedValue(6); // 现在6个
      const creditCheckAfter = await checkSubscriptionCredits('sub_123', 1);
      expect(creditCheckAfter.remainingCredits).toBe(14);
    });

    it('额度不足时应该阻止创建项目', async () => {
      // Setup: 额度已用完
      const subscription = {
        ...mockSubscription,
        plan: mockPlans[0], // Basic: 5个项目
        status: 'active',
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);
      mockPrisma.project.count.mockResolvedValue(5); // 已用完

      // 检查额度
      const creditCheck = await checkSubscriptionCredits('sub_123', 1);
      expect(creditCheck.available).toBe(false);
      expect(creditCheck.remainingCredits).toBe(0);

      // 尝试扣除额度应该失败
      const deductResult = await deductCredits('sub_123', 'project_new', 1);
      expect(deductResult.success).toBe(false);
    });
  });

  describe('升级套餐的完整流程', () => {
    it('应该完成从查看当前订阅到升级的完整流程', async () => {
      // 1. 查看当前订阅
      const currentSub = {
        ...mockSubscription,
        planId: 'plan_professional',
        plan: mockPlans[1], // Professional
        status: 'active',
      };
      mockPrisma.subscription.findFirst.mockResolvedValue(currentSub);
      mockPrisma.project.count.mockResolvedValue(3);

      const currentRequest = new NextRequest('http://localhost/api/subscriptions/current');
      const currentResponse = await getCurrent(currentRequest);
      const currentData = await currentResponse.json();

      expect(currentData.data.subscription.plan.id).toBe('plan_professional');

      // 2. 升级到 Enterprise
      const newPlan = mockPlans[2]; // Enterprise
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue(newPlan);

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const upgradedSub = {
          ...currentSub,
          planId: 'plan_enterprise',
          plan: newPlan,
          price: newPlan.price,
        };
        const upgradeOrder = {
          ...mockOrder,
          type: 'upgrade',
          amount: 700, // 差价
        };
        mockPrisma.subscription.update.mockResolvedValue(upgradedSub);
        mockPrisma.order.create.mockResolvedValue(upgradeOrder);
        return { subscription: upgradedSub, order: upgradeOrder };
      });

      const upgradeRequest = new NextRequest('http://localhost/api/subscriptions/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: 'plan_enterprise' }),
      });
      const upgradeResponse = await upgrade(upgradeRequest);
      const upgradeData = await upgradeResponse.json();

      expect(upgradeData.success).toBe(true);
      expect(upgradeData.data.subscription.plan.id).toBe('plan_enterprise');

      // 3. 验证升级后的额度（应该是无限制）
      const upgradedSub = {
        ...currentSub,
        planId: 'plan_enterprise',
        plan: newPlan,
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(upgradedSub);
      mockPrisma.project.count.mockResolvedValue(100); // 即使有很多项目

      const creditCheck = await checkSubscriptionCredits('sub_123', 1);
      expect(creditCheck.available).toBe(true);
      expect(creditCheck.remainingCredits).toBe(Infinity);
    });
  });

  describe('取消订阅的完整流程', () => {
    it('应该完成取消订阅并验证无法创建项目', async () => {
      // 1. 取消订阅
      const activeSub = {
        ...mockSubscription,
        status: 'active',
        autoRenew: true,
      };
      mockPrisma.subscription.findFirst.mockResolvedValue(activeSub);
      mockPrisma.subscription.update.mockResolvedValue({
        ...activeSub,
        status: 'cancelled',
        autoRenew: false,
        cancelledAt: new Date(),
      });

      const cancelRequest = new NextRequest('http://localhost/api/subscriptions/cancel', {
        method: 'POST',
      });
      const cancelResponse = await cancel(cancelRequest);
      const cancelData = await cancelResponse.json();

      expect(cancelData.success).toBe(true);
      expect(cancelData.data.subscription.status).toBe('cancelled');
      expect(cancelData.data.subscription.autoRenew).toBe(false);

      // 2. 验证取消后无法创建项目（订阅状态为 cancelled）
      const cancelledSub = {
        ...activeSub,
        status: 'cancelled',
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(cancelledSub);

      const creditCheck = await checkSubscriptionCredits('sub_123', 1);
      expect(creditCheck.available).toBe(false);
      expect(creditCheck.subscriptionStatus).toBe('cancelled');
    });
  });

  describe('自动续费的完整流程', () => {
    it('应该完成从过期到自动续费的完整流程', async () => {
      // 1. 订阅过期
      const expiredSub = {
        ...mockSubscription,
        status: 'active',
        autoRenew: true,
        endDate: new Date('2024-01-01'), // 已过期
        plan: mockPlans[1],
      };

      mockPrisma.subscription.findUnique.mockResolvedValue(expiredSub);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const updatedSub = { ...expiredSub, status: 'expired' };
        const renewalOrder = {
          ...mockOrder,
          type: 'renewal',
          status: 'pending',
        };
        mockPrisma.subscription.update.mockResolvedValue(updatedSub);
        mockPrisma.order.create.mockResolvedValue(renewalOrder);
        return {
          success: true,
          message: '处理完成',
          actions: ['status_updated', 'renewal_order_created'],
        };
      });

      const { handleSubscriptionExpiry } = require('@/lib/services/subscription.service');
      const expiryResult = await handleSubscriptionExpiry('sub_123');

      expect(expiryResult.success).toBe(true);
      expect(expiryResult.actions).toContain('renewal_order_created');

      // 2. 支付回调（续费成功）
      const renewalOrder = {
        ...mockOrder,
        id: 'order_renewal',
        type: 'renewal',
        status: 'pending',
        subscription: expiredSub,
      };

      mockPrisma.order.findUnique.mockResolvedValue(renewalOrder);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const paidOrder = { ...renewalOrder, status: 'paid', paidAt: new Date() };
        const renewedSub = {
          ...expiredSub,
          status: 'active',
          endDate: new Date('2024-03-01'), // 延长一个月
          autoRenew: true,
        };
        mockPrisma.order.update.mockResolvedValue(paidOrder);
        mockPrisma.subscription.update.mockResolvedValue(renewedSub);
        return { order: paidOrder, subscription: renewedSub };
      });

      const callbackRequest = new NextRequest(
        'http://localhost/api/subscriptions/renew-callback',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: 'order_renewal',
            paymentStatus: 'success',
            transactionId: 'txn_renewal',
            paidAmount: mockPlans[1].price,
            paidAt: new Date().toISOString(),
          }),
        }
      );
      const callbackResponse = await renewCallback(callbackRequest);
      const callbackData = await callbackResponse.json();

      expect(callbackData.success).toBe(true);
      expect(callbackData.data.subscription.status).toBe('active');
      expect(callbackData.data.subscription.autoRenew).toBe(true);
    });
  });

  describe('权限和安全测试', () => {
    it('未认证用户无法访问订阅功能', async () => {
      // Setup
      mockAuth.requireClient.mockRejectedValue(new Error('UNAUTHORIZED'));

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/current');
      const response = await getCurrent(request);

      // Assert
      expect(response.status).toBe(401);
    });

    it('用户只能查看自己的订阅', async () => {
      // Setup
      const user1Sub = { ...mockSubscription, userId: 'user_1' };
      const user2Sub = { ...mockSubscription, userId: 'user_2', id: 'sub_2' };

      mockAuth.requireClient.mockResolvedValue('user_1');
      mockPrisma.subscription.findFirst.mockResolvedValue(user1Sub);

      // Act
      const request = new NextRequest('http://localhost/api/subscriptions/current');
      const response = await getCurrent(request);
      const data = await response.json();

      // Assert
      expect(data.data.subscription.userId).toBe('user_1');
      expect(data.data.subscription.id).not.toBe('sub_2');
    });

    it('无法绕过支付直接创建订阅', async () => {
      // Setup: 尝试创建订阅但不支付
      mockPrisma.subscriptionPlan.findFirst.mockResolvedValue(mockPlans[1]);
      mockPrisma.subscription.findFirst.mockResolvedValue(null);

      const newSub = { ...mockSubscription, status: 'pending' };
      const newOrder = { ...mockOrder, status: 'pending' };

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        mockPrisma.subscription.create.mockResolvedValue(newSub);
        mockPrisma.order.create.mockResolvedValue(newOrder);
        return callback(tx);
      });

      const subscribeRequest = new NextRequest('http://localhost/api/subscriptions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: 'plan_professional',
          type: 'monthly',
        }),
      });
      const subscribeResponse = await subscribe(subscribeRequest);
      const subscribeData = await subscribeResponse.json();

      // 订阅状态应该是 pending，不是 active
      expect(subscribeData.data.subscription.status).toBe('pending');

      // 验证未支付的订阅无法使用
      mockPrisma.subscription.findUnique.mockResolvedValue(newSub);
      const creditCheck = await checkSubscriptionCredits('sub_123', 1);
      expect(creditCheck.available).toBe(false);
      expect(creditCheck.subscriptionStatus).toBe('pending');
    });
  });
});
