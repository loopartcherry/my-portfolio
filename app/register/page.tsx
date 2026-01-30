"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value } as any));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name) newErrors.name = "请输入姓名";
    if (!form.email) newErrors.email = "请输入邮箱";
    if (!form.password || form.password.length < 6) newErrors.password = "密码至少6位";
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = "两次输入的密码不一致";
    if (!form.agree) newErrors.agree = "请勾选同意条款";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-4 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-primary">免费注册 · 2分钟</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light mb-3">创建你的 LoopArt 账户</h1>
            <p className="text-muted-foreground/70">
              订阅可视化设计服务、管理项目进度、查看VCMA诊断结果
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card/40 border border-border/40 rounded-2xl p-8 md:p-10 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-muted-foreground">
                    姓名 / 称呼
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input
                      id="name"
                      placeholder="如何称呼你"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="pl-10 bg-secondary/20 border-border/30 focus:border-primary/50"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm text-muted-foreground">
                    手机号码
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input
                      id="phone"
                      placeholder="用于接收服务通知"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="pl-10 bg-secondary/20 border-border/30 focus:border-primary/50"
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  工作邮箱
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="pl-10 bg-secondary/20 border-border/30 focus:border-primary/50"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm text-muted-foreground">
                    设置密码
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="至少6位，区分大小写"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className="pl-10 bg-secondary/20 border-border/30 focus:border-primary/50"
                    />
                  </div>
                  {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">
                    确认密码
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="再次输入密码"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="bg-secondary/20 border-border/30 focus:border-primary/50"
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="agree"
                  checked={form.agree}
                  onCheckedChange={(v) => handleChange("agree", !!v)}
                  className="mt-0.5 border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="agree" className="text-xs text-muted-foreground leading-relaxed">
                  我已阅读并同意
                  <Link href="/terms" target="_blank" className="text-primary mx-1 hover:underline">
                    《服务条款》
                  </Link>
                  和
                  <Link href="/privacy" target="_blank" className="text-primary ml-1 hover:underline">
                    《隐私政策》
                  </Link>
                  ，并授权用于为我提供可视化设计服务。
                </Label>
              </div>
              {errors.agree && <p className="text-xs text-red-500">{errors.agree}</p>}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    创建账户
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                已有账户？
                <Link href="/login" className="text-primary hover:text-primary/80 ml-1">
                  直接登录
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

