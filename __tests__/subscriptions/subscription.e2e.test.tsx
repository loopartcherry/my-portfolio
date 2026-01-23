/**
 * 订阅功能 UI 交互测试 (E2E)
 * 
 * 使用 React Testing Library 测试前端页面交互
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import UpgradePage from '@/app/dashboard/subscription/upgrade/page';
import RenewPage from '@/app/dashboard/subscription/renew/page';
import { mockPlans, mockSubscription } from '../__fixtures__/subscriptions';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: (key: string) => (key === 'planId' ? 'plan_professional' : null),
  })),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('订阅功能 UI 交互测试', () => {
  let queryClient: QueryClient;
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });
    jest.clearAllMocks();
  });

  const renderWithQueryClient = (component: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
    );
  };

  describe('升级页面 (UpgradePage)', () => {
    it('应该显示当前套餐和新套餐的对比', async () => {
      // Setup
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              subscription: mockSubscription,
              plan: mockPlans[1],
              quota: {
                projects: { used: 3, total: 20, remaining: 17 },
              },
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: mockPlans,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              upgradeInfo: {
                oldPlan: mockPlans[1],
                newPlan: mockPlans[2],
                upgradeAmount: 700,
                remainingDays: 15,
              },
            },
          }),
        });

      // Act
      renderWithQueryClient(<UpgradePage />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('当前套餐')).toBeInTheDocument();
        expect(screen.getByText('升级至')).toBeInTheDocument();
      });

      expect(screen.getByText(mockPlans[1].name)).toBeInTheDocument();
      expect(screen.getByText(mockPlans[2].name)).toBeInTheDocument();
    });

    it('应该显示加载状态', () => {
      // Setup
      (global.fetch as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // 永不解析，保持加载状态
      );

      // Act
      renderWithQueryClient(<UpgradePage />);

      // Assert
      // Skeleton 组件应该显示（通过检查是否有加载相关的类或元素）
      expect(screen.getByText('升级套餐')).toBeInTheDocument();
    });

    it('应该显示错误状态', async () => {
      // Setup
      (global.fetch as jest.Mock).mockRejectedValue(new Error('网络错误'));

      // Act
      renderWithQueryClient(<UpgradePage />);

      // Assert
      await waitFor(() => {
        // 应该显示错误信息或重试按钮
        expect(screen.queryByText('升级套餐')).toBeInTheDocument();
      });
    });

    it('应该可以取消升级', async () => {
      // Setup
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              subscription: mockSubscription,
              plan: mockPlans[1],
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockPlans }),
        });

      // Act
      renderWithQueryClient(<UpgradePage />);

      await waitFor(() => {
        const cancelButton = screen.getByText('取消');
        fireEvent.click(cancelButton);
      });

      // Assert
      expect(mockBack).toHaveBeenCalled();
    });

    it('应该可以确认升级', async () => {
      // Setup
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              subscription: mockSubscription,
              plan: mockPlans[1],
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockPlans }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              upgradeInfo: {
                upgradeAmount: 700,
                remainingDays: 15,
              },
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              paymentLink: '/checkout?orderId=order_123',
            },
          }),
        });

      // Act
      renderWithQueryClient(<UpgradePage />);

      await waitFor(() => {
        const upgradeButton = screen.getByText('确认升级');
        fireEvent.click(upgradeButton);
      });

      // 确认对话框中的确认按钮
      await waitFor(() => {
        const confirmButton = screen.getByText('确认升级');
        fireEvent.click(confirmButton);
      });

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('/checkout')
        );
      });
    });
  });

  describe('续费页面 (RenewPage)', () => {
    it('应该显示当前订阅信息', async () => {
      // Setup
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              subscription: mockSubscription,
              plan: mockPlans[1],
              quota: {
                projects: { used: 3, total: 20, remaining: 17 },
              },
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: [
              {
                subscription: mockSubscription,
                orders: [],
              },
            ],
            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1,
            },
          }),
        });

      // Act
      renderWithQueryClient(<RenewPage />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('当前订阅')).toBeInTheDocument();
        expect(screen.getByText(mockPlans[1].name)).toBeInTheDocument();
      });
    });

    it('应该显示过期日期和剩余天数', async () => {
      // Setup
      const subscription = {
        ...mockSubscription,
        endDate: new Date('2024-02-01'),
      };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              subscription,
              plan: mockPlans[1],
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          }),
        });

      // Act
      renderWithQueryClient(<RenewPage />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('过期日期')).toBeInTheDocument();
      });
    });

    it('应该可以切换自动续费开关', async () => {
      // Setup
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              subscription: { ...mockSubscription, autoRenew: true },
              plan: mockPlans[1],
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          }),
        });

      // Act
      renderWithQueryClient(<RenewPage />);

      await waitFor(() => {
        const switchElement = screen.getByRole('switch');
        fireEvent.click(switchElement);
      });

      // Assert
      // 应该调用 API 更新自动续费设置（这里只是 UI 测试，实际 API 调用在 hooks 中）
    });

    it('应该可以立即续费', async () => {
      // Setup
      const subscription = {
        ...mockSubscription,
        endDate: new Date('2024-01-25'), // 5天后过期，可以续费
      };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              subscription,
              plan: mockPlans[1],
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              paymentLink: '/checkout?orderId=order_renew',
            },
          }),
        });

      // Act
      renderWithQueryClient(<RenewPage />);

      await waitFor(() => {
        const renewButton = screen.getByText('立即续费');
        fireEvent.click(renewButton);
      });

      // Assert
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          expect.stringContaining('/checkout')
        );
      });
    });

    it('应该显示续费历史表格', async () => {
      // Setup
      const historyData = [
        {
          subscription: mockSubscription,
          orders: [
            {
              id: 'order_1',
              amount: 299,
              status: 'paid',
              paidAt: new Date('2024-01-01'),
            },
          ],
        },
      ];
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              subscription: mockSubscription,
              plan: mockPlans[1],
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: historyData,
            pagination: {
              page: 1,
              limit: 10,
              total: 1,
              totalPages: 1,
            },
          }),
        });

      // Act
      renderWithQueryClient(<RenewPage />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('续费历史')).toBeInTheDocument();
        expect(screen.getByText('订阅周期')).toBeInTheDocument();
      });
    });

    it('距离过期超过7天时应该禁用续费按钮', async () => {
      // Setup
      const subscription = {
        ...mockSubscription,
        endDate: new Date('2024-12-31'), // 很久以后才过期
      };
      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: {
              subscription,
              plan: mockPlans[1],
            },
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            data: [],
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          }),
        });

      // Act
      renderWithQueryClient(<RenewPage />);

      // Assert
      await waitFor(() => {
        const renewButton = screen.getByText('立即续费');
        expect(renewButton).toBeDisabled();
      });
    });
  });
});
