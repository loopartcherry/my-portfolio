"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Plus, FolderKanban, Clock, Download, Filter, Search, 
  Grid3X3, List, TableIcon, Star, MoreVertical, Calendar,
  User, ChevronDown, X, Archive, Trash2, Share, Edit,
  Home, CreditCard, Headphones, FileText, Users, Settings,
  BookOpen, Gift, MessageCircle, Bell, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Mock projects data
const mockProjects = [
  { 
    id: "PRJ20240115001", 
    name: "企业品牌 Logo 设计", 
    description: "为科技公司设计一套完整的品牌标识系统，包含主标志、辅助图形和应用规范",
    status: "进行中", 
    category: "百维赋",
    type: "Logo设计",
    progress: 65, 
    designer: "张三",
    createdAt: "2024-01-10",
    deadline: "2024-01-20",
    updatedAt: "2小时前",
    starred: true
  },
  { 
    id: "PRJ20240112002", 
    name: "产品官网 UI 设计", 
    description: "SaaS产品官网首页及核心页面的UI界面设计",
    status: "待验收", 
    category: "千维镜",
    type: "UI界面设计",
    progress: 100, 
    designer: "李四",
    createdAt: "2024-01-08",
    deadline: "2024-01-15",
    updatedAt: "1天前",
    starred: false
  },
  { 
    id: "PRJ20240110003", 
    name: "数据大屏可视化", 
    description: "企业数据监控大屏的可视化设计与动效方案",
    status: "进行中", 
    category: "数维观",
    type: "数据大屏",
    progress: 40, 
    designer: "张三",
    createdAt: "2024-01-05",
    deadline: "2024-01-25",
    updatedAt: "5小时前",
    starred: true
  },
  { 
    id: "PRJ20240105004", 
    name: "投资人 BP 设计", 
    description: "A轮融资路演商业计划书的可视化设计",
    status: "已完成", 
    category: "百维赋",
    type: "海报设计",
    progress: 100, 
    designer: "王五",
    createdAt: "2024-01-01",
    deadline: "2024-01-10",
    updatedAt: "5天前",
    starred: false
  },
  { 
    id: "PRJ20231228005", 
    name: "技术架构图绘制", 
    description: "微服务架构技术文档的可视化图表设计",
    status: "已完成", 
    category: "万维图",
    type: "架构图",
    progress: 100, 
    designer: "李四",
    createdAt: "2023-12-20",
    deadline: "2023-12-28",
    updatedAt: "3周前",
    starred: false
  },
  { 
    id: "PRJ20231215006", 
    name: "年度报告设计", 
    description: "企业年度总结报告的排版和数据可视化设计",
    status: "待确认", 
    category: "数维观",
    type: "报告设计",
    progress: 0, 
    designer: "待分配",
    createdAt: "2023-12-15",
    deadline: "2024-02-01",
    updatedAt: "1周前",
    starred: false
  },
];

const statusOptions = [
  { value: "all", label: "全部", count: 48 },
  { value: "pending", label: "待确认", count: 5 },
  { value: "进行中", label: "进行中", count: 12 },
  { value: "待验收", label: "待验收", count: 3 },
  { value: "已完成", label: "已完成", count: 25 },
  { value: "暂停", label: "已暂停", count: 2 },
  { value: "取消", label: "已取消", count: 1 },
];

const categoryOptions = [
  { value: "百维赋", label: "百维赋 - 品牌可视化", count: 20 },
  { value: "千维镜", label: "千维镜 - 技术可视化", count: 8 },
  { value: "万维图", label: "万维图 - 产品可视化", count: 15 },
  { value: "数维观", label: "数维观 - 数据可视化", count: 5 },
];

const timeOptions = [
  { value: "all", label: "全部时间" },
  { value: "7d", label: "最近7天" },
  { value: "30d", label: "最近30天" },
  { value: "90d", label: "最近3个月" },
];

const quickFilters = ["全部", "进行中", "待验收", "已完成", "我负责的", "已收藏"];

type ViewMode = "grid" | "list" | "table";

function getStatusColor(status: string) {
  switch(status) {
    case "进行中": return "bg-primary/10 text-primary border-primary/20";
    case "待验收": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "已完成": return "bg-green-500/10 text-green-400 border-green-500/20";
    case "待确认": return "bg-white/10 text-white/60 border-white/20";
    case "已暂停": return "bg-white/5 text-white/40 border-white/10";
    default: return "bg-white/5 text-white/50 border-white/10";
  }
}

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState("all");
  const [quickFilter, setQuickFilter] = useState("全部");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [projects, setProjects] = useState(mockProjects);
  const [showSupport, setShowSupport] = useState(false);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.id.includes(searchQuery)) {
        return false;
      }
      if (selectedStatus.length > 0 && !selectedStatus.includes(p.status)) {
        return false;
      }
      if (selectedCategory.length > 0 && !selectedCategory.includes(p.category)) {
        return false;
      }
      if (quickFilter === "已收藏" && !p.starred) {
        return false;
      }
      if (quickFilter === "进行中" && p.status !== "进行中") {
        return false;
      }
      if (quickFilter === "待验收" && p.status !== "待验收") {
        return false;
      }
      if (quickFilter === "已完成" && p.status !== "已完成") {
        return false;
      }
      return true;
    });
  }, [projects, searchQuery, selectedStatus, selectedCategory, quickFilter]);

  const toggleStar = (id: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, starred: !p.starred } : p));
  };

  const toggleSelect = (id: string) => {
    setSelectedProjects(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedStatus([]);
    setSelectedCategory([]);
    setSelectedTime("all");
    setQuickFilter("全部");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedStatus.length > 0 || selectedCategory.length > 0 || selectedTime !== "all" || searchQuery;

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-sm"
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
              <h1 className="text-base md:text-lg font-light text-white/90 truncate">我的项目</h1>
              <span className="hidden sm:inline text-xs text-white/40 truncate">共 {filteredProjects.length} 个项目</span>
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

          {/* Batch Actions Bar */}
          {selectedProjects.length > 0 && (
            <div className="sticky top-16 z-20 bg-primary/10 border-b border-primary/20 px-4 md:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/80">已选中 {selectedProjects.length} 个项目</span>
                <button 
                  onClick={() => setSelectedProjects(filteredProjects.map(p => p.id))}
                  className="text-xs text-primary hover:underline"
                >
                  全选
                </button>
                <button 
                  onClick={() => setSelectedProjects([])}
                  className="text-xs text-white/50 hover:text-white/80"
                >
                  取消全选
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60 hover:text-white gap-1">
                  <Archive className="w-3 h-3" />
                  批量归档
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60 hover:text-white gap-1">
                  <Download className="w-3 h-3" />
                  批量导出
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent border-red-500/20 text-red-400 hover:bg-red-500/10 gap-1">
                  <Trash2 className="w-3 h-3" />
                  批量删除
                </Button>
                <button onClick={() => setSelectedProjects([])} className="ml-2 p-1 text-white/40 hover:text-white/80">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            {/* Filter Sidebar */}
            {showFilter && (
              <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/5 p-4 md:p-6 space-y-6 shrink-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white/80 flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    筛选器
                  </h3>
                  <button 
                    onClick={() => setShowFilter(false)}
                    className="p-1 text-white/40 hover:text-white/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedStatus.map(s => (
                        <span key={s} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded flex items-center gap-1">
                          {s}
                          <button onClick={() => setSelectedStatus(prev => prev.filter(x => x !== s))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      {selectedCategory.map(c => (
                        <span key={c} className="px-2 py-1 text-xs bg-accent/10 text-accent rounded flex items-center gap-1">
                          {c}
                          <button onClick={() => setSelectedCategory(prev => prev.filter(x => x !== c))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <button onClick={clearFilters} className="text-xs text-white/40 hover:text-white/60">
                      清除所有筛选
                    </button>
                  </div>
                )}

                {/* Status Filter */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">项目状态</h4>
                  <div className="space-y-2">
                    {statusOptions.map(opt => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                          checked={selectedStatus.includes(opt.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStatus([...selectedStatus, opt.value]);
                            } else {
                              setSelectedStatus(selectedStatus.filter(s => s !== opt.value));
                            }
                          }}
                          className="border-white/20"
                        />
                        <span className="text-sm text-white/60 group-hover:text-white/80 flex-1">{opt.label}</span>
                        <span className="text-xs text-white/30">({opt.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">设计类别</h4>
                  <div className="space-y-2">
                    {categoryOptions.map(opt => (
                      <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                          checked={selectedCategory.includes(opt.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategory([...selectedCategory, opt.value]);
                            } else {
                              setSelectedCategory(selectedCategory.filter(c => c !== opt.value));
                            }
                          }}
                          className="border-white/20"
                        />
                        <span className="text-sm text-white/60 group-hover:text-white/80 flex-1">{opt.label}</span>
                        <span className="text-xs text-white/30">({opt.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Filter */}
                <div className="space-y-3">
                  <h4 className="text-xs font-medium text-white/60 uppercase tracking-wider">创建时间</h4>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a24] border-white/10">
                      {timeOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value} className="text-white/80">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Apply Button */}
                <div className="pt-4 space-y-2">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    应用筛选
                  </Button>
                  <button onClick={clearFilters} className="w-full text-center text-xs text-white/40 hover:text-white/60 py-2">
                    重置筛选
                  </button>
                </div>
              </aside>
            )}

            {/* Projects List */}
            <div className="flex-1 p-4 sm:p-6 md:p-8">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                  {!showFilter && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowFilter(true)}
                      className="bg-transparent border-white/10 text-white/60 gap-2"
                    >
                      <Filter className="w-4 h-4" />
                      筛选器
                    </Button>
                  )}
                  
                  {/* Quick Filters */}
                  <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                    {quickFilters.map(f => (
                      <button
                        key={f}
                        onClick={() => setQuickFilter(f)}
                        className={cn(
                          "px-3 py-1.5 text-xs rounded-md transition-all",
                          quickFilter === f 
                            ? "bg-primary/20 text-primary" 
                            : "text-white/50 hover:text-white/80"
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {/* Search */}
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <Input
                      placeholder="搜索项目名称或编号"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 bg-white/5 border-white/10 text-white/80 placeholder:text-white/30"
                    />
                  </div>

                  {/* View Toggle */}
                  <div className="flex gap-1 bg-white/5 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "p-2 rounded-md transition-all",
                        viewMode === "grid" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "p-2 rounded-md transition-all",
                        viewMode === "list" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("table")}
                      className={cn(
                        "p-2 rounded-md transition-all",
                        viewMode === "table" ? "bg-white/10 text-white" : "text-white/40 hover:text-white/60"
                      )}
                    >
                      <TableIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a24] border-white/10">
                      <SelectItem value="newest" className="text-white/80">最新创建</SelectItem>
                      <SelectItem value="oldest" className="text-white/80">最早创建</SelectItem>
                      <SelectItem value="deadline" className="text-white/80">即将到期</SelectItem>
                      <SelectItem value="updated" className="text-white/80">最近更新</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Actions */}
                  <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60 gap-1">
                    <Download className="w-4 h-4" />
                    导出
                  </Button>
                  <Link href="/dashboard/projects/new">
                    <Button className="bg-primary hover:bg-primary/90 gap-1">
                      <Plus className="w-4 h-4" />
                      新建项目
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                      <div className="p-4 sm:p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Badge className={cn("text-[10px] border", getStatusColor(project.status))}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleStar(project.id)}
                              className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                project.starred ? "text-yellow-400" : "text-white/30 hover:text-white/60"
                              )}
                            >
                              <Star className={cn("w-4 h-4", project.starred && "fill-yellow-400")} />
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#1a1a24] border-white/10">
                                <DropdownMenuItem className="text-white/80 gap-2">
                                  <Edit className="w-4 h-4" /> 编辑项目
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white/80 gap-2">
                                  <Download className="w-4 h-4" /> 下载文件
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white/80 gap-2">
                                  <Share className="w-4 h-4" /> 分享链接
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white/80 gap-2">
                                  <Archive className="w-4 h-4" /> 归档项目
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem className="text-red-400 gap-2">
                                  <Trash2 className="w-4 h-4" /> 删除项目
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* Project Info */}
                        <p className="text-[10px] text-white/30 font-mono mb-2">#{project.id}</p>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <h3 className="text-sm md:text-base font-medium text-white/90 mb-2 group-hover:text-primary transition-colors cursor-pointer">
                            {project.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-white/50 line-clamp-2 mb-4">{project.description}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2 py-0.5 text-[10px] bg-white/5 text-white/50 rounded">{project.category}</span>
                          <span className="px-2 py-0.5 text-[10px] bg-white/5 text-white/50 rounded">{project.type}</span>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-[11px] text-white/40 mb-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {project.createdAt}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {project.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {project.designer}
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/50">进度</span>
                            <span className="text-white/70">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-1.5 bg-white/5" />
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-white/30">更新于 {project.updatedAt}</span>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-primary">
                            查看详情
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-2">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      className="group flex items-center gap-4 p-4 rounded-xl bg-[#12121a] border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={() => toggleSelect(project.id)}
                        className="border-white/20"
                      />
                      <button
                        onClick={() => toggleStar(project.id)}
                        className={cn(
                          "p-1 rounded transition-colors",
                          project.starred ? "text-yellow-400" : "text-white/20 hover:text-white/40"
                        )}
                      >
                        <Star className={cn("w-4 h-4", project.starred && "fill-yellow-400")} />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-sm font-medium text-white/90 truncate">{project.name}</h3>
                          <Badge className={cn("text-[10px] border", getStatusColor(project.status))}>
                            {project.status}
                          </Badge>
                          <span className="px-2 py-0.5 text-[10px] bg-white/5 text-white/40 rounded">{project.category}</span>
                        </div>
                        <p className="text-xs text-white/40 truncate">{project.description}</p>
                        <div className="flex items-center gap-4 mt-1 text-[10px] text-white/30">
                          <span>{project.designer}</span>
                          <span>创建于 {project.createdAt}</span>
                          <span>更新于 {project.updatedAt}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-24">
                          <div className="flex items-center justify-between text-[10px] text-white/40 mb-1">
                            <span>进度</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-1 bg-white/5" />
                        </div>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-primary">
                            查看
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Table View */}
              {viewMode === "table" && (
                <div className="rounded-xl border border-white/5 overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-white/5">
                      <tr className="text-left text-xs text-white/50">
                        <th className="p-4 w-10">
                          <Checkbox className="border-white/20" />
                        </th>
                        <th className="p-4 w-10" />
                        <th className="p-4">项目编号</th>
                        <th className="p-4">项目名称</th>
                        <th className="p-4">类别</th>
                        <th className="p-4">设计师</th>
                        <th className="p-4">状态</th>
                        <th className="p-4">进度</th>
                        <th className="p-4">创建日期</th>
                        <th className="p-4 w-10" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <Checkbox
                              checked={selectedProjects.includes(project.id)}
                              onCheckedChange={() => toggleSelect(project.id)}
                              className="border-white/20"
                            />
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => toggleStar(project.id)}
                              className={cn(
                                "p-1 rounded transition-colors",
                                project.starred ? "text-yellow-400" : "text-white/20 hover:text-white/40"
                              )}
                            >
                              <Star className={cn("w-4 h-4", project.starred && "fill-yellow-400")} />
                            </button>
                          </td>
                          <td className="p-4 text-xs font-mono text-white/50">{project.id}</td>
                          <td className="p-4 text-sm text-white/90 font-medium">{project.name}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 text-[10px] bg-white/5 text-white/50 rounded">{project.category}</span>
                          </td>
                          <td className="p-4 text-sm text-white/60">{project.designer}</td>
                          <td className="p-4">
                            <Badge className={cn("text-[10px] border", getStatusColor(project.status))}>
                              {project.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Progress value={project.progress} className="w-16 h-1 bg-white/5" />
                              <span className="text-[10px] text-white/40">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-xs text-white/40">{project.createdAt}</td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#1a1a24] border-white/10">
                                <DropdownMenuItem className="text-white/80 gap-2">
                                  <Edit className="w-4 h-4" /> 编辑
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white/80 gap-2">
                                  <Download className="w-4 h-4" /> 下载
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-white/10" />
                                <DropdownMenuItem className="text-red-400 gap-2">
                                  <Trash2 className="w-4 h-4" /> 删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Empty State */}
              {filteredProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                    <FolderKanban className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="text-base md:text-lg font-medium text-white/80 mb-2">
                    {hasActiveFilters ? "没有找到匹配的项目" : "还没有项目"}
                  </h3>
                  <p className="text-sm text-white/40 mb-6">
                    {hasActiveFilters ? "试试调整筛选条件" : "创建第一个项目，开始您的设计之旅"}
                  </p>
                  {hasActiveFilters ? (
                    <Button variant="outline" onClick={clearFilters} className="bg-transparent border-white/10 text-white/60">
                      清除筛选
                    </Button>
                  ) : (
                    <Link href="/dashboard/projects/new">
                      <Button className="bg-primary hover:bg-primary/90 gap-1">
                        <Plus className="w-4 h-4" />
                        新建项目
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Pagination */}
              {filteredProjects.length > 0 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                  <span className="text-sm text-white/40">
                    第 1-{filteredProjects.length} 项，共 {filteredProjects.length} 项
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled className="bg-transparent border-white/10 text-white/30">
                      上一页
                    </Button>
                    <Button variant="outline" size="sm" className="bg-primary/10 border-primary/20 text-primary">
                      1
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60">
                      2
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent border-white/10 text-white/60">
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Suspense>
  );
}
