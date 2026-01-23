"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { 
  ArrowLeft, Info, Palette, Calendar, Clock, User, Users,
  Target, FileText, ImageIcon, MessageSquare, Upload, Download,
  Share2, MoreVertical, Pencil, Copy, Eye, Play, CheckCircle, 
  AlertCircle, TrendingUp, Activity, History, Zap, Plus, Send, 
  Reply, ThumbsUp, Paperclip, Smile, AtSign, Filter, Grid, List,
  Trash, Link as LinkIcon, Tag, Archive, Printer, Layers, RefreshCw,
  Home, FolderKanban, CreditCard, Headphones, Settings, BookOpen, 
  Gift, MessageCircle, ChevronRight, Star, X, Check, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";
import { ProjectComments } from "@/components/projects/project-comments";

// Mock project data
const mockProject = {
  id: "PRJ20240115001",
  name: "企业品牌 Logo 设计",
  status: "IN_PROGRESS",
  category: "百维赋 - 品牌可视化",
  designType: "Logo 设计",
  createdAt: "2024-01-15 10:30",
  updatedAt: "2024-01-18 14:20",
  deadline: "2024-01-20 18:00",
  progress: 65,
  priority: "HIGH",
  description: "为企业设计一个现代简约风格的Logo，需要体现科技感和创新精神，主色调为蓝色系...",
  tags: ["品牌设计", "Logo", "企业", "科技感", "蓝色系"],
  designer: {
    name: "李设计师",
    avatar: "/images/profile-avatar.jpg",
    role: "资深设计师",
    rating: 4.9,
  },
  requirements: ["现代简约风格", "体现科技感", "蓝色系为主", "易于识别记忆"],
  audiences: ["企业客户", "年轻人", "技术人员"],
  styles: ["现代简约", "科技未来", "商务专业"],
  colors: ["#2563eb", "#3b82f6", "#1e40af", "#60a5fa"],
};

const mockFiles = [
  { id: 1, name: "Logo_V1.png", type: "image", size: "2.3 MB", uploader: "李设计师", time: "昨天", version: "V1" },
  { id: 2, name: "Logo_V2.png", type: "image", size: "2.8 MB", uploader: "李设计师", time: "2小时前", version: "V2", latest: true },
  { id: 3, name: "需求文档.pdf", type: "document", size: "1.2 MB", uploader: "张三", time: "3天前", version: null },
  { id: 4, name: "参考图片.zip", type: "archive", size: "15 MB", uploader: "张三", time: "3天前", version: null },
];

const mockMessages = [
  { id: 1, user: "张三", role: "客户", avatar: null, content: "您好，初稿整体不错，但我觉得颜色可以再鲜艳一些，另外字体可以换一个更现代的。", time: "2小时前", likes: 0 },
  { id: 2, user: "李设计师", role: "设计师", avatar: "/images/profile-avatar.jpg", content: "好的，我理解您的需求。我会调整配色方案，同时尝试几个现代感更强的字体。预计明天下午给您看修改稿。", time: "1小时前", likes: 2 },
];

const mockStages = [
  { id: 1, name: "需求确认", status: "completed", start: "2024-01-15 10:00", end: "2024-01-15 15:00", duration: "5小时" },
  { id: 2, name: "方案设计", status: "completed", start: "2024-01-15 15:30", end: "2024-01-16 18:00", duration: "1.1天" },
  { id: 3, name: "初稿设计", status: "in_progress", start: "2024-01-17 09:00", end: null, progress: 80, duration: "1.4天" },
  { id: 4, name: "客户反馈", status: "pending", start: null, end: null },
  { id: 5, name: "修改完善", status: "pending", start: null, end: null },
  { id: 6, name: "最终交付", status: "pending", start: null, end: null },
];

const mockHistory = [
  { id: 1, type: "message", content: "张三 发送了消息", detail: "您好，初稿整体不错...", time: "2024-01-18 14:20" },
  { id: 2, type: "file", content: "李设计师 上传了文件", detail: "Logo_V2.png", time: "2024-01-18 14:00" },
  { id: 3, type: "progress", content: "李设计师 更新了项目进度", detail: "60% → 80%", time: "2024-01-18 11:30" },
  { id: 4, type: "stage", content: "方案设计阶段已完成", detail: "耗时 1.1 天", time: "2024-01-17 18:00" },
];

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "待确认", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  IN_PROGRESS: { label: "进行中", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  REVIEW: { label: "待验收", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  REVISION: { label: "修改中", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  COMPLETED: { label: "已完成", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  PAUSED: { label: "已暂停", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
  CANCELLED: { label: "已取消", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function ProjectDetailPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const { id } = resolvedParams;
  
  const [showSupport, setShowSupport] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [fileView, setFileView] = useState<"grid" | "list">("grid");
  const [messageInput, setMessageInput] = useState("");
  const [expandedDescription, setExpandedDescription] = useState(false);
  const queryClient = useQueryClient();

  // 验收项目 mutation
  const approveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/projects/${id}/approve`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "验收失败");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("项目验收通过！");
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      // 可以刷新页面或更新状态
      window.location.reload();
    },
    onError: (error: Error) => {
      toast.error(error.message || "验收失败");
    },
  });

  const handleApprove = () => {
    if (confirm("确认验收此项目？验收后项目将标记为已完成。")) {
      approveMutation.mutate();
    }
  };

  const status = statusMap[mockProject.status];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-lg font-light tracking-wider">
            <span className="text-primary">SPIRAL</span>
            <span className="text-white/40">.VISION</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard/projects";
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
          <div className="my-4 border-t border-white/5" />
          {otherNav.map((item) => {
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
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onMouseEnter={() => setShowSupport(true)}
            onMouseLeave={() => setShowSupport(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 transition-all text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{showSupport ? "在线客服 24/7" : "联系客服"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Link href="/dashboard/projects" className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-all flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-lg font-light text-white/90 truncate">{mockProject.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-mono text-white/30">#{mockProject.id}</span>
                <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full border", status.color)}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/dashboard/notifications" className="relative p-2 text-white/40 hover:text-white/80 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Actions */}
          <div className="flex items-center gap-3 mb-6">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5">
              <Download className="w-4 h-4" />
              下载文件
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5">
              <Share2 className="w-4 h-4" />
              分享
            </Button>
            <Button variant="ghost" size="sm" className="text-white/40 hover:text-white/80">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
            {/* Main Content - 70% */}
            <div className="flex-1 min-w-0">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start bg-transparent border-b border-white/5 rounded-none p-0 h-auto mb-8">
                  {[
                    { id: "overview", label: "概览" },
                    { id: "files", label: "文件", badge: mockFiles.length },
                    { id: "communication", label: "沟通", badge: mockMessages.length },
                    { id: "progress", label: "进度" },
                    { id: "history", label: "历史" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className={cn(
                        "relative px-6 py-4 text-sm font-medium rounded-none border-b-2 border-transparent transition-all",
                        "data-[state=active]:border-primary data-[state=active]:text-primary",
                        "data-[state=inactive]:text-white/40 data-[state=inactive]:hover:text-white/60"
                      )}
                    >
                      {tab.label}
                      {tab.badge && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-white/10 rounded">
                          {tab.badge}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Tab: Overview */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Project Info */}
                  <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 p-4 sm:p-6">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-white/80 mb-6">
                      <Info className="w-4 h-4 text-white/40" />
                      项目信息
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-white/40 mb-1">设计类别</p>
                          <p className="text-sm text-white/80">{mockProject.category}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 mb-1">设计形式</p>
                          <span className="px-2 py-1 text-xs bg-white/5 rounded text-white/70">{mockProject.designType}</span>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 mb-1">创建时间</p>
                          <p className="text-sm text-white/60">{mockProject.createdAt}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-white/40 mb-1">负责设计师</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-sm text-white">
                              李
                            </div>
                            <div>
                              <p className="text-sm text-white/80">{mockProject.designer.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-xs text-white/40">{mockProject.designer.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 mb-1">期望交付</p>
                          <p className="text-sm text-white/60">{mockProject.deadline}</p>
                          <p className="text-xs text-orange-400 mt-1">还剩 2 天 5 小时</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/40 mb-1">优先级</p>
                          <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">高</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 p-4 sm:p-6">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
                      <FileText className="w-4 h-4 text-white/40" />
                      需求描述
                    </h3>
                    <p className={cn("text-sm text-white/60 leading-relaxed", !expandedDescription && "line-clamp-3")}>
                      {mockProject.description}
                    </p>
                    <button 
                      onClick={() => setExpandedDescription(!expandedDescription)}
                      className="text-xs text-primary mt-2 hover:underline"
                    >
                      {expandedDescription ? "收起" : "展开全部"}
                    </button>
                    
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <p className="text-xs text-white/40 mb-3">需求要点</p>
                      <div className="space-y-2">
                        {mockProject.requirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                            <Check className="w-4 h-4 text-green-400" />
                            {req}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                      <p className="text-xs text-white/40 mb-3">目标受众</p>
                      <div className="flex flex-wrap gap-2">
                        {mockProject.audiences.map((aud) => (
                          <span key={aud} className="px-3 py-1 text-xs bg-white/5 rounded-full text-white/60">
                            # {aud}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                      <p className="text-xs text-white/40 mb-3">颜色偏好</p>
                      <div className="flex gap-3">
                        {mockProject.colors.map((color) => (
                          <div key={color} className="group relative">
                            <div 
                              className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer transition-transform group-hover:scale-110"
                              style={{ backgroundColor: color }}
                            />
                            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Current Stage */}
                  <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 p-4 sm:p-6">
                    <h3 className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
                      <Target className="w-4 h-4 text-white/40" />
                      当前阶段
                    </h3>
                    <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base md:text-lg font-medium text-white">初稿设计</h4>
                        <span className="px-3 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full animate-pulse">
                          进行中
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mb-4">设计师正在根据需求制作初稿</p>
                      <div className="flex items-center gap-3">
                        <Progress value={80} className="flex-1 h-2 bg-white/5" />
                        <span className="text-sm font-mono text-white/60">80%</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Tab: Files */}
                <TabsContent value="files" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent border-white/10 text-white/60">
                        <Filter className="w-4 h-4" />
                        全部文件
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFileView("grid")}
                        className={cn(fileView === "grid" ? "text-white" : "text-white/40")}
                      >
                        <Grid className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFileView("list")}
                        className={cn(fileView === "list" ? "text-white" : "text-white/40")}
                      >
                        <List className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="gap-2 bg-primary/10 text-primary hover:bg-primary/20">
                        <Upload className="w-4 h-4" />
                        上传文件
                      </Button>
                    </div>
                  </div>

                  {fileView === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {mockFiles.map((file) => (
                        <div key={file.id} className="group rounded-xl bg-[#12121a] border border-white/5 overflow-hidden hover:border-white/10 transition-all">
                          <div className="relative aspect-[4/3] bg-white/5 flex items-center justify-center">
                            {file.type === "image" ? (
                              <ImageIcon className="w-12 h-12 text-white/20" />
                            ) : (
                              <FileText className="w-12 h-12 text-white/20" />
                            )}
                            {file.version && (
                              <span className={cn(
                                "absolute top-2 right-2 px-2 py-0.5 text-[10px] rounded",
                                file.latest ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"
                              )}>
                                {file.version}
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button size="sm" variant="ghost" className="text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="text-white">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-sm text-white/70 truncate">{file.name}</p>
                            <p className="text-xs text-white/30 mt-1">{file.size} · {file.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-[#12121a] border border-white/5 overflow-x-auto">
                      <div className="divide-y divide-white/5">
                        {mockFiles.map((file) => (
                          <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                              {file.type === "image" ? (
                                <ImageIcon className="w-5 h-5 text-white/30" />
                              ) : (
                                <FileText className="w-5 h-5 text-white/30" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-white/80 truncate">{file.name}</p>
                              <p className="text-xs text-white/30">{file.uploader} · {file.time}</p>
                            </div>
                            <span className="text-xs text-white/40">{file.size}</span>
                            {file.version && (
                              <span className="px-2 py-0.5 text-[10px] bg-white/10 rounded text-white/50">{file.version}</span>
                            )}
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="sm" className="text-white/40 hover:text-white">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-white/40 hover:text-white">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Tab: Communication */}
                <TabsContent value="communication" className="space-y-6">
                  <ProjectComments projectId={id} />
                </TabsContent>

                {/* Tab: Progress */}
                <TabsContent value="progress" className="space-y-6">
                  {/* Overall Progress */}
                  <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-medium text-white/80">整体进度</h3>
                      <span className="text-2xl font-light text-primary">{mockProject.progress}%</span>
                    </div>
                    <Progress value={mockProject.progress} className="h-3 bg-white/5" />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/5">
                      <div className="text-center">
                        <p className="text-2xl font-light text-white">5天</p>
                        <p className="text-xs text-white/40 mt-1">已用时间</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-light text-orange-400">3天</p>
                        <p className="text-xs text-white/40 mt-1">预计剩余</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-light text-white">3/6</p>
                        <p className="text-xs text-white/40 mt-1">完成阶段</p>
                      </div>
                    </div>
                  </div>

                  {/* Stage Timeline */}
                  <div className="space-y-4">
                    {mockStages.map((stage, i) => (
                      <div key={stage.id} className="flex gap-3 sm:gap-4">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center",
                            stage.status === "completed" ? "bg-green-500/20 text-green-400" :
                            stage.status === "in_progress" ? "bg-blue-500/20 text-blue-400 animate-pulse" :
                            "bg-white/5 text-white/30"
                          )}>
                            {stage.status === "completed" ? (
                              <Check className="w-4 h-4" />
                            ) : stage.status === "in_progress" ? (
                              <Play className="w-4 h-4" />
                            ) : (
                              <span className="text-xs">{i + 1}</span>
                            )}
                          </div>
                          {i < mockStages.length - 1 && (
                            <div className={cn(
                              "w-0.5 h-full min-h-[60px] mt-2",
                              stage.status === "completed" ? "bg-green-500/30" :
                              stage.status === "in_progress" ? "bg-gradient-to-b from-blue-500/30 to-white/10" :
                              "bg-white/10"
                            )} />
                          )}
                        </div>
                        <div className={cn(
                          "flex-1 p-4 rounded-xl border transition-all",
                          stage.status === "completed" ? "bg-green-500/5 border-green-500/20" :
                          stage.status === "in_progress" ? "bg-blue-500/5 border-blue-500/20" :
                          "bg-[#12121a] border-white/5"
                        )}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-white/80">{stage.name}</h4>
                            <span className={cn(
                              "px-2 py-0.5 text-[10px] rounded",
                              stage.status === "completed" ? "bg-green-500/20 text-green-400" :
                              stage.status === "in_progress" ? "bg-blue-500/20 text-blue-400" :
                              "bg-white/10 text-white/40"
                            )}>
                              {stage.status === "completed" ? "已完成" :
                               stage.status === "in_progress" ? "进行中" : "待开始"}
                            </span>
                          </div>
                          {stage.duration && (
                            <p className="text-xs text-white/40">耗时: {stage.duration}</p>
                          )}
                          {stage.progress !== undefined && (
                            <div className="mt-3">
                              <Progress value={stage.progress} className="h-1.5 bg-white/5" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Tab: History */}
                <TabsContent value="history" className="space-y-4">
                  {mockHistory.map((item) => (
                    <div key={item.id} className="flex gap-3 sm:gap-4">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        item.type === "message" ? "bg-blue-500/20 text-blue-400" :
                        item.type === "file" ? "bg-green-500/20 text-green-400" :
                        item.type === "progress" ? "bg-purple-500/20 text-purple-400" :
                        "bg-orange-500/20 text-orange-400"
                      )}>
                        {item.type === "message" ? <MessageSquare className="w-4 h-4" /> :
                         item.type === "file" ? <Upload className="w-4 h-4" /> :
                         item.type === "progress" ? <TrendingUp className="w-4 h-4" /> :
                         <CheckCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/70">{item.content}</p>
                        <p className="text-xs text-white/40 mt-1">{item.detail}</p>
                        <p className="text-xs text-white/30 mt-2">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - 30% */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
              {/* Status Card */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 p-4 sm:p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                    <span className="text-2xl font-light text-white">{mockProject.progress}%</span>
                  </div>
                  <h3 className="text-lg font-medium text-white">{status.label}</h3>
                  <p className="text-xs text-white/40 mt-1">已完成 3/6 阶段</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">总耗时</span>
                    <span className="text-sm text-white/70">5 天 6 小时</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">剩余时间</span>
                    <span className="text-sm text-orange-400">2 天 18 小时</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">文件数量</span>
                    <span className="text-sm text-white/70">{mockFiles.length} 个文件</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">评论数量</span>
                    <span className="text-sm text-white/70">-</span>
                  </div>
                </div>

                {mockProject.status === "REVIEW" && (
                  <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                    <Button
                      className="w-full gap-2 bg-primary/10 text-primary hover:bg-primary/20"
                      onClick={handleApprove}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle className="w-4 h-4" />
                      {approveMutation.isPending ? "验收中..." : "确认验收"}
                    </Button>
                    <Button variant="outline" className="w-full gap-2 bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5">
                      <Pencil className="w-4 h-4" />
                      申请修改
                    </Button>
                  </div>
                )}
                {mockProject.status === "COMPLETED" && (
                  <div className="mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 text-green-400 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      项目已完成
                    </div>
                  </div>
                )}
              </div>

              {/* Key Info */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 p-4 sm:p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
                  <Info className="w-4 h-4 text-white/40" />
                  关键信息
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">项目编号</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-mono text-white/60">#{mockProject.id}</span>
                      <button className="text-white/30 hover:text-white/60">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">创建时间</span>
                    <span className="text-xs text-white/60">{mockProject.createdAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">截止时间</span>
                    <span className="text-xs text-orange-400">{mockProject.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40">最后更新</span>
                    <span className="text-xs text-white/60">{mockProject.updatedAt}</span>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 p-4 sm:p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
                  <Users className="w-4 h-4 text-white/40" />
                  项目成员
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/50 to-cyan-500/50 flex items-center justify-center text-xs text-white">
                      张
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">张三</p>
                      <p className="text-[10px] text-blue-400">项目创建者</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xs text-white">
                      李
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-white/80">{mockProject.designer.name}</p>
                      <p className="text-[10px] text-green-400">负责设计师</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="rounded-2xl bg-[#12121a] border border-white/5 p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
                  <Tag className="w-4 h-4 text-white/40" />
                  标签
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mockProject.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs bg-white/5 rounded-full text-white/50">
                      # {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 p-4 sm:p-6">
                <h3 className="flex items-center gap-2 text-sm font-medium text-white/80 mb-4">
                  <Zap className="w-4 h-4 text-white/40" />
                  快捷操作
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent border-white/10 text-white/50 hover:text-white hover:bg-white/5">
                    <Download className="w-4 h-4" />
                    下载所有文件
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent border-white/10 text-white/50 hover:text-white hover:bg-white/5">
                    <FileText className="w-4 h-4" />
                    导出项目报告
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent border-white/10 text-white/50 hover:text-white hover:bg-white/5">
                    <Share2 className="w-4 h-4" />
                    分享项目链接
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent border-white/10 text-white/50 hover:text-white hover:bg-white/5">
                    <Archive className="w-4 h-4" />
                    归档项目
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
