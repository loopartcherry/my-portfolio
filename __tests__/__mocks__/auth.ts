/**
 * Auth Mock
 * 用于测试中模拟认证
 */

export const mockAuth = {
  getCurrentUserId: jest.fn(),
  requireAuth: jest.fn(),
  requireRole: jest.fn(),
  requireClient: jest.fn(),
  getCurrentUserRole: jest.fn(),
};

// Mock auth module
jest.mock('@/lib/api/auth', () => ({
  getCurrentUserId: mockAuth.getCurrentUserId,
  requireAuth: mockAuth.requireAuth,
  requireRole: mockAuth.requireRole,
  requireClient: mockAuth.requireClient,
}));

jest.mock('@/lib/auth', () => ({
  getCurrentUserRole: mockAuth.getCurrentUserRole,
}));
