"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Search,
  Plus,
  Settings,
  X,
  Edit,
  Eye,
  Trash2,
  Star,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { adminMainNav } from "@/lib/admin-nav";
import {
  useContents,
  useContentCategories,
  usePublishContent,
  useDeleteContent,
  type ContentFilters,
  type ContentStatus,
} from "@/hooks/use-contents";
import { useRouter } from "next/navigation";

const typeLabels: Record<string, string> = {
  article: "文章",
  case_study: "案例",
  faq: "FAQ",
  page: "页面",
};

export default function AdminContentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  const filters: ContentFilters = {
    ...(typeFilter !== "all" && { type: typeFilter as any }),
    ...(statusFilter !== "all" && { status: statusFilter as any }),
    ...(categoryFilter !== "all" && { category: categoryFilter }),
    ...(searchQuery && { search: searchQuery }),
    sortBy: sortBy as any,
    page,
    limit: 20,
  };

  const { data, isLoading } = useContents(filters);
  const { data: categoriesData } = useContentCategories();
  const publishMutation = usePublishContent();
  const deleteMutation = useDeleteContent();

  const list = data?.data ?? [];
  const categories = categoriesData?.data ?? [];
  const pagination = data?.pagination;

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const selectAll = () => {
    if (selectedIds.size === list.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(list.map((c: any) => c.id)));
  };

  const batchAction = async (action: "publish" | "draft" | "archived" | "delete") => {
    if (selectedIds.size === 0) return;
    const statusMap: Record<string, ContentStatus> = {
      publish: "published",
      draft: "draft",
      archived: "archived",
    };
    if (action === "delete") {
      if (!confirm(`确定要删除选中的 ${selectedIds.size} 篇内容吗？`)) return;
      for (const id of selectedIds) {
        await deleteMutation.mutateAsync(id);
      }
    } else {
      for (const id of selectedIds) {
        await publishMutation.mutateAsync({
          id,
          status: statusMap[action],
          ...(action === "publish" && { publishedAt: new Date().toISOString() }),
        });
      }
    }
    setSelectedIds(new Set());
  };

  const statusBadge = (status: string, isFeatured?: boolean) => {
    const base = (
      <Badge
        variant="outline"
        className={cn(
          "text-xs",
          status === "published" && "bg-green-500/20 text-green-400 border-green-500/30",
          status === "draft" && "bg-gray-500/20 text-gray-400 border-gray-500/30",
          status === "archived" && "bg-gray-500/20 text-gray-400 border-gray-500/30"
        )}
      >
        {status === "published" && "◉ "}
        {status === "draft" && "○ "}
        {status === "archived" && "✗ "}
        {status === "published" ? "已发布" : status === "draft" ? "草稿" : "已存档"}
      </Badge>
    );
    if (isFeatured) {
      return (
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          {base}
        </span>
      );
    }
    return base;
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
            const isActive = item.href === "/admin/contents";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                  isActive ? "bg-primary/10 text-primary" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.badge && (
                  <Badge
                    className={cn(
                      "ml-auto text-xs",
                      item.badgeColor === "primary" && "bg-primary/20 text-primary",
                      item.badgeColor === "orange" && "bg-orange-500/20 text-orange-400"
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">内容管理</h1>
              <p className="text-white/60">管理官网文章、案例、FAQ 等</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-white/10 text-white/60 hover:text-white"
                onClick={() => router.push("/admin/contents/stats")}
              >
                统计
              </Button>
              <Button
                variant="outline"
                className="border-white/10 text-white/60 hover:text-white"
                onClick={() => router.push("/admin/contents/categories")}
              >
                <Settings className="w-4 h-4 mr-2" />
                管理分类
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                onClick={() => router.push("/admin/contents/new/edit")}
              >
                <Plus className="w-4 h-4 mr-2" />
                新建文章
              </Button>
            </div>
          </div>

          <Card className="bg-[#12121a] border-white/5 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    placeholder="按标题、内容搜索..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-[#0a0a0f] border-white/10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[120px] bg-[#0a0a0f] border-white/10 text-white">
                    <SelectValue placeholder="类型" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="article">文章</SelectItem>
                    <SelectItem value="case_study">案例</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                    <SelectItem value="page">页面</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px] bg-[#0a0a0f] border-white/10 text-white">
                    <SelectValue placeholder="状态" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="archived">已存档</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[120px] bg-[#0a0a0f] border-white/10 text-white">
                    <SelectValue placeholder="分类" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="all">全部分类</SelectItem>
                    {categories.map((c: any) => (
                      <SelectItem key={c.id} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px] bg-[#0a0a0f] border-white/10 text-white">
                    <SelectValue placeholder="排序" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#12121a] border-white/10">
                    <SelectItem value="createdAt">最新</SelectItem>
                    <SelectItem value="publishedAt">发布时间</SelectItem>
                    <SelectItem value="views">最多浏览</SelectItem>
                    <SelectItem value="title">标题</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedIds.size > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm text-white/60">已选 {selectedIds.size} 篇</span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10"
                    onClick={() => batchAction("publish")}
                  >
                    发布
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10"
                    onClick={() => batchAction("draft")}
                  >
                    移至草稿
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10"
                    onClick={() => batchAction("archived")}
                  >
                    存档
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500/30 text-red-400"
                    onClick={() => batchAction("delete")}
                  >
                    删除
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full bg-[#12121a]" />
              ))}
            </div>
          ) : list.length === 0 ? (
            <Card className="bg-[#12121a] border-white/5 p-12 text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-4">暂无内容</p>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={() => router.push("/admin/contents/new/edit")}
              >
                <Plus className="w-4 h-4 mr-2" />
                新建第一篇文章
              </Button>
            </Card>
          ) : (
            <>
              <Card className="bg-[#12121a] border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 w-10">
                          <Checkbox
                            checked={list.length > 0 && selectedIds.size === list.length}
                            onCheckedChange={selectAll}
                            className="border-white/20"
                          />
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white/80">标题</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white/80">作者</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white/80">分类</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white/80">状态</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white/80">浏览</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-white/80">发布时间</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-white/80">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((row: any) => (
                        <tr
                          key={row.id}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <Checkbox
                              checked={selectedIds.has(row.id)}
                              onCheckedChange={() => toggleSelect(row.id)}
                              className="border-white/20"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => router.push(`/admin/contents/${row.id}/edit`)}
                              className="text-white hover:text-primary text-left font-medium"
                            >
                              {row.title}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-sm text-white/60">
                            {row.author?.name ?? row.author?.email ?? "-"}
                          </td>
                          <td className="py-3 px-4 text-sm text-white/60">
                            {row.category?.name ?? row.categoryKeyword ?? "-"}
                          </td>
                          <td className="py-3 px-4">
                            {statusBadge(row.status, row.isFeatured)}
                          </td>
                          <td className="py-3 px-4 text-sm text-white/60">
                            {row.views >= 1000 ? `${(row.views / 1000).toFixed(1)}K` : row.views}
                          </td>
                          <td className="py-3 px-4 text-sm text-white/60">
                            {row.publishedAt
                              ? new Date(row.publishedAt).toLocaleDateString("zh-CN")
                              : "-"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white"
                                onClick={() => router.push(`/admin/contents/${row.id}/edit`)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white"
                                asChild
                              >
                                <Link href={`/admin/contents/${row.id}/preview`}>
                                  <Eye className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white"
                                asChild
                              >
                                <Link href={`/admin/contents/${row.id}/history`} title="版本历史">
                                  <History className="w-4 h-4" />
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                                onClick={async () => {
                                  if (confirm("确定删除这篇内容吗？")) {
                                    await deleteMutation.mutateAsync(row.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    上一页
                  </Button>
                  <span className="text-sm text-white/60">
                    第 {page} / {pagination.totalPages} 页
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/10"
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
