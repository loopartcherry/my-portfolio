"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FolderOpen,
  Upload,
  FolderPlus,
  Grid3X3,
  List,
  MoreVertical,
  Download,
  Move,
  Copy,
  Tag,
  Trash2,
  X,
  Search,
  Filter,
  HardDrive,
  Star,
  Clock,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  File,
  Folder,
  Eye,
  Share2,
  CheckCircle,
  Users,
  Bell,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
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

// Mock data
const mockFiles = [
  {
    id: 1,
    name: "Logo 设计稿 v3.jpg",
    type: "image",
    size: "2.5 MB",
    modifiedAt: "2小时前",
    uploadedBy: { name: "张设计师", avatar: undefined },
    tags: ["设计稿", "已审核"],
    starred: true,
    shared: false,
    project: "某 AI 公司品牌升级",
    status: "已审核",
  },
  {
    id: 2,
    name: "品牌 VI 系统",
    type: "folder",
    fileCount: 15,
    modifiedAt: "昨天",
    uploadedBy: { name: "张设计师", avatar: undefined },
    tags: [],
    starred: false,
    shared: false,
  },
  {
    id: 3,
    name: "需求文档.docx",
    type: "document",
    size: "1.2 MB",
    modifiedAt: "3天前",
    uploadedBy: { name: "李经理", avatar: undefined },
    tags: ["需求文档"],
    starred: false,
    shared: false,
    status: "待审核",
  },
  {
    id: 4,
    name: "服务合同.pdf",
    type: "document",
    size: "856 KB",
    modifiedAt: "1周前",
    uploadedBy: { name: "李经理", avatar: undefined },
    tags: ["合同"],
    starred: false,
    shared: false,
    status: "已签署",
    locked: true,
  },
];

const fileCategories = [
  { id: "all", label: "所有文件", icon: FolderOpen, count: 256 },
  { id: "project", label: "项目文件", icon: Folder, count: 180, groupLabel: "按项目分组" },
  { id: "uploaded", label: "我的上传", icon: Upload, count: 45 },
  { id: "shared", label: "与我共享", icon: Users, count: 31, newFiles: 5 },
  { id: "recent", label: "最近使用", icon: Clock, count: 28 },
  { id: "starred", label: "收藏夹", icon: Star, count: 12 },
  { id: "trash", label: "回收站", icon: Trash2, count: 8, autoClean: "30天后自动清空" },
];

const fileTypes = [
  { icon: "📄", label: "文档", types: "Word, PDF", count: 85 },
  { icon: "📊", label: "表格", types: "Excel", count: 32 },
  { icon: "📽️", label: "演示文稿", types: "PPT", count: 18 },
  { icon: "🖼️", label: "图片", types: "JPG, PNG", count: 95 },
  { icon: "🎬", label: "视频", types: "MP4", count: 12 },
  { icon: "🎵", label: "音频", count: 5 },
  { icon: "📦", label: "压缩包", types: "ZIP, RAR", count: 9 },
  { icon: "📄", label: "其他", count: 20 },
];

const storageStats = {
  used: 2.3,
  total: 10,
  percentage: 23,
  breakdown: [
    { type: "项目文件", size: 1.5, percentage: 65, color: "blue" },
    { type: "个人文件", size: 0.6, percentage: 26, color: "green" },
    { type: "共享文件", size: 0.2, percentage: 9, color: "purple" },
  ],
};

export default function FilesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFileTypeFilter, setShowFileTypeFilter] = useState(false);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const filteredFiles = mockFiles.filter((file) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "project" && file.type === "folder") return true;
    if (activeCategory === "uploaded" && file.uploadedBy.name === "张设计师") return true;
    if (activeCategory === "starred" && file.starred) return true;
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const getFileIcon = (file: typeof mockFiles[0]) => {
    if (file.type === "folder") return Folder;
    if (file.type === "image") return ImageIcon;
    if (file.type === "document") {
      if (file.name.endsWith(".pdf")) return FileText;
      return FileText;
    }
    return File;
  };

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

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard/files";
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
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-medium rounded-full",
                      item.badgeColor === "primary"
                        ? "bg-primary/20 text-primary"
                        : "bg-orange-500/20 text-orange-400"
                    )}
                  >
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
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">文件管理</h1>
            <span className="hidden sm:inline text-xs text-white/40 truncate">
              管理您的项目文件和文档
            </span>
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

        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Storage & Actions */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Card className="p-4 bg-[#12121a] border-white/5 flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-primary" />
                  <span className="text-xs text-white/60">已使用 {storageStats.used} GB / {storageStats.total} GB</span>
                </div>
                <span className="text-xs text-primary">{storageStats.percentage}%</span>
              </div>
              <Progress value={storageStats.percentage} className="h-1.5" />
            </Card>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowUploadDialog(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Upload className="w-4 h-4 mr-2" />
                上传文件
              </Button>
              <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                <FolderPlus className="w-4 h-4 mr-2" />
                新建文件夹
              </Button>
              <div className="flex items-center border border-white/10 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-white/5 text-white"
                      : "text-white/40 hover:text-white/60"
                  )}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-white/5 text-white"
                      : "text-white/40 hover:text-white/60"
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                  <DropdownMenuItem className="text-white hover:bg-white/10">批量下载</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10">清理回收站</DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10">查看存储详情</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Left: Categories */}
            <aside className="hidden lg:block w-60 flex-shrink-0">
              <div className="space-y-2">
                {fileCategories.map((category) => {
                  const Icon = category.icon;
                  const isActive = activeCategory === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-white/60 hover:text-white/80 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{category.label}</span>
                        {category.groupLabel && (
                          <span className="text-[10px] text-white/40">({category.groupLabel})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {category.newFiles && (
                          <span className="w-2 h-2 bg-primary rounded-full" />
                        )}
                        <span className="text-xs text-white/40">{category.count}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* File Type Filter */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-white/80">文件类型</h3>
                  <button
                    onClick={() => setShowFileTypeFilter(!showFileTypeFilter)}
                    className="text-xs text-white/40 hover:text-white/60"
                  >
                    清除筛选
                  </button>
                </div>
                <div className="space-y-2">
                  {fileTypes.map((type) => (
                    <label
                      key={type.label}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                        {type.types && <span className="text-xs text-white/40">({type.types})</span>}
                      </div>
                      <span className="text-xs text-white/40">{type.count} 个</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tag Filter */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <h3 className="text-sm font-medium text-white/80 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {["设计稿", "合同", "需求文档", "已审核"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setShowTagFilter(!showTagFilter)}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                    >
                      {tag}
                    </button>
                  ))}
                  <button className="px-2 py-1 text-xs rounded-full bg-white/5 text-white/60 border border-white/10 hover:bg-white/10">
                    + 管理标签
                  </button>
                </div>
              </div>

              {/* Storage Analysis */}
              <Card className="mt-6 p-4 bg-[#12121a] border-white/5">
                <h3 className="text-sm font-medium text-white/80 mb-3">存储分析</h3>
                <div className="space-y-3">
                  {storageStats.breakdown.map((item) => (
                    <div key={item.type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/60">{item.type}</span>
                        <span className="text-xs text-white/60">{item.percentage}%</span>
                      </div>
                      <Progress value={item.percentage} className="h-1" />
                    </div>
                  ))}
                </div>
                <Button variant="link" size="sm" className="mt-3 text-xs text-primary p-0 h-auto">
                  查看详细分析
                </Button>
              </Card>
            </aside>

            {/* Right: File List */}
            <div className="flex-1 min-w-0">
              {/* Search & Filter */}
              <div className="mb-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    placeholder="搜索文件名、标签..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-[#12121a] border-white/5 text-white placeholder:text-white/30"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {}}
                  className="border-white/10 text-white/60"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  高级搜索
                </Button>
                <Select defaultValue="modified">
                  <SelectTrigger className="w-[140px] bg-[#12121a] border-white/5 text-white/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="modified">按修改时间</SelectItem>
                    <SelectItem value="name">按文件名</SelectItem>
                    <SelectItem value="size">按文件大小</SelectItem>
                    <SelectItem value="type">按文件类型</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Breadcrumb */}
              <div className="mb-4 flex items-center gap-2 text-sm text-white/60">
                <button className="hover:text-white">所有文件</button>
                <span>/</span>
                <button className="hover:text-white">项目文件</button>
                <span>/</span>
                <span className="text-white">某 AI 公司品牌升级</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-white/40">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>

              {/* Batch Actions */}
              {selectedFiles.length > 0 && (
                <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-primary">已选中 {selectedFiles.length} 个文件</span>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary">
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </Button>
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary">
                      <Move className="w-4 h-4 mr-2" />
                      移动
                    </Button>
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary">
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </Button>
                    <Button size="sm" variant="outline" className="border-primary/30 text-primary">
                      <Tag className="w-4 h-4 mr-2" />
                      添加标签
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedFiles([])}
                      className="text-white/60"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Files Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file);
                    const isSelected = selectedFiles.includes(file.id.toString());
                    return (
                      <Card
                        key={file.id}
                        className={cn(
                          "p-4 bg-[#12121a] border-white/5 cursor-pointer transition-all hover:border-white/10",
                          isSelected && "border-primary/50 bg-primary/5"
                        )}
                        onClick={() => toggleFileSelection(file.id.toString())}
                      >
                        <div className="relative mb-3">
                          <div className="absolute top-0 left-0">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleFileSelection(file.id.toString())}
                              className="border-white/20"
                            />
                          </div>
                          {file.starred && (
                            <Star className="absolute top-0 right-0 w-4 h-4 fill-yellow-400 text-yellow-400" />
                          )}
                          {file.type === "folder" ? (
                            <div className="w-full aspect-square rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <Folder className="w-12 h-12 text-blue-400" />
                            </div>
                          ) : (
                            <div className="w-full aspect-square rounded-lg bg-white/5 flex items-center justify-center">
                              <FileIcon className="w-12 h-12 text-white/40" />
                            </div>
                          )}
                          {file.shared && (
                            <div className="absolute bottom-1 right-1">
                              <Users className="w-3 h-3 text-white/60" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            {file.type !== "folder" && (
                              <span className="text-xs text-primary">{file.name.split(".").pop()?.toUpperCase()}</span>
                            )}
                          </div>
                          <p className="text-sm text-white/90 truncate" title={file.name}>
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-white/40">
                            {file.type === "folder" ? (
                              <span>{file.fileCount} 个文件</span>
                            ) : (
                              <>
                                <span>{file.size}</span>
                                <span>·</span>
                                <span>{file.modifiedAt}</span>
                              </>
                            )}
                          </div>
                          {file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {file.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Share2 className="w-3 h-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                              <DropdownMenuItem className="text-white hover:bg-white/10">重命名</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">移动到</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">复制</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">添加标签</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">查看详情</DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">删除</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-white/40 border-b border-white/5">
                    <div className="col-span-1"></div>
                    <div className="col-span-4">文件名</div>
                    <div className="col-span-1">大小</div>
                    <div className="col-span-1">类型</div>
                    <div className="col-span-2">修改时间</div>
                    <div className="col-span-2">上传者</div>
                    <div className="col-span-1">标签</div>
                    <div className="col-span-1">状态</div>
                    <div className="col-span-1">操作</div>
                  </div>
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file);
                    const isSelected = selectedFiles.includes(file.id.toString());
                    return (
                      <div
                        key={file.id}
                        className={cn(
                          "grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer",
                          isSelected && "bg-primary/5"
                        )}
                        onClick={() => toggleFileSelection(file.id.toString())}
                      >
                        <div className="col-span-1 flex items-center">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleFileSelection(file.id.toString())}
                            className="border-white/20"
                          />
                        </div>
                        <div className="col-span-4 flex items-center gap-3">
                          <FileIcon className="w-5 h-5 text-white/40" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/90 truncate">{file.name}</p>
                            {file.type === "folder" && (
                              <p className="text-xs text-white/40">{file.fileCount} 个文件</p>
                            )}
                          </div>
                          {file.starred && (
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          )}
                        </div>
                        <div className="col-span-1 text-sm text-white/60">{file.size || "-"}</div>
                        <div className="col-span-1 text-sm text-white/60">
                          {file.name.split(".").pop()?.toUpperCase() || "文件夹"}
                        </div>
                        <div className="col-span-2 text-sm text-white/60">{file.modifiedAt}</div>
                        <div className="col-span-2 flex items-center gap-2 text-sm text-white/60">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs text-white">
                            {file.uploadedBy.name[0]}
                          </div>
                          <span className="truncate">{file.uploadedBy.name}</span>
                        </div>
                        <div className="col-span-1">
                          {file.tags.length > 0 ? (
                            <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">
                              {file.tags[0]}
                            </Badge>
                          ) : (
                            <span className="text-xs text-white/30">-</span>
                          )}
                        </div>
                        <div className="col-span-1">
                          {file.status && (
                            <Badge
                              className={cn(
                                "text-[10px] px-1.5 py-0",
                                file.status === "已审核"
                                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                                  : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              )}
                            >
                              {file.status}
                            </Badge>
                          )}
                        </div>
                        <div className="col-span-1 flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Download className="w-3 h-3" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                              <DropdownMenuItem className="text-white hover:bg-white/10">重命名</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">移动到</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">复制</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">添加标签</DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-white/10">查看详情</DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-white/10" />
                              <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">删除</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {filteredFiles.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Upload className="w-16 h-16 text-white/20 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">暂无文件</h3>
                  <p className="text-white/60 mb-4">拖拽文件到此处上传，或点击上传按钮</p>
                  <Button
                    onClick={() => setShowUploadDialog(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    选择文件
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
