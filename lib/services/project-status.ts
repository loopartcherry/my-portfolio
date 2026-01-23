/**
 * 项目状态机
 * 定义项目状态的流转规则和验证逻辑
 */

export type ProjectStatus = 
  | 'PENDING'      // 待处理：客户已创建，等待管理员分配
  | 'ASSIGNED'     // 已分配：管理员已分配给设计师
  | 'IN_PROGRESS'  // 进行中：设计师正在工作
  | 'REVIEW'       // 待验收：设计师已提交交付物，等待客户验收
  | 'COMPLETED'    // 已完成：客户已验收通过
  | 'CANCELLED';   // 已取消

/**
 * 状态流转图
 * 
 * PENDING → ASSIGNED → IN_PROGRESS → REVIEW → COMPLETED
 *    ↓                                    ↓
 * CANCELLED                          CANCELLED
 * 
 * 规则：
 * 1. 只能按顺序流转，不能跳过中间状态
 * 2. 可以从任何状态转为 CANCELLED（取消）
 * 3. COMPLETED 是终态，不能再转换
 */

/**
 * 状态流转映射表
 * 定义每个状态可以转换到哪些状态
 */
const STATUS_TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  PENDING: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['REVIEW', 'CANCELLED'],
  REVIEW: ['COMPLETED', 'CANCELLED', 'IN_PROGRESS'], // 验收不通过可以退回修改
  COMPLETED: [], // 终态，不能再转换
  CANCELLED: [], // 终态，不能再转换
};

/**
 * 检查状态转换是否有效
 * @param currentStatus 当前状态
 * @param targetStatus 目标状态
 * @returns 是否允许转换
 */
export function canTransitionStatus(
  currentStatus: ProjectStatus,
  targetStatus: ProjectStatus
): boolean {
  // 如果状态相同，不允许转换
  if (currentStatus === targetStatus) {
    return false;
  }

  // 检查目标状态是否在允许的转换列表中
  const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
  return allowedTransitions.includes(targetStatus);
}

/**
 * 验证状态转换并返回错误信息
 * @param currentStatus 当前状态
 * @param targetStatus 目标状态
 * @returns 验证结果和错误信息
 */
export function validateStatusTransition(
  currentStatus: ProjectStatus,
  targetStatus: ProjectStatus
): { valid: boolean; error?: string } {
  if (!canTransitionStatus(currentStatus, targetStatus)) {
    const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
    return {
      valid: false,
      error: `无法从状态 "${getStatusLabel(currentStatus)}" 转换到 "${getStatusLabel(targetStatus)}"。允许的转换：${allowedTransitions.map(s => getStatusLabel(s)).join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * 获取状态的中文标签
 */
export function getStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    PENDING: '待处理',
    ASSIGNED: '已分配',
    IN_PROGRESS: '进行中',
    REVIEW: '待验收',
    COMPLETED: '已完成',
    CANCELLED: '已取消',
  };
  return labels[status];
}

/**
 * 获取状态的描述
 */
export function getStatusDescription(status: ProjectStatus): string {
  const descriptions: Record<ProjectStatus, string> = {
    PENDING: '项目已创建，等待管理员分配设计师',
    ASSIGNED: '项目已分配给设计师，等待设计师开始工作',
    IN_PROGRESS: '设计师正在工作中',
    REVIEW: '设计师已提交交付物，等待客户验收',
    COMPLETED: '客户已验收通过，项目完成',
    CANCELLED: '项目已取消',
  };
  return descriptions[status];
}

/**
 * 获取状态的颜色（用于 UI 显示）
 */
export function getStatusColor(status: ProjectStatus): {
  bg: string;
  text: string;
  border: string;
} {
  const colors: Record<ProjectStatus, { bg: string; text: string; border: string }> = {
    PENDING: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
    },
    ASSIGNED: {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
    },
    IN_PROGRESS: {
      bg: 'bg-primary/20',
      text: 'text-primary',
      border: 'border-primary/30',
    },
    REVIEW: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-400',
      border: 'border-orange-500/30',
    },
    COMPLETED: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
    },
    CANCELLED: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
    },
  };
  return colors[status];
}

/**
 * 检查状态是否为终态
 */
export function isTerminalStatus(status: ProjectStatus): boolean {
  return status === 'COMPLETED' || status === 'CANCELLED';
}

/**
 * 检查状态是否允许编辑
 */
export function canEditProject(status: ProjectStatus): boolean {
  // 只有待处理和已取消的项目可以编辑基本信息
  return status === 'PENDING' || status === 'CANCELLED';
}

/**
 * 检查状态是否允许分配
 */
export function canAssignProject(status: ProjectStatus): boolean {
  return status === 'PENDING';
}

/**
 * 检查状态是否允许交付
 */
export function canDeliverProject(status: ProjectStatus): boolean {
  return status === 'IN_PROGRESS' || status === 'ASSIGNED';
}

/**
 * 检查状态是否允许验收
 */
export function canApproveProject(status: ProjectStatus): boolean {
  return status === 'REVIEW';
}
