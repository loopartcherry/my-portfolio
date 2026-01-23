"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Plus,
  Edit,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useContentCategories,
  useCreateContentCategory,
  useUpdateContentCategory,
} from "@/hooks/use-contents";
import { adminMainNav } from "@/lib/admin-nav";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ContentCategoriesPage() {
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState(0);

  const { data, isLoading } = useContentCategories();
  const createCat = useCreateContentCategory();
  const updateCat = useUpdateContentCategory();

  const categories = data?.data ?? [];

  const openCreate = () => {
    setEditing(null);
    setName("");
    setSlug("");
    setDescription("");
    setIcon("");
    setOrder(0);
    setEditOpen(true);
  };

  const openEdit = (c: any) => {
    setEditing(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description ?? "");
    setIcon(c.icon ?? "");
    setOrder(c.order ?? 0);
    setEditOpen(true);
  };

  const save = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error("请填写分类名称和 slug");
      return;
    }
    try {
      if (editing) {
        await updateCat.mutateAsync({
          id: editing.id,
          data: { name, slug, description, icon: icon || undefined, order },
        });
      } else {
        await createCat.mutateAsync({
          name,
          slug,
          description: description || undefined,
          icon: icon || undefined,
          order,
        });
      }
      setEditOpen(false);
    } catch {}
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
            <span className="px-2 py-0.5 text-xs rounded bg-red-500/20 text-red-400 border border-red-500/30">
              Admin
            </span>
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
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
                  isActive ? "bg-primary/10 text-primary" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 w-full md:ml-60">
        <div className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
                <Link href="/admin/contents" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  返回内容管理
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">内容分类</h1>
                <p className="text-white/60 mt-1">管理文章分类</p>
              </div>
            </div>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={openCreate}
            >
              <Plus className="w-4 h-4 mr-2" />
              添加分类
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 bg-[#12121a]" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <Card className="bg-[#12121a] border-white/5 p-12 text-center">
              <p className="text-white/60 mb-4">暂无分类</p>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500" onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" />
                创建第一个分类
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {categories.map((c: any) => (
                <Card key={c.id} className="bg-[#12121a] border-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {c.icon ? (
                        <img src={c.icon} alt="" className="w-12 h-12 rounded object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded bg-[#0a0a0f] flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-white/40" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-white">{c.name}</p>
                        <p className="text-sm text-white/50">{c.description ?? "–"}</p>
                        <p className="text-xs text-white/40 mt-1">
                          Slug: {c.slug} · 文章数: {c.contentsCount ?? 0} · 排序: {c.order}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10"
                      onClick={() => openEdit(c)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      编辑
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-[#12121a] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "编辑分类" : "新建分类"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-white/80">名称 *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                placeholder="如：设计趋势"
              />
            </div>
            <div>
              <Label className="text-white/80">Slug *</Label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                placeholder="如：design-trends"
              />
            </div>
            <div>
              <Label className="text-white/80">描述</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                rows={2}
              />
            </div>
            <div>
              <Label className="text-white/80">图标 URL</Label>
              <Input
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                placeholder="https://..."
              />
            </div>
            <div>
              <Label className="text-white/80">排序</Label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="border-white/10" onClick={() => setEditOpen(false)}>
              取消
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={save}
              disabled={createCat.isPending || updateCat.isPending}
            >
              {createCat.isPending || updateCat.isPending ? "保存中…" : "保存"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
