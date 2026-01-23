"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Settings,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useTemplateCategories,
  useCreateCategory,
  useUpdateCategory,
} from "@/hooks/use-templates";
import {
  adminMainNav,
  adminSystemNav,
  adminSettingsNav,
} from "@/lib/admin-nav";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);

  const { data: categoriesData, isLoading } = useTemplateCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const categories = categoriesData?.data || [];

  const handleCreate = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setIcon("");
    setOrder(0);
    setActive(true);
    setEditDialogOpen(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
    setIcon(category.icon || "");
    setOrder(category.order || 0);
    setActive(category.active !== false);
    setEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error("请填写分类名称和 slug");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          data: { name, slug, description, icon, order, active },
        });
      } else {
        await createCategory.mutateAsync({
          name,
          slug,
          description,
          icon,
          order,
          active,
        });
      }
      setEditDialogOpen(false);
    } catch (error) {
      // Error handled by mutation
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
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                <Link href="/admin/templates" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  返回模板管理
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">分类管理</h1>
                <p className="text-white/60 mt-1">管理模板分类和标签</p>
              </div>
            </div>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              添加分类
            </Button>
          </div>

          {/* 分类列表 */}
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full bg-[#12121a]" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Card className="bg-[#12121a] border-white/5 p-12 text-center">
              <Settings className="w-16 h-16 mx-auto mb-4 text-white/20" />
              <p className="text-white/60 mb-4">暂无分类</p>
              <Button onClick={handleCreate} className="bg-gradient-to-r from-purple-500 to-pink-500">
                <Plus className="w-4 h-4 mr-2" />
                创建第一个分类
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {categories.map((category: any) => (
                <Card
                  key={category.id}
                  className="bg-[#12121a] border-white/5 p-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {category.icon ? (
                        <img
                          src={category.icon}
                          alt={category.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-[#0a0a0f] flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white/40" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{category.name}</h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              category.active
                                ? "border-green-500/30 text-green-400"
                                : "border-gray-500/30 text-gray-400"
                            )}
                          >
                            {category.active ? "启用" : "禁用"}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/60 mb-2">
                          {category.description || "暂无描述"}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-white/40">
                          <span>Slug: {category.slug}</span>
                          <span>•</span>
                          <span>模板数: {category.templatesCount || 0}</span>
                          <span>•</span>
                          <span>显示顺序: {category.order}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(category)}
                        className="border-white/10 text-white/60 hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        编辑
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 编辑对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="bg-[#12121a] border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingCategory ? "编辑分类" : "创建分类"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white/80">
                分类名称 <span className="text-red-400">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：Logo设计"
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>

            <div>
              <Label className="text-white/80">
                URL Slug <span className="text-red-400">*</span>
              </Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                placeholder="例如：logo-design"
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
              <p className="text-xs text-white/40 mt-1">
                用于 URL，只能包含小写字母、数字和连字符
              </p>
            </div>

            <div>
              <Label className="text-white/80">分类说明</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="分类的详细描述"
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-white/80">分类图标 URL</Label>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="https://example.com/icon.png"
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>

            <div>
              <Label className="text-white/80">显示顺序</Label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                placeholder="数字越小越靠前"
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-[#0a0a0f] text-purple-500"
              />
              <Label htmlFor="active" className="text-white/80 cursor-pointer">
                启用此分类
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              className="border-white/10 text-white/60 hover:text-white"
            >
              取消
            </Button>
            <Button
              onClick={handleSave}
              disabled={createCategory.isPending || updateCategory.isPending}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              {createCategory.isPending || updateCategory.isPending
                ? "保存中..."
                : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
