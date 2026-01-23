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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"client" | "designer" | "admin">("client");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("3");
  const [specialtyInput, setSpecialtyInput] = useState("");

  const createMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      password?: string;
      name: string;
      phone?: string;
      role: "client" | "designer" | "admin";
      specialties?: string[];
      hourlyRate?: number;
      maxCapacity?: number;
    }) => {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error?.message || "创建失败");
      return json;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] });
      toast.success("用户创建成功");
      onOpenChange(false);
      // 重置表单
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setRole("client");
      setSpecialties([]);
      setHourlyRate("");
      setMaxCapacity("3");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addSpecialty = () => {
    if (specialtyInput && !specialties.includes(specialtyInput)) {
      setSpecialties([...specialties, specialtyInput]);
      setSpecialtyInput("");
    }
  };

  const removeSpecialty = (s: string) => {
    setSpecialties(specialties.filter((x) => x !== s));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      email,
      password: password || undefined,
      name,
      phone: phone || undefined,
      role,
      specialties: role === "designer" && specialties.length > 0 ? specialties : undefined,
      hourlyRate: role === "designer" && hourlyRate ? parseFloat(hourlyRate) : undefined,
      maxCapacity: role === "designer" && maxCapacity ? parseInt(maxCapacity, 10) : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#12121a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">创建用户</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80">邮箱 *</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
            <div>
              <Label className="text-white/80">姓名 *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white/80">密码</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="留空则自动生成"
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
              <p className="text-xs text-white/40 mt-1">留空将自动生成8位随机密码</p>
            </div>
            <div>
              <Label className="text-white/80">手机号</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
          </div>

          <div>
            <Label className="text-white/80">角色 *</Label>
            <Select value={role} onValueChange={(v) => setRole(v as any)}>
              <SelectTrigger className="mt-1 bg-[#0a0a0f] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#12121a] border-white/10">
                <SelectItem value="client">客户</SelectItem>
                <SelectItem value="designer">设计师</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "designer" && (
            <>
              <div>
                <Label className="text-white/80">技能</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={specialtyInput}
                    onChange={(e) => setSpecialtyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSpecialty();
                      }
                    }}
                    placeholder="输入技能后按 Enter"
                    className="bg-[#0a0a0f] border-white/10 text-white"
                  />
                  <Button type="button" onClick={addSpecialty} variant="outline" className="border-white/10">
                    添加
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialties.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/10 text-sm"
                    >
                      {s}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(s)}
                        className="text-white/40 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/80">时薪（元）</Label>
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80">最大容量</Label>
                  <Input
                    type="number"
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                    className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                  />
                </div>
              </div>
            </>
          )}

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
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  创建中...
                </>
              ) : (
                "创建用户"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
