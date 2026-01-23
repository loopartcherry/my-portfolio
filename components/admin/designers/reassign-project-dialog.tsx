"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useDesignersList, useReassignProject } from "@/hooks/use-designers";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ReassignProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designerId: string;
  projectId: string;
  projectName?: string;
  onSuccess?: () => void;
}

export function ReassignProjectDialog({
  open,
  onOpenChange,
  designerId,
  projectId,
  projectName,
  onSuccess,
}: ReassignProjectDialogProps) {
  const [newDesignerId, setNewDesignerId] = useState("");
  const [reason, setReason] = useState("");
  const [notifyDesigner, setNotifyDesigner] = useState(true);

  const { data: designers = [], isLoading } = useDesignersList({ status: "active" });
  const reassignMutation = useReassignProject();

  // Filter out current designer
  const availableDesigners = designers.filter((d: any) => d.id !== designerId);

  const handleSubmit = async () => {
    if (!newDesignerId || !reason.trim()) return;

    try {
      await reassignMutation.mutateAsync({
        designerId,
        projectId,
        newDesignerId,
        reason: reason.trim(),
      });
      onSuccess?.();
    } catch (error) {
      // Error handled by mutation
    }
  };

  useEffect(() => {
    if (!open) {
      setNewDesignerId("");
      setReason("");
      setNotifyDesigner(true);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12121a] border-white/10 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">重新分配项目</DialogTitle>
          <DialogDescription className="text-white/60">
            项目：{projectName || projectId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Assignment Info */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">当前设计师</span>
                <span className="text-white">
                  {designers.find((d: any) => d.id === designerId)?.name || "未知"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">项目ID</span>
                <span className="text-white">{projectId}</span>
              </div>
            </div>
          </div>

          {/* New Designer Selection */}
          <div className="space-y-2">
            <Label htmlFor="newDesigner" className="text-white/80">
              选择新设计师 <span className="text-red-400">*</span>
            </Label>
            {isLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select value={newDesignerId} onValueChange={setNewDesignerId}>
                <SelectTrigger
                  id="newDesigner"
                  className="bg-white/5 border-white/10 text-white"
                >
                  <SelectValue placeholder="选择新设计师" />
                </SelectTrigger>
                <SelectContent className="bg-[#12121a] border-white/10">
                  {availableDesigners.map((designer: any) => {
                    const utilization = designer.maxCapacity > 0
                      ? Math.round((designer.currentLoad / designer.maxCapacity) * 100)
                      : 0;
                    const canAssign = designer.currentLoad < designer.maxCapacity;
                    return (
                      <SelectItem
                        key={designer.id}
                        value={designer.id}
                        className={cn(
                          "text-white/80 hover:bg-white/5",
                          !canAssign && "opacity-50"
                        )}
                        disabled={!canAssign}
                      >
                        {designer.name} ({designer.currentLoad}/{designer.maxCapacity}, ⭐{designer.rating?.toFixed(1) || "0.0"})
                        {!canAssign && " - 已满载"}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white/80">
              重新分配原因 <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="如：设计师病假、需要更专业的设计..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/30 resize-none"
              rows={4}
              required
            />
          </div>

          {/* Notify Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="notify"
              checked={notifyDesigner}
              onCheckedChange={(checked) => setNotifyDesigner(checked === true)}
            />
            <Label htmlFor="notify" className="text-white/60 cursor-pointer">
              是否通知原设计师
            </Label>
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
            disabled={!newDesignerId || !reason.trim() || reassignMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {reassignMutation.isPending ? "重新分配中..." : "确认重新分配"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
