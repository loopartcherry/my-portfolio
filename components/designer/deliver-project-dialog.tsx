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
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeliverProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName?: string;
  onSuccess?: () => void;
}

export function DeliverProjectDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  onSuccess,
}: DeliverProjectDialogProps) {
  const [deliveryLink, setDeliveryLink] = useState("");
  const queryClient = useQueryClient();

  // 提交交付 mutation
  const deliverMutation = useMutation({
    mutationFn: async (link: string) => {
      const res = await fetch(`/api/designer/projects/${projectId}/deliver`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ deliveryLink: link }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "提交交付失败");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("交付物已提交，等待客户验收");
      queryClient.invalidateQueries({ queryKey: ["designer-projects"] });
      onSuccess?.();
      onOpenChange(false);
      setDeliveryLink("");
    },
    onError: (error: Error) => {
      toast.error(error.message || "提交交付失败");
    },
  });

  const handleSubmit = () => {
    if (!deliveryLink.trim()) {
      toast.error("请输入交付物链接");
      return;
    }
    deliverMutation.mutate(deliveryLink.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12121a] border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">提交交付物</DialogTitle>
          <DialogDescription className="text-white/60">
            {projectName || `项目 #${projectId.slice(0, 8)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryLink" className="text-white/80">
              交付物链接 <span className="text-red-400">*</span>
            </Label>
            <Input
              id="deliveryLink"
              type="url"
              value={deliveryLink}
              onChange={(e) => setDeliveryLink(e.target.value)}
              placeholder="https://example.com/delivery"
              className="bg-white/5 border-white/10 text-white"
            />
            <p className="text-xs text-white/40">
              请输入交付物的访问链接（如网盘链接、Figma 链接等）
            </p>
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
            disabled={!deliveryLink.trim() || deliverMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {deliverMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                提交中...
              </>
            ) : (
              "确认提交"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
