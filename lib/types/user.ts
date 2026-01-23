// 用户角色类型（与 Prisma schema 保持一致）
export type UserRole = "client" | "designer" | "admin";

// 用户信息类型
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  position?: string;
  skills?: string[];
  bio?: string;
  employeeId?: string; // 设计师工号
  joinDate?: string; // 入职日期
  subscription?: string; // 客户订阅信息
  createdAt: string;
  updatedAt: string;
}

// 权限配置
export interface Permission {
  // 项目相关
  viewAllProjects: boolean;
  viewAssignedProjects: boolean;
  createProject: boolean;
  editProject: boolean;
  deleteProject: boolean;
  
  // 任务相关
  viewAllTasks: boolean;
  viewAssignedTasks: boolean;
  createTask: boolean;
  editTask: boolean;
  deleteTask: boolean;
  
  // 文件相关
  uploadFile: boolean;
  downloadFile: boolean;
  deleteFile: boolean;
  viewAllFiles: boolean;
  
  // 用户相关
  viewUsers: boolean;
  createUser: boolean;
  editUser: boolean;
  deleteUser: boolean;
  
  // 订单和财务
  viewOrders: boolean;
  viewFinancials: boolean;
  manageOrders: boolean;
  
  // 系统设置
  viewSettings: boolean;
  editSettings: boolean;
  
  // 数据统计
  viewAnalytics: boolean;
  viewReports: boolean;
}

// 角色权限配置
export const rolePermissions: Record<UserRole, Permission> = {
  client: {
    viewAllProjects: false,
    viewAssignedProjects: true, // 只能看自己的项目
    createProject: true,
    editProject: true, // 只能编辑自己的项目
    deleteProject: false,
    viewAllTasks: false,
    viewAssignedTasks: true,
    createTask: false,
    editTask: false,
    deleteTask: false,
    uploadFile: false,
    downloadFile: true,
    deleteFile: false,
    viewAllFiles: false,
    viewUsers: false,
    createUser: false,
    editUser: false,
    deleteUser: false,
    viewOrders: true,
    viewFinancials: false,
    manageOrders: false,
    viewSettings: false,
    editSettings: false,
    viewAnalytics: false,
    viewReports: false,
  },
  designer: {
    viewAllProjects: false,
    viewAssignedProjects: true, // 只能看分配给自己的项目
    createProject: false,
    editProject: false,
    deleteProject: false,
    viewAllTasks: false,
    viewAssignedTasks: true, // 只能看分配给自己的任务
    createTask: false,
    editTask: true, // 可以更新任务状态
    deleteTask: false,
    uploadFile: true, // 可以上传设计文件
    downloadFile: true,
    deleteFile: true, // 可以删除自己上传的文件
    viewAllFiles: false,
    viewUsers: false,
    createUser: false,
    editUser: false,
    deleteUser: false,
    viewOrders: false, // 无法访问财务信息
    viewFinancials: false,
    manageOrders: false,
    viewSettings: false,
    editSettings: false,
    viewAnalytics: true, // 可以看自己的统计
    viewReports: false,
  },
  admin: {
    viewAllProjects: true,
    viewAssignedProjects: true,
    createProject: true,
    editProject: true,
    deleteProject: true,
    viewAllTasks: true,
    viewAssignedTasks: true,
    createTask: true,
    editTask: true,
    deleteTask: true,
    uploadFile: true,
    downloadFile: true,
    deleteFile: true,
    viewAllFiles: true,
    viewUsers: true,
    createUser: true,
    editUser: true,
    deleteUser: true,
    viewOrders: true,
    viewFinancials: true,
    manageOrders: true,
    viewSettings: true,
    editSettings: true,
    viewAnalytics: true,
    viewReports: true,
  },
};

// 获取用户权限
export function getUserPermissions(role: UserRole): Permission {
  return rolePermissions[role];
}

// 检查权限
export function hasPermission(role: UserRole, permission: keyof Permission): boolean {
  return rolePermissions[role][permission];
}
