import {
  Home,
  FolderKanban,
  CreditCard,
  FileText,
  Settings,
  Gift,
  ClipboardCheck,
  ShoppingBag,
} from "lucide-react";

export type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  badgeColor?: "primary" | "orange";
  active?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "控制台", icon: Home, href: "/dashboard/overview" },
  { label: "我的项目", icon: FolderKanban, href: "/dashboard/projects", badge: "12", badgeColor: "primary" },
  { label: "VCMA诊断", icon: ClipboardCheck, href: "/dashboard/vcma" },
  { label: "我的订单", icon: ShoppingBag, href: "/dashboard/orders", badge: "3", badgeColor: "primary" },
  { label: "订阅管理", icon: CreditCard, href: "/dashboard/subscription" },
  { label: "文件管理", icon: FileText, href: "/dashboard/files" },
];

export const otherNav: NavItem[] = [
  { label: "账户设置", icon: Settings, href: "/dashboard/settings" },
  { label: "推荐返佣", icon: Gift, href: "/dashboard/referral" },
];
