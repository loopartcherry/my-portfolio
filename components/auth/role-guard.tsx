"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRole } from "@/lib/types/user";
import { canAccessRoute, getCurrentUserRole, getDashboardPath } from "@/lib/auth";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentRole = getCurrentUserRole();

  useEffect(() => {
    // 如果指定了允许的角色，检查当前角色是否在允许列表中
    if (allowedRoles && !allowedRoles.includes(currentRole)) {
      const redirect = redirectTo || getDashboardPath(currentRole);
      router.push(redirect);
      return;
    }

    // 检查路由访问权限
    if (!canAccessRoute(pathname, currentRole)) {
      const redirect = getDashboardPath(currentRole);
      router.push(redirect);
    }
  }, [pathname, currentRole, allowedRoles, redirectTo, router]);

  // 如果角色不匹配，不渲染子组件
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return null;
  }

  if (!canAccessRoute(pathname, currentRole)) {
    return null;
  }

  return <>{children}</>;
}
