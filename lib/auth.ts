import { UserRole } from "./types/user";
import { getUserPermissions, hasPermission } from "./types/user";

// 模拟当前用户（实际应该从 session/cookie 获取）
let currentUserRole: UserRole = "client";

// 设置当前用户角色（用于测试和开发）
export function setCurrentUserRole(role: UserRole) {
  currentUserRole = role;
}

// 获取当前用户角色
export function getCurrentUserRole(): UserRole {
  // 实际实现中应该从 session/cookie 获取
  return currentUserRole;
}

// 检查用户是否有权限
export function checkPermission(permission: keyof ReturnType<typeof getUserPermissions>): boolean {
  return hasPermission(currentUserRole, permission);
}

// 根据角色重定向到对应的 dashboard
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "designer":
      return "/designer/overview";
    case "admin":
      return "/admin/overview";
    case "client":
    default:
      return "/dashboard/overview";
  }
}

// 检查路由访问权限
export function canAccessRoute(path: string, role: UserRole): boolean {
  // 设计师路由
  if (path.startsWith("/designer")) {
    return role === "designer" || role === "admin";
  }
  
  // 管理员路由
  if (path.startsWith("/admin")) {
    return role === "admin";
  }
  
  // 客户路由（默认 dashboard）
  if (path.startsWith("/dashboard") && !path.startsWith("/designer") && !path.startsWith("/admin")) {
    return role === "client" || role === "admin";
  }
  
  return true; // 其他公开路由
}
