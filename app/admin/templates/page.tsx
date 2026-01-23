"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileImage,
  Upload,
  Search,
  Filter,
  Grid3x3,
  List,
  Settings,
  CheckSquare,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  adminMainNav,
  adminSystemNav,
  adminSettingsNav,
} from "@/lib/admin-nav";
import {
  useTemplates,
  useTemplateCategories,
  useDeleteTemplate,
  useSetTemplateFeatured,
  useUpdateTemplateStatus,
  useBatchActionTemplates,
  type TemplateFilters,
} from "@/hooks/use-templates";
import { TemplateCard } from "@/components/admin/templates/template-card";
import { UploadTemplateDialog } from "@/components/admin/templates/upload-template-dialog";
import { useRouter } from "next/navigation";

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;

  const filters: TemplateFilters = {
    ...(statusFilter !== "all" && { status: statusFilter as any }),
    ...(categoryFilter !== "all" && { category: categoryFilter }),
    ...(sortBy && { sortBy: sortBy as any }),
    ...(searchQuery && { search: searchQuery }),
    ...(featuredOnly && { featured: true }),
    page,
    limit,
  };

  const { data: templatesData, isLoading } = useTemplates(filters);
  const { data: categoriesData } = useTemplateCategories();
  const deleteTemplate = useDeleteTemplate();
  const setFeatured = useSetTemplateFeatured();
  const updateStatus = useUpdateTemplateStatus();
  const batchAction = useBatchActionTemplates();

  const templates = templatesData?.data || [];
  const categories = categoriesData?.data || [];
  const pagination = templatesData?.pagination;

  const handleSelectTemplate = (id: string) => {
    const newSelected = new Set(selectedTemplates);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTemplates(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTemplates.size === templates.length) {
      setSelectedTemplates(new Set());
    } else {
      setSelectedTemplates(new Set(templates.map((t: any) => t.id)));
    }
  };

  const handleBatchAction = async (action: "publish" | "archive" | "delete") => {
    if (selectedTemplates.size === 0) return;
    await batchAction.mutateAsync({
      action,
      templateIds: Array.from(selectedTemplates),
    });
    setSelectedTemplates(new Set());
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/templates/${id}/edit`);
  };

  const handleSetFeatured = async (id: string, isFeatured: boolean) => {
    await setFeatured.mutateAsync({ id, isFeatured });
  };

  const handleArchive = async (id: string) => {
    await updateStatus.mutateAsync({ id, status: "archived" });
  };

  const handleDelete = async (id: string) => {
    if (confirm("确定要删除这个模板吗？此操作不可恢复。")) {
      await deleteTemplate.mutateAsync(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/loopart-logo.svg"
              alt="LoopArt Logo"
              width={120}
              height={21}
              className="h-5 w-auto"
            />
            <span className="text-white/40 text-sm">管理后台</span>
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
              Admin
            </Badge>
          </div>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <div className="text-xs text-white/40 mb-2 px-4">主要功能</div>
          {adminMainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/admin/templates";
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
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge
                    className={cn(
                      "ml-auto text-xs",
                      item.badgeColor === "primary" && "bg-primary/20 text-primary",
                      item.badgeColor === "orange" && "bg-orange-500/20 text-orange-400",
                      item.badgeColor === "red" && "bg-red-500/20 text-red-400",
                      item.badgeColor === "green" && "bg-green-500/20 text-green-400"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="flex-1 w-full md:ml-60">
        <div className="p-8 space-y-6">
          {/* 头部 */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">模板管理</h1>
              <p className="text-white/60">
                管理所有设计模板，包括上传、编辑、分类和统计
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-white/10 text-white/60 hover:text-white"
                onClick={() => router.push("/admin/templates/categories")}
              >
                <Settings className="w-4 h-4 mr-2" />
                管理分类
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => setUploadDialogOpen(true)}
              >
                <Upload className="w-4 h-4 mr-2" />
                上传新模板
              </Button>
            </div>
          </div>

          {/* 工具栏 */}
          <Card className="bg-[#12121a] border-white/5 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索 */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    placeholder="搜索模板名称、标签..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#0a0a0f] border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              {/* 筛选器 */}
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-[#0a0a0f] border-white/10 text-white">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="archived">已下架</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[140px] bg-[#0a0a0f] border-white/10 text-white">
                    <SelectValue placeholder="分类" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="all">全部分类</SelectItem>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] bg-[#0a0a0f] border-white/10 text-white">
                    <SelectValue placeholder="排序" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="createdAt">上传时间</SelectItem>
                    <SelectItem value="downloads">下载量</SelectItem>
                    <SelectItem value="rating">评分</SelectItem>
                    <SelectItem value="views">查看数</SelectItem>
                    <SelectItem value="price">价格</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="featured"
                    checked={featuredOnly}
                    onCheckedChange={(checked) => setFeaturedOnly(checked === true)}
                    className="border-white/20"
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm text-white/60 cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    仅精选
                  </label>
                </div>

                <div className="flex items-center gap-1 border-l border-white/10 pl-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "text-white/60 hover:text-white",
                      viewMode === "grid" && "text-white bg-white/10"
                    )}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "text-white/60 hover:text-white",
                      viewMode === "list" && "text-white bg-white/10"
                    )}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* 批量操作栏 */}
            {selectedTemplates.size > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSelectAll}
                    className="text-white/60 hover:text-white"
                  >
                    {selectedTemplates.size === templates.length ? "取消全选" : "全选"}
                  </Button>
                  <span className="text-sm text-white/60">
                    已选择 {selectedTemplates.size} 个模板
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBatchAction("publish")}
                    className="border-white/10 text-white/60 hover:text-white"
                  >
                    批量发布
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBatchAction("archive")}
                    className="border-white/10 text-white/60 hover:text-white"
                  >
                    批量下架
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBatchAction("delete")}
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    批量删除
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedTemplates(new Set())}
                    className="text-white/60 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* 模板列表 */}
          {isLoading ? (
            <div className={cn("grid gap-6", viewMode === "grid" ? "grid-cols-4" : "grid-cols-1")}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-96 w-full bg-[#12121a]" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <Card className="bg-[#12121a] border-white/5 p-12 text-center">
              <FileImage className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-4">暂无模板</p>
              <Button
                onClick={() => setUploadDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                <Upload className="w-4 h-4 mr-2" />
                上传第一个模板
              </Button>
            </Card>
          ) : (
            <>
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                )}
              >
                {templates.map((template: any) => (
                  <div key={template.id} className="relative">
                    {viewMode === "grid" ? (
                      <TemplateCard
                        template={template}
                        onEdit={handleEdit}
                        onSetFeatured={handleSetFeatured}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <Card className="bg-[#12121a] border-white/5 p-4">
                        <div className="flex items-center gap-4">
                          <Checkbox
                            checked={selectedTemplates.has(template.id)}
                            onCheckedChange={() => handleSelectTemplate(template.id)}
                            className="border-white/20"
                          />
                          <div className="w-24 h-24 bg-[#0a0a0f] rounded overflow-hidden flex-shrink-0">
                            {template.preview && template.preview.length > 0 ? (
                              <img
                                src={template.preview[0]}
                                alt={template.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/20">
                                无预览
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                            <p className="text-sm text-white/60 line-clamp-1">
                              {template.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <Badge
                                variant="outline"
                                className="text-xs border-white/10 text-white/60"
                              >
                                {template.status === "published"
                                  ? "已发布"
                                  : template.status === "draft"
                                  ? "草稿"
                                  : "已下架"}
                              </Badge>
                              <span className="text-sm text-white/60">
                                下载: {template.downloads}
                              </span>
                              <span className="text-sm text-white/60">
                                评分: {template.rating.toFixed(1)} ⭐
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(template.id)}
                              className="border-white/10 text-white/60 hover:text-white"
                            >
                              编辑
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              asChild
                              className="border-white/10 text-white/60 hover:text-white"
                            >
                              <Link href={`/admin/templates/${template.id}/edit`}>详情</Link>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                ))}
              </div>

              {/* 分页 */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="border-white/10 text-white/60 hover:text-white"
                  >
                    上一页
                  </Button>
                  <span className="text-sm text-white/60">
                    第 {page} / {pagination.totalPages} 页
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="border-white/10 text-white/60 hover:text-white"
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 上传对话框 */}
      <UploadTemplateDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
