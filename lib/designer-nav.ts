import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  FolderOpen,
  MessageSquare,
  MessageCircle,
  Users,
  Clock,
  BarChart3,
  User,
  Settings,
} from "lucide-react";

export type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
  badgeColor?: "primary" | "orange" | "red";
};

export const designerMainNav: NavItem[] = [
  { label: "工作台概览", icon: LayoutDashboard, href: "/designer/overview" },
  { label: "我的项目", icon: Briefcase, href: "/designer/projects", badge: "5", badgeColor: "primary" },
  { label: "我的任务", icon: CheckSquare, href: "/designer/tasks", badge: "12", badgeColor: "orange" },
];

export const designerCollaborationNav: NavItem[] = [];

export const designerDataNav: NavItem[] = [];

export const designerSettingsNav: NavItem[] = [
  { label: "个人设置", icon: Settings, href: "/designer/settings" },
];
