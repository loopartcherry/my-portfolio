"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Calendar, Clock } from "lucide-react";

interface ConsultationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnosisId: string;
}

export function ConsultationDialog({
  open,
  onOpenChange,
  diagnosisId,
}: ConsultationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
    type: "expert" as "expert" | "solution" | "custom",
  });

  const createConsultation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/consultations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          diagnosisId,
          ...data,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "预约失败");
      return json;
    },
    onSuccess: () => {
      toast.success("预约提交成功，我们将在24小时内联系您");
      onOpenChange(false);
      // 重置表单
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        preferredDate: "",
        preferredTime: "",
        message: "",
        type: "expert",
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createConsultation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#12121a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">预约专家咨询</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80">姓名 *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white/80">手机号 *</Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-white/80">邮箱 *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80">企业名称</Label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white/80">职位</Label>
              <Input
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-white/80">咨询类型</Label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v as any })}
            >
              <SelectTrigger className="mt-1 bg-[#0a0a0f] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#12121a] border-white/10">
                <SelectItem value="expert">专家咨询</SelectItem>
                <SelectItem value="solution">方案咨询</SelectItem>
                <SelectItem value="custom">定制咨询</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                 preferredDate
              </Label>
              <Input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white/80 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                 preferredTime
              </Label>
              <Select
                value={formData.preferredTime}
                onValueChange={(v) => setFormData({ ...formData, preferredTime: v })}
              >
                <SelectTrigger className="mt-1 bg-[#0a0a0f] border-white/10 text-white">
                  <SelectValue placeholder="选择时间" />
                </SelectTrigger>
                <SelectContent className="bg-[#12121a] border-white/10">
                  <SelectItem value="09:00-10:00">09:00-10:00</SelectItem>
                  <SelectItem value="10:00-11:00">10:00-11:00</SelectItem>
                  <SelectItem value="11:00-12:00">11:00-12:00</SelectItem>
                  <SelectItem value="14:00-15:00">14:00-15:00</SelectItem>
                  <SelectItem value="15:00-16:00">15:00-16:00</SelectItem>
                  <SelectItem value="16:00-17:00">16:00-17:00</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="text-white/80">留言</Label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="mt-1 w-full px-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
              placeholder="请描述您的具体需求..."
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-white/10"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-pink-500"
              disabled={createConsultation.isPending}
            >
              {createConsultation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  提交中...
                </>
              ) : (
                "提交预约"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
