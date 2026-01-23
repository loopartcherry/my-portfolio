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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useDesignerDetail, useUpdateDesigner, useCreateDesigner } from "@/hooks/use-designers";
import { Skeleton } from "@/components/ui/skeleton";

interface EditDesignerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  designerId: string | null;
  onSuccess?: () => void;
}

const commonSpecialties = [
  "Logo设计",
  "VI系统",
  "网站设计",
  "品牌策划",
  "UI设计",
  "插画设计",
  "包装设计",
  "平面设计",
];

export function EditDesignerModal({
  open,
  onOpenChange,
  designerId,
  onSuccess,
}: EditDesignerModalProps) {
  const isCreating = !designerId;
  const { data: designer, isLoading } = useDesignerDetail(designerId);
  const updateMutation = useUpdateDesigner();
  const createMutation = useCreateDesigner();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [status, setStatus] = useState<"active" | "inactive" | "on_leave">("active");
  const [newSpecialty, setNewSpecialty] = useState("");

  useEffect(() => {
    if (open) {
      if (designer) {
        setName(designer.name || "");
        setEmail(designer.email || "");
        setSpecialties((designer.specialties as string[]) || []);
        setHourlyRate(designer.hourlyRate?.toString() || "");
        setMaxCapacity(designer.maxCapacity?.toString() || "");
        setStatus(designer.status || "active");
      } else if (isCreating) {
        setName("");
        setEmail("");
        setPhone("");
        setSpecialties([]);
        setHourlyRate("");
        setMaxCapacity("5");
        setStatus("active");
      }
    }
  }, [open, designer, isCreating]);

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const handleRemoveSpecialty = (skill: string) => {
    setSpecialties(specialties.filter((s) => s !== skill));
  };

  const handleSubmit = async () => {
    if (isCreating) {
      if (!email) return;
      try {
        await createMutation.mutateAsync({
          email,
          name: name || undefined,
          phone: phone || undefined,
          specialties: specialties.length > 0 ? specialties : undefined,
          hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
          maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
        });
        onSuccess?.();
      } catch (error) {
        // Error handled by mutation
      }
    } else if (designerId) {
      try {
        await updateMutation.mutateAsync({
          designerId,
          data: {
            specialties: specialties.length > 0 ? specialties : undefined,
            hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
            maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
            status,
          },
        });
        onSuccess?.();
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#12121a] border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">
            {isCreating ? "添加设计师" : "编辑设计师信息"}
          </DialogTitle>
          <DialogDescription className="text-white/60">
            {isCreating
              ? "创建新的设计师账号并设置基本信息"
              : "更新设计师的技能、参数和状态"}
          </DialogDescription>
        </DialogHeader>

        {isLoading && !isCreating ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Basic Info */}
            {isCreating && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">
                    邮箱 <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="designer@example.com"
                    className="bg-white/5 border-white/10 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">
                    姓名
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="设计师姓名"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white/80">
                    手机
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="13800138000"
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </>
            )}

            {/* Specialties */}
            <div className="space-y-2">
              <Label className="text-white/80">技能标签</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {specialties.map((skill) => (
                  <Badge
                    key={skill}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white/80"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSpecialty(skill)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSpecialty();
                    }
                  }}
                  placeholder="输入技能标签"
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddSpecialty}
                  className="bg-transparent border-white/10 text-white/60"
                >
                  添加
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {commonSpecialties
                  .filter((s) => !specialties.includes(s))
                  .map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="bg-white/5 border-white/10 text-white/60 cursor-pointer hover:bg-white/10"
                      onClick={() => {
                        if (!specialties.includes(skill)) {
                          setSpecialties([...specialties, skill]);
                        }
                      }}
                    >
                      + {skill}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Work Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="text-white/80">
                  时薪（元/小时）
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min="0"
                  step="10"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="200"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxCapacity" className="text-white/80">
                  最大容量（项目数）
                </Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  min="1"
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(e.target.value)}
                  placeholder="5"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* Status (only for editing) */}
            {!isCreating && (
              <div className="space-y-2">
                <Label htmlFor="status" className="text-white/80">
                  状态
                </Label>
                <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                  <SelectTrigger
                    id="status"
                    className="bg-white/5 border-white/10 text-white"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="active" className="text-white/80">
                      活跃
                    </SelectItem>
                    <SelectItem value="inactive" className="text-white/80">
                      离线
                    </SelectItem>
                    <SelectItem value="on_leave" className="text-white/80">
                      休假
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
            disabled={
              (isCreating && !email) ||
              updateMutation.isPending ||
              createMutation.isPending
            }
            className="bg-primary hover:bg-primary/90"
          >
            {updateMutation.isPending || createMutation.isPending
              ? "保存中..."
              : isCreating
                ? "创建"
                : "保存"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
