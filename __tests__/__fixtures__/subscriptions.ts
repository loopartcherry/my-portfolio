/**
 * 订阅功能测试的 Mock 数据和 Fixtures
 */

export const mockUser = {
  id: 'user_123',
  email: 'test@example.com',
  name: '测试用户',
  role: 'customer' as const,
};

export const mockPlans = [
  {
    id: 'plan_basic',
    name: '基础版',
    description: '适合个人用户',
    price: 99,
    yearlyPrice: 990,
    features: ['5个项目', '10GB存储', '1个团队成员'],
    maxProjects: 5,
    maxStorage: 10,
    maxTeamMembers: 1,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'plan_professional',
    name: '专业版',
    description: '适合小型团队',
    price: 299,
    yearlyPrice: 2990,
    features: ['20个项目', '100GB存储', '5个团队成员'],
    maxProjects: 20,
    maxStorage: 100,
    maxTeamMembers: 5,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'plan_enterprise',
    name: '企业版',
    description: '适合大型团队',
    price: 999,
    yearlyPrice: 9990,
    features: ['无限项目', '1TB存储', '无限团队成员'],
    maxProjects: 0, // 0 表示无限制
    maxStorage: 1000,
    maxTeamMembers: 0, // 0 表示无限制
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const mockSubscription = {
  id: 'sub_123',
  userId: 'user_123',
  planId: 'plan_professional',
  type: 'monthly' as const,
  status: 'active' as const,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-02-01'),
  price: 299,
  autoRenew: true,
  cancelledAt: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  plan: mockPlans[1],
};

export const mockOrder = {
  id: 'order_123',
  userId: 'user_123',
  type: 'subscription' as const,
  amount: 299,
  status: 'paid' as const,
  subscriptionId: 'sub_123',
  transactionId: 'txn_123',
  paidAt: new Date('2024-01-01'),
  metadata: {
    planId: 'plan_professional',
    planName: '专业版',
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockProject = {
  id: 'project_123',
  userId: 'user_123',
  name: '测试项目',
  status: 'active',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

/**
 * 创建测试用的订阅数据
 */
export function createMockSubscription(overrides = {}) {
  return {
    ...mockSubscription,
    ...overrides,
  };
}

/**
 * 创建测试用的订单数据
 */
export function createMockOrder(overrides = {}) {
  return {
    ...mockOrder,
    ...overrides,
  };
}

/**
 * 创建测试用的项目数据
 */
export function createMockProject(overrides = {}) {
  return {
    ...mockProject,
    ...overrides,
  };
}
