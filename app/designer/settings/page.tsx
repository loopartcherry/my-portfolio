"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Settings,
  Bell,
  Clock,
  Palette,
  Save,
  X,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  designerMainNav,
  designerCollaborationNav,
  designerDataNav,
  designerSettingsNav,
} from "@/lib/designer-nav";

export default function DesignerSettingsPage() {
  const [settings, setSettings] = useState({
    notifications: {
      newTask: true,
      clientFeedback: true,
      fileReview: true,
      taskReminder: true,
    },
    reminderTime: "1",
    workDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    workHours: { start: "09:00", end: "18:00" },
    dailyTarget: 8,
    theme: "light",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-lg font-light tracking-wider">
            <span className="text-primary">VCMA</span>
            <span className="text-white/40"> 设计师工作台</span>
          </Link>
          <div className="mt-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              Designer
            </Badge>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs text-white/40 mb-2 px-4">工作台</div>
          {designerMainNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-medium rounded-full",
                    item.badgeColor === "primary" ? "bg-primary/20 text-primary" : "bg-orange-500/20 text-orange-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="my-4 border-t border-white/5" />

          <div className="text-xs text-white/40 mb-2 px-4">协作沟通</div>
          {designerCollaborationNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-medium rounded-full",
                    item.badgeColor === "red"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-orange-500/20 text-orange-400"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="my-4 border-t border-white/5" />

          <div className="text-xs text-white/40 mb-2 px-4">数据统计</div>
          {designerDataNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="my-4 border-t border-white/5" />

          <div className="text-xs text-white/40 mb-2 px-4">个人设置</div>
          {designerSettingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/designer/settings";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : "text-white/40 hover:text-white/70 hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-sm">
            <MessageCircle className="w-4 h-4" />
            <span>联系客服</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">工作偏好</h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 w-full">

          {/* Notification Settings */}
          <Card className="p-6 mb-6 bg-[#12121a] border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4">通知设置</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">新任务分配</Label>
                  <div className="text-xs text-white/50 mt-1">
                    当有新任务分配给我时通知
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.notifications.newTask}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, newTask: checked },
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">客户反馈</Label>
                  <div className="text-xs text-white/50 mt-1">收到客户反馈时通知</div>
                </div>
                <Switch
                  checked={settings.notifications.clientFeedback}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, clientFeedback: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">文件审核</Label>
                  <div className="text-xs text-white/50 mt-1">
                    文件审核状态变更时通知
                  </div>
                </div>
                <Switch
                  checked={settings.notifications.fileReview}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, fileReview: checked },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white/90">任务提醒</Label>
                  <div className="text-xs text-white/50 mt-1">任务即将到期时提醒</div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings.notifications.taskReminder}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, taskReminder: checked },
                      })
                    }
                  />
                  {settings.notifications.taskReminder && (
                    <Select
                      value={settings.reminderTime}
                      onValueChange={(value) =>
                        setSettings({ ...settings, reminderTime: value })
                      }
                    >
                      <SelectTrigger className="w-32 bg-[#0a0a0f] border-white/5 text-white/60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#12121a] border-white/10">
                        <SelectItem value="1">提前 1 小时</SelectItem>
                        <SelectItem value="2">提前 2 小时</SelectItem>
                        <SelectItem value="4">提前 4 小时</SelectItem>
                        <SelectItem value="8">提前 8 小时</SelectItem>
                        <SelectItem value="24">提前 24 小时</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Work Time Settings */}
          <Card className="p-6 mb-6 bg-[#12121a] border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4">工作时间设置</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-white/90 mb-2 block">工作日</Label>
                <div className="flex items-center gap-4">
                  {[
                    { value: "monday", label: "周一" },
                    { value: "tuesday", label: "周二" },
                    { value: "wednesday", label: "周三" },
                    { value: "thursday", label: "周四" },
                    { value: "friday", label: "周五" },
                    { value: "saturday", label: "周六" },
                    { value: "sunday", label: "周日" },
                  ].map((day) => (
                    <label key={day.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.workDays.includes(day.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings({
                              ...settings,
                              workDays: [...settings.workDays, day.value],
                            });
                          } else {
                            setSettings({
                              ...settings,
                              workDays: settings.workDays.filter((d) => d !== day.value),
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-white/80">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/90 mb-2 block">开始时间</Label>
                  <Input
                    type="time"
                    value={settings.workHours.start}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workHours: { ...settings.workHours, start: e.target.value },
                      })
                    }
                    className="bg-[#0a0a0f] border-white/5 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/90 mb-2 block">结束时间</Label>
                  <Input
                    type="time"
                    value={settings.workHours.end}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        workHours: { ...settings.workHours, end: e.target.value },
                      })
                    }
                    className="bg-[#0a0a0f] border-white/5 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white/90 mb-2 block">
                  每日目标工时：{settings.dailyTarget} 小时
                </Label>
                <Slider
                  value={[settings.dailyTarget]}
                  onValueChange={([value]) =>
                    setSettings({ ...settings, dailyTarget: value })
                  }
                  min={4}
                  max={12}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>
          </Card>

          {/* Theme Settings */}
          <Card className="p-6 mb-6 bg-[#12121a] border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4">界面设置</h2>
            <div className="space-y-4">
              <div>
                <Label className="text-white/90 mb-2 block">主题</Label>
                <RadioGroup
                  value={settings.theme}
                  onValueChange={(value) => setSettings({ ...settings, theme: value })}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="text-white/80">浅色模式</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="text-white/80">深色模式</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="text-white/80">跟随系统</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" className="bg-transparent border-white/10 text-white/60 hover:text-white">取消</Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              保存设置
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
