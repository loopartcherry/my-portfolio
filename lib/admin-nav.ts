import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShoppingBag,
  CreditCard,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Activity,
  Database,
  TrendingUp,
  Palette,
  FileImage,
  ClipboardCheck,
} from "lucide-react";

export type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  badgeColor?: "primary" | "orange" | "red" | "green";
};

export const adminMainNav: NavItem[] = [
  { label: "控制台概览", icon: LayoutDashboard, href: "/admin/overview" },
  { label: "客户管理", icon: Users, href: "/admin/users", badge: "156", badgeColor: "primary" },
  { label: "设计师管理", icon: Palette, href: "/admin/designers", badge: "12", badgeColor: "primary" },
  { label: "项目管理", icon: Briefcase, href: "/admin/projects", badge: "45", badgeColor: "primary" },
  { label: "模板管理", icon: FileImage, href: "/admin/templates", badge: "100", badgeColor: "primary" },
  { label: "内容管理", icon: FileText, href: "/admin/contents", badge: "50", badgeColor: "primary" },
  { label: "订单管理", icon: ShoppingBag, href: "/admin/orders", badge: "8", badgeColor: "orange" },
  { label: "VCMA诊断", icon: ClipboardCheck, href: "/admin/diagnoses", badge: "新", badgeColor: "green" },
  { label: "财务管理", icon: CreditCard, href: "/admin/financials" },
];

export const adminSystemNav: NavItem[] = [];

export const adminSettingsNav: NavItem[] = [
  { label: "系统设置", icon: Settings, href: "/admin/settings" },
];
