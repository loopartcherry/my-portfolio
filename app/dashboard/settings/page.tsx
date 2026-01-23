"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Image,
  Shield,
  Link as LinkIcon,
  Bell,
  Eye,
  Keyboard,
  Lock,
  Download,
  Trash2,
  Save,
  CheckCircle,
  EyeOff,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("basic");
  const [formData, setFormData] = useState({
    realName: "张三",
    displayName: "张设计师",
    gender: "male",
    birthDate: "1990-01-15",
    bio: "",
    phone: "13800138000",
    email: "zhangsan@company.com",
    backupEmail: "zhangsan@personal.com",
    wechat: "zhangsan_wx",
    officePhone: "010-12345678 转 8001",
    department: "设计部",
    position: "资深 UI 设计师",
    workId: "#DS-001",
    joinDate: "2022-03-15",
    supervisor: "",
    workLocation: "北京市朝阳区 XXX 大厦",
    emergencyContact: "李四",
    emergencyRelation: "配偶",
    emergencyPhone: "13900139000",
  });

  const settingsSections = [
    { id: "basic", label: "基本信息", icon: User },
    { id: "avatar", label: "头像和封面", icon: Image },
    { id: "security", label: "安全设置", icon: Shield },
    { id: "binding", label: "账号绑定", icon: LinkIcon },
    { id: "notifications", label: "通知偏好", icon: Bell },
    { id: "display", label: "显示偏好", icon: Eye },
    { id: "shortcuts", label: "快捷键设置", icon: Keyboard },
    { id: "privacy", label: "隐私设置", icon: Lock },
    { id: "export", label: "导出数据", icon: Download },
    { id: "delete", label: "删除账号", icon: Trash2 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-lg font-light tracking-wider">
            <span className="text-primary">VCMA</span>
            <span className="text-white/40"> 控制台</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            <div className="text-xs text-white/40 mb-2 px-4">主要功能</div>
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}

            <div className="my-4 border-t border-white/5" />

            <div className="text-xs text-white/40 mb-2 px-4">其他</div>
            {otherNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/dashboard/settings";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">账户设置</h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/dashboard/notifications" className="relative p-2 text-white/40 hover:text-white/80 transition-colors">
              <Bell className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Actions */}
          <div className="mb-6 flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" className="border-white/10 text-white/60 hover:text-white">
              <Eye className="w-4 h-4 mr-2" />
              预览个人主页
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Settings Menu */}
            <div className="lg:col-span-1">
              <Card className="p-4 bg-[#12121a] border-white/5">
                <nav className="space-y-1">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary border-l-2 border-primary"
                            : "text-white/50 hover:text-white/80 hover:bg-white/5"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-3">
              {activeSection === "basic" && (
                <Card className="p-6 bg-[#12121a] border-white/5">
                  <h2 className="text-xl font-semibold text-white mb-6">基本信息</h2>
                  
                  {/* User Avatar Section */}
                  <div className="text-center mb-8">
                    <div className="relative inline-block">
                      <Avatar className="w-32 h-32 mb-4">
                        <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                          {formData.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#12121a]" />
                    </div>
                    <div className="text-xl font-semibold text-white">{formData.displayName}</div>
                    <div className="text-sm text-white/60">{formData.workId}</div>
                    <Badge className="mt-2 bg-primary/20 text-primary border-primary/30">
                      {formData.position}
                    </Badge>
                    <div className="text-xs text-white/40 mt-1">{formData.department}</div>
                  </div>

                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">个人信息</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white/80 mb-2 block">
                            真实姓名 <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            value={formData.realName}
                            onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                            className="bg-[#0a0a0f] border-white/5 text-white"
                            placeholder="将显示在订单、合同等正式文件中"
                          />
                          <p className="text-xs text-white/40 mt-1">2-20 字符</p>
                        </div>

                        <div>
                          <Label className="text-white/80 mb-2 block">昵称/显示名称</Label>
                          <Input
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            className="bg-[#0a0a0f] border-white/5 text-white"
                          />
                          <div className="text-xs text-white/40 mt-1 text-right">
                            {formData.displayName.length} / 20
                          </div>
                        </div>

                        <div>
                          <Label className="text-white/80 mb-2 block">性别</Label>
                          <RadioGroup
                            value={formData.gender}
                            onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="male" id="male" />
                              <Label htmlFor="male" className="text-white/80">男</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="female" id="female" />
                              <Label htmlFor="female" className="text-white/80">女</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="other" id="other" />
                              <Label htmlFor="other" className="text-white/80">保密</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="text-white/80 mb-2 block">出生日期</Label>
                          <Input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                            className="bg-[#0a0a0f] border-white/5 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 mb-2 block">个人简介</Label>
                          <Textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="bg-[#0a0a0f] border-white/5 text-white min-h-[100px]"
                            placeholder="介绍一下自己..."
                          />
                          <div className="text-xs text-white/40 mt-1 text-right">
                            {formData.bio.length} / 500
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="border-t border-white/5 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">联系方式</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white/80 mb-2 block">手机号</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={formData.phone}
                              readOnly
                              className="bg-[#0a0a0f] border-white/5 text-white/60"
                            />
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              已验证
                            </Badge>
                            <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                              更换手机号
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-white/80 mb-2 block">邮箱</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={formData.email}
                              readOnly
                              className="bg-[#0a0a0f] border-white/5 text-white/60"
                            />
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              已验证
                            </Badge>
                            <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                              更换邮箱
                            </Button>
                            <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                              设为主邮箱
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-white/80 mb-2 block">备用邮箱</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              value={formData.backupEmail}
                              className="bg-[#0a0a0f] border-white/5 text-white"
                            />
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              <EyeOff className="w-3 h-3 mr-1" />
                              未验证
                            </Badge>
                            <Button size="sm" className="bg-primary text-white">
                              发送验证邮件
                            </Button>
                            <Button variant="outline" size="sm" className="border-red-500/30 text-red-400">
                              删除
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Work Information */}
                    <div className="border-t border-white/5 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">工作信息</h3>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white/80 mb-2 block">
                            部门
                            <Lock className="w-3 h-3 inline ml-1 text-white/40" />
                          </Label>
                          <Select value={formData.department}>
                            <SelectTrigger className="bg-[#0a0a0f] border-white/5 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="设计部">设计部</SelectItem>
                              <SelectItem value="销售部">销售部</SelectItem>
                              <SelectItem value="技术部">技术部</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-white/40 mt-1">需管理员权限修改</p>
                        </div>

                        <div>
                          <Label className="text-white/80 mb-2 block">职位</Label>
                          <Input
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="bg-[#0a0a0f] border-white/5 text-white"
                          />
                        </div>

                        <div>
                          <Label className="text-white/80 mb-2 block">工号</Label>
                          <Input
                            value={formData.workId}
                            readOnly
                            className="bg-[#0a0a0f] border-white/5 text-white/60"
                          />
                          <p className="text-xs text-white/40 mt-1">系统自动生成，不可修改</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="border-white/10 text-white/60">
                          重置
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">
                          最后更新时间：2024-01-15 10:30
                        </span>
                        <Button className="bg-primary text-white">
                          <Save className="w-4 h-4 mr-2" />
                          保存更改
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {activeSection === "security" && (
                <Card className="p-6 bg-[#12121a] border-white/5">
                  <h2 className="text-xl font-semibold text-white mb-6">安全设置</h2>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-green-400" />
                        <span className="text-white">您的密码安全等级：强</span>
                      </div>
                      <p className="text-sm text-white/60 mb-4">上次修改时间：2024-01-01</p>
                      <p className="text-sm text-white/40 mb-4">
                        建议每 90 天更换一次密码
                      </p>
                      <Button className="bg-primary text-white">
                        修改密码
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {activeSection === "notifications" && (
                <Card className="p-6 bg-[#12121a] border-white/5">
                  <h2 className="text-xl font-semibold text-white mb-6">通知偏好</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">通知方式</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white/80">站内消息</Label>
                            <p className="text-xs text-white/40">在系统内接收消息通知</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-white/80">邮件通知</Label>
                            <p className="text-xs text-white/40">通过邮件接收重要通知</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Other sections placeholder */}
              {!["basic", "security", "notifications"].includes(activeSection) && (
                <Card className="p-6 bg-[#12121a] border-white/5">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    {settingsSections.find((s) => s.id === activeSection)?.label}
                  </h2>
                  <p className="text-white/60">此功能正在开发中...</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
