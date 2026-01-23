"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AssignProjectSimpleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName?: string;
  onSuccess?: () => void;
}

export function AssignProjectSimpleDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  onSuccess,
}: AssignProjectSimpleDialogProps) {
  const [designerId, setDesignerId] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const queryClient = useQueryClient();

  // 获取设计师列表
  const { data: designersData, isLoading: loadingDesigners } = useQuery({
    queryKey: ["designers-list"],
    queryFn: async () => {
      const res = await fetch("/api/admin/designers", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("获取设计师列表失败");
      return res.json();
    },
    enabled: open,
  });

  const designers = designersData?.data || [];

  // 分配项目 mutation
  const assignMutation = useMutation({
    mutationFn: async (data: { designerId: string; estimatedHours?: number }) => {
      const res = await fetch(`/api/admin/designers/${data.designerId}/assign-project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projectId,
          estimatedHours: data.estimatedHours,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "分配失败");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("项目分配成功");
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      queryClient.invalidateQueries({ queryKey: ["pending-projects"] });
      onSuccess?.();
      onOpenChange(false);
      setDesignerId("");
      setEstimatedHours("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "分配失败");
    },
  });

  const handleSubmit = () => {
    if (!designerId) {
      toast.error("请选择设计师");
      return;
    }
    assignMutation.mutate({
      designerId,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12121a] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">分配项目</DialogTitle>
          <DialogDescription className="text-white/60">
            {projectName || `项目 #${projectId.slice(0, 8)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="designer" className="text-white/80">
              选择设计师 <span className="text-red-400">*</span>
            </Label>
            {loadingDesigners ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : (
              <Select value={designerId} onValueChange={setDesignerId}>
                <SelectTrigger
                  id="designer"
                  className="bg-white/5 border-white/10 text-white"
                >
                  <SelectValue placeholder="选择设计师" />
                </SelectTrigger>
                <SelectContent className="bg-[#12121a] border-white/10">
                  {designers.length === 0 ? (
                    <SelectItem value="" disabled className="text-white/40">
                      暂无可用设计师
                    </SelectItem>
                  ) : (
                    designers.map((designer: any) => (
                      <SelectItem
                        key={designer.id}
                        value={designer.id}
                        className="text-white/80 hover:bg-white/5"
                      >
                        {designer.name || designer.email} 
                        {designer.currentLoad !== undefined && designer.maxCapacity !== undefined && (
                          <span className="text-white/40 ml-2">
                            ({designer.currentLoad}/{designer.maxCapacity})
                          </span>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours" className="text-white/80">
              预估工时（小时，可选）
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
          </div>
        </div>

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
            disabled={!designerId || assignMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {assignMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                分配中...
              </>
            ) : (
              "确认分配"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
