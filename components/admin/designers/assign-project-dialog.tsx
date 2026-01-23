"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useDesignerDetail, useAssignProject } from "@/hooks/use-designers";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface AssignProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designerId: string;
  projectId?: string; // 可选：如果从项目页面打开，直接传入项目ID
  onSuccess?: () => void;
}

export function AssignProjectDialog({
  open,
  onOpenChange,
  designerId,
  projectId: initialProjectId,
  onSuccess,
}: AssignProjectDialogProps) {
  const [projectId, setProjectId] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [priority, setPriority] = useState("high");
  const [note, setNote] = useState("");

  const { data: designer, isLoading } = useDesignerDetail(designerId);
  const assignMutation = useAssignProject();

  // 从 API 获取待分配的项目列表
  const { data: pendingProjectsData } = useQuery({
    queryKey: ["pending-projects"],
    queryFn: async () => {
      const res = await fetch("/api/admin/projects/pending", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("获取待处理项目失败");
      return res.json();
    },
    enabled: open,
  });

  const availableProjects = pendingProjectsData?.data || [];

  const utilization = designer?.maxCapacity
    ? Math.round((designer.currentLoad / designer.maxCapacity) * 100)
    : 0;
  const canAssign = designer && designer.currentLoad < designer.maxCapacity;
  const isOnLeave =
    designer?.status === "on_leave" &&
    designer.leaveFrom &&
    designer.leaveTo &&
    new Date() >= new Date(designer.leaveFrom) &&
    new Date() <= new Date(designer.leaveTo);

  const handleSubmit = async () => {
    if (!projectId) return;

    try {
      await assignMutation.mutateAsync({
        designerId,
        projectId,
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
        priority: priority === "low" ? 0 : priority === "medium" ? 1 : priority === "high" ? 2 : 3,
      });
      onSuccess?.();
    } catch (error) {
      // Error handled by mutation
    }
  };

  useEffect(() => {
    if (open && initialProjectId) {
      setProjectId(initialProjectId);
    }
  }, [open, initialProjectId]);

  useEffect(() => {
    if (!open) {
      if (!initialProjectId) {
        setProjectId("");
      }
      setEstimatedHours("");
      setPriority("high");
      setNote("");
    }
  }, [open, initialProjectId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12121a] border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">分配项目给 {designer?.name || "设计师"}</DialogTitle>
          <DialogDescription className="text-white/60">
            为设计师分配新项目，系统会自动检查负载和可用性
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Workload Info */}
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">当前负载</span>
                <span className="text-sm font-medium text-white">
                  {designer?.currentLoad || 0} / {designer?.maxCapacity || 0}
                </span>
              </div>
              <Progress value={utilization} className="h-2 mb-2" />
              {canAssign ? (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>还可分配 {designer ? designer.maxCapacity - designer.currentLoad : 0} 个项目</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>当前已满载，无法分配新项目</span>
                </div>
              )}
            </div>

            {/* Warnings */}
            {isOnLeave && (
              <Alert className="bg-yellow-500/10 border-yellow-500/20">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-400">
                  设计师当前处于休假期间（{designer.leaveFrom && new Date(designer.leaveFrom).toLocaleDateString()} - {designer.leaveTo && new Date(designer.leaveTo).toLocaleDateString()}），建议暂不分配新项目
                </AlertDescription>
              </Alert>
            )}

            {/* Project Selection */}
            {!initialProjectId ? (
              <div className="space-y-2">
                <Label htmlFor="project" className="text-white/80">
                  选择项目 <span className="text-red-400">*</span>
                </Label>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger
                    id="project"
                    className="bg-white/5 border-white/10 text-white"
                    disabled={!canAssign}
                  >
                    <SelectValue placeholder="选择要分配的项目" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    {availableProjects.length === 0 ? (
                      <SelectItem value="" disabled className="text-white/40">
                        暂无待处理项目
                      </SelectItem>
                    ) : (
                      availableProjects.map((project: any) => {
                        const priorityLabels: Record<string, string> = {
                          urgent: "紧急",
                          high: "高",
                          medium: "中",
                          low: "低",
                        };
                        return (
                          <SelectItem
                            key={project.id}
                            value={project.id}
                            className="text-white/80 hover:bg-white/5"
                          >
                            {project.name} ({priorityLabels[project.priority] || project.priority})
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-sm text-white/60 mb-1">分配项目</div>
                <div className="text-base font-medium text-white">
                  {availableProjects.find((p: any) => p.id === initialProjectId)?.name || `项目 #${initialProjectId.slice(0, 8)}`}
                </div>
              </div>
            )}

            {/* Estimated Hours */}
            <div className="space-y-2">
              <Label htmlFor="hours" className="text-white/80">
                预估工时（小时）
              </Label>
              <Input
                id="hours"
                type="number"
                min="0"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="如：40"
                className="bg-white/5 border-white/10 text-white"
              />
              <p className="text-xs text-white/40">默认从项目配置自动填充</p>
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <Label className="text-white/80">优先级</Label>
              <RadioGroup value={priority} onValueChange={setPriority} className="grid grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" className="border-white/30" />
                  <Label htmlFor="low" className="text-white/60 cursor-pointer">
                    低
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" className="border-white/30" />
                  <Label htmlFor="medium" className="text-white/60 cursor-pointer">
                    中
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" className="border-white/30" />
                  <Label htmlFor="high" className="text-white/60 cursor-pointer">
                    高
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="urgent" id="urgent" className="border-white/30" />
                  <Label htmlFor="urgent" className="text-white/60 cursor-pointer">
                    紧急
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <Label htmlFor="note" className="text-white/80">
                分配说明（可选）
              </Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="添加分配说明..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-white/10 text-white/60 hover:text-white"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canAssign || !projectId || assignMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {assignMutation.isPending ? "分配中..." : "确认分配"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
