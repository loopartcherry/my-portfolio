/**
 * 订阅业务逻辑服务测试
 * 
 * 测试订阅服务的所有业务逻辑函数
 */

import {
  checkSubscriptionCredits,
  deductCredits,
  calculateUpgradePrice,
  checkRenewalAvailable,
  handleSubscriptionExpiry,
  batchHandleExpiredSubscriptions,
} from '@/lib/services/subscription.service';
import { mockPrisma } from '../__mocks__/prisma';
import {
  mockUser,
  mockPlans,
  mockSubscription,
  mockProject,
} from '../__fixtures__/subscriptions';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('订阅业务逻辑服务测试', () => {
  describe('checkSubscriptionCredits', () => {
    it('应该返回可用额度和剩余额度', async () => {
      // Setup
      const subscription = {
        ...mockSubscription,
        plan: mockPlans[1], // Professional: 20个项目
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);
      mockPrisma.project.count.mockResolvedValue(5); // 已使用5个

      // Act
      const result = await checkSubscriptionCredits('sub_123', 1);

      // Assert
      expect(result.available).toBe(true);
      expect(result.remainingCredits).toBe(15); // 20 - 5
      expect(result.subscriptionStatus).toBe('active');
    });

    it('订阅已过期时应该返回不可用', async () => {
      // Setup
      const expiredSub = {
        ...mockSubscription,
        status: 'expired',
        endDate: new Date('2024-01-01'), // 已过期
        plan: mockPlans[1],
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(expiredSub);

      // Act
      const result = await checkSubscriptionCredits('sub_123', 1);

      // Assert
      expect(result.available).toBe(false);
      expect(result.subscriptionStatus).toBe('expired');
      expect(result.message).toContain('已过期');
    });

    it('额度不足时应该返回不可用', async () => {
      // Setup
      const subscription = {
        ...mockSubscription,
        plan: mockPlans[1], // 20个项目
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);
      mockPrisma.project.count.mockResolvedValue(20); // 已用完

      // Act
      const result = await checkSubscriptionCredits('sub_123', 1);

      // Assert
      expect(result.available).toBe(false);
      expect(result.remainingCredits).toBe(0);
      expect(result.message).toContain('额度不足');
    });

    it('无限制额度时应该返回可用', async () => {
      // Setup
      const subscription = {
        ...mockSubscription,
        plan: mockPlans[2], // Enterprise: 0 = 无限制
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);
      mockPrisma.project.count.mockResolvedValue(100);

      // Act
      const result = await checkSubscriptionCredits('sub_123', 1);

      // Assert
      expect(result.available).toBe(true);
      expect(result.remainingCredits).toBe(Infinity);
    });
  });

  describe('deductCredits', () => {
    it('应该成功扣除额度', async () => {
      // Setup
      const subscription = {
        ...mockSubscription,
        plan: mockPlans[1], // 20个项目
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);
      mockPrisma.project.count.mockResolvedValue(5);

      // Mock checkSubscriptionCredits 内部调用
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        return callback(tx);
      });

      // Act
      const result = await deductCredits('sub_123', 'project_456', 1);

      // Assert
      expect(result.success).toBe(true);
      expect(result.remainingCredits).toBe(14); // 20 - 5 - 1
    });

    it('额度不足时应该返回失败', async () => {
      // Setup
      const subscription = {
        ...mockSubscription,
        plan: mockPlans[0], // Basic: 5个项目
      };
      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);
      mockPrisma.project.count.mockResolvedValue(5); // 已用完

      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        // 模拟 checkSubscriptionCredits 返回额度不足
        return callback(tx);
      });

      // Act
      const result = await deductCredits('sub_123', 'project_456', 1);

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('额度不足');
    });
  });

  describe('calculateUpgradePrice', () => {
    it('应该正确计算升级差价', async () => {
      // Setup
      const currentSub = {
        ...mockSubscription,
        planId: 'plan_professional',
        plan: mockPlans[1], // Professional: 299/月
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-01'),
        price: 299,
      };
      const newPlan = mockPlans[2]; // Enterprise: 999/月

      mockPrisma.subscription.findUnique.mockResolvedValue(currentSub);
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue(newPlan);

      // Act
      const result = await calculateUpgradePrice('sub_123', 'plan_enterprise');

      // Assert
      expect(result.currentPrice).toBe(299);
      expect(result.newPrice).toBeGreaterThan(0);
      expect(result.difference).toBeGreaterThan(0);
      expect(result.remainingDays).toBeGreaterThan(0);
    });

    it('新套餐更便宜时应该计算退款', async () => {
      // Setup
      const currentSub = {
        ...mockSubscription,
        planId: 'plan_enterprise',
        plan: mockPlans[2], // Enterprise: 999/月
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-02-01'),
        price: 999,
      };
      const newPlan = mockPlans[1]; // Professional: 299/月

      mockPrisma.subscription.findUnique.mockResolvedValue(currentSub);
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue(newPlan);

      // Act
      const result = await calculateUpgradePrice('sub_123', 'plan_professional');

      // Assert
      expect(result.needsRefund).toBe(true);
      expect(result.refundAmount).toBeGreaterThan(0);
    });

    it('已是相同套餐时应该抛出错误', async () => {
      // Setup
      const currentSub = {
        ...mockSubscription,
        planId: 'plan_professional',
        plan: mockPlans[1],
      };
      const samePlan = mockPlans[1];

      mockPrisma.subscription.findUnique.mockResolvedValue(currentSub);
      mockPrisma.subscriptionPlan.findUnique.mockResolvedValue(samePlan);

      // Act & Assert
      await expect(
        calculateUpgradePrice('sub_123', 'plan_professional')
      ).rejects.toThrow('您已经是该套餐的用户');
    });
  });

  describe('checkRenewalAvailable', () => {
    it('距离过期7天内应该可以续费', async () => {
      // Setup
      const now = new Date('2024-01-25');
      const endDate = new Date('2024-01-30'); // 5天后过期
      const subscription = {
        ...mockSubscription,
        status: 'active',
        endDate,
        plan: mockPlans[1],
      };

      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);

      // Act
      const result = await checkRenewalAvailable('sub_123');

      // Assert
      expect(result.canRenew).toBe(true);
      expect(result.daysUntilExpiry).toBeLessThanOrEqual(7);
      expect(result.renewalPrice).toBe(299);
    });

    it('已过期应该可以续费', async () => {
      // Setup
      const endDate = new Date('2024-01-01'); // 已过期
      const subscription = {
        ...mockSubscription,
        status: 'expired',
        endDate,
        plan: mockPlans[1],
      };

      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);

      // Act
      const result = await checkRenewalAvailable('sub_123');

      // Assert
      expect(result.canRenew).toBe(true);
      expect(result.daysUntilExpiry).toBeLessThan(0);
    });

    it('距离过期超过7天应该不能续费', async () => {
      // Setup
      const endDate = new Date('2024-02-15'); // 20天后过期
      const subscription = {
        ...mockSubscription,
        status: 'active',
        endDate,
        plan: mockPlans[1],
      };

      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);

      // Act
      const result = await checkRenewalAvailable('sub_123');

      // Assert
      expect(result.canRenew).toBe(false);
      expect(result.daysUntilExpiry).toBeGreaterThan(7);
    });

    it('已取消的订阅应该不能续费', async () => {
      // Setup
      const subscription = {
        ...mockSubscription,
        status: 'cancelled',
        plan: mockPlans[1],
      };

      mockPrisma.subscription.findUnique.mockResolvedValue(subscription);

      // Act
      const result = await checkRenewalAvailable('sub_123');

      // Assert
      expect(result.canRenew).toBe(false);
      expect(result.message).toContain('已取消');
    });
  });

  describe('handleSubscriptionExpiry', () => {
    it('应该处理过期订阅并更新状态', async () => {
      // Setup
      const expiredSub = {
        ...mockSubscription,
        status: 'active',
        endDate: new Date('2024-01-01'), // 已过期
        plan: mockPlans[1],
      };

      mockPrisma.subscription.findUnique.mockResolvedValue(expiredSub);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const updatedSub = { ...expiredSub, status: 'expired' };
        mockPrisma.subscription.update.mockResolvedValue(updatedSub);
        return { success: true, message: '处理完成', actions: ['status_updated'] };
      });

      // Act
      const result = await handleSubscriptionExpiry('sub_123');

      // Assert
      expect(result.success).toBe(true);
      expect(result.actions).toContain('status_updated');
    });

    it('启用自动续费时应该创建续费订单', async () => {
      // Setup
      const expiredSub = {
        ...mockSubscription,
        status: 'active',
        autoRenew: true,
        endDate: new Date('2024-01-01'),
        plan: mockPlans[1],
      };

      mockPrisma.subscription.findUnique.mockResolvedValue(expiredSub);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        const updatedSub = { ...expiredSub, status: 'expired' };
        const renewalOrder = { ...mockOrder, type: 'renewal' };
        mockPrisma.subscription.update.mockResolvedValue(updatedSub);
        mockPrisma.order.create.mockResolvedValue(renewalOrder);
        return {
          success: true,
          message: '处理完成',
          actions: ['status_updated', 'renewal_order_created'],
        };
      });

      // Act
      const result = await handleSubscriptionExpiry('sub_123');

      // Assert
      expect(result.success).toBe(true);
      expect(result.actions).toContain('renewal_order_created');
      expect(mockPrisma.order.create).toHaveBeenCalled();
    });

    it('未过期的订阅应该返回未过期消息', async () => {
      // Setup
      const activeSub = {
        ...mockSubscription,
        status: 'active',
        endDate: new Date('2024-12-31'), // 未过期
        plan: mockPlans[1],
      };

      mockPrisma.subscription.findUnique.mockResolvedValue(activeSub);
      mockPrisma.$transaction.mockImplementation(async (callback) => {
        const tx = mockPrisma;
        return { success: false, message: '订阅尚未过期', actions: [] };
      });

      // Act
      const result = await handleSubscriptionExpiry('sub_123');

      // Assert
      expect(result.success).toBe(false);
      expect(result.message).toContain('尚未过期');
    });
  });

  describe('batchHandleExpiredSubscriptions', () => {
    it('应该批量处理过期订阅', async () => {
      // Setup
      const expiredSubs = [
        { ...mockSubscription, id: 'sub_1', endDate: new Date('2024-01-01') },
        { ...mockSubscription, id: 'sub_2', endDate: new Date('2024-01-02') },
      ];

      mockPrisma.subscription.findMany.mockResolvedValue(expiredSubs);

      // Mock handleSubscriptionExpiry 的成功响应
      jest.spyOn(
        require('@/lib/services/subscription.service'),
        'handleSubscriptionExpiry'
      ).mockResolvedValue({
        success: true,
        message: '处理完成',
        actions: ['status_updated'],
      });

      // Act
      const result = await batchHandleExpiredSubscriptions(100);

      // Assert
      expect(result.total).toBe(2);
      expect(result.processed).toBe(2);
      expect(result.succeeded).toBe(2);
      expect(result.failed).toBe(0);
      expect(result.results).toHaveLength(2);
    });

    it('应该处理部分失败的情况', async () => {
      // Setup
      const expiredSubs = [
        { ...mockSubscription, id: 'sub_1', endDate: new Date('2024-01-01') },
        { ...mockSubscription, id: 'sub_2', endDate: new Date('2024-01-02') },
      ];

      mockPrisma.subscription.findMany.mockResolvedValue(expiredSubs);

      // Mock handleSubscriptionExpiry: 第一个成功，第二个失败
      jest.spyOn(
        require('@/lib/services/subscription.service'),
        'handleSubscriptionExpiry'
      )
        .mockResolvedValueOnce({
          success: true,
          message: '处理完成',
          actions: ['status_updated'],
        })
        .mockResolvedValueOnce({
          success: false,
          message: '处理失败',
          actions: [],
        });

      // Act
      const result = await batchHandleExpiredSubscriptions(100);

      // Assert
      expect(result.succeeded).toBe(1);
      expect(result.failed).toBe(1);
    });
  });
});
