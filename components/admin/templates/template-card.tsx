"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Download,
  Eye,
  Heart,
  MoreVertical,
  Edit,
  Eye as EyeIcon,
  BarChart3,
  Sparkles,
  Archive,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: {
    id: string;
    name: string;
    description?: string;
    categories: Array<{ id: string; name: string; slug: string }>;
    preview: string[];
    price: number;
    discount?: number;
    downloads: number;
    likes: number;
    rating: number;
    tags?: string[] | null;
    author?: string;
    status: string;
    views: number;
    isFeatured?: boolean;
    featuredUntil?: string | null;
  };
  onEdit?: (id: string) => void;
  onSetFeatured?: (id: string, isFeatured: boolean) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onSetFeatured,
  onArchive,
  onDelete,
}: TemplateCardProps) {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const currentPrice = template.discount
    ? Math.round(template.price * template.discount)
    : template.price;

  const statusColors: Record<string, string> = {
    published: "bg-green-500/20 text-green-400 border-green-500/30",
    draft: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    archived: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  };

  const handlePrevPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev > 0 ? prev - 1 : template.preview.length - 1));
  };

  const handleNextPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewIndex((prev) => (prev < template.preview.length - 1 ? prev + 1 : 0));
  };

  return (
    <Card className="bg-[#12121a] border-white/5 hover:border-white/10 transition-all group overflow-hidden">
      {/* 预览图区域 */}
      <div
        className="relative aspect-[4/3] bg-[#0a0a0f] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {template.preview && template.preview.length > 0 ? (
          <>
            <div className="relative w-full h-full">
              <Image
                src={template.preview[previewIndex] || "/placeholder.png"}
                alt={template.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            </div>

            {/* 分类标签 */}
            {template.categories && template.categories.length > 0 && (
              <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                {template.categories.slice(0, 2).map((cat) => (
                  <Badge
                    key={cat.id}
                    variant="secondary"
                    className="bg-black/60 text-white text-xs border-0"
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>
            )}

            {/* 精选徽章 */}
            {template.isFeatured && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  精选
                </Badge>
              </div>
            )}

            {/* 预览图导航（悬停时显示） */}
            {isHovered && template.preview.length > 1 && (
              <>
                <button
                  onClick={handlePrevPreview}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextPreview}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {template.preview.map((_, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        idx === previewIndex ? "bg-white w-4" : "bg-white/40"
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            {/* 操作按钮（悬停时显示） */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(template.id);
                }}
                className="bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <Edit className="w-4 h-4 mr-1" />
                编辑
              </Button>
              <Button
                size="sm"
                variant="secondary"
                asChild
                className="bg-white/10 hover:bg-white/20 text-white border-0"
              >
                <Link href={`/admin/templates/${template.id}/edit`}>
                  <EyeIcon className="w-4 h-4 mr-1" />
                  预览
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/40">
            暂无预览图
          </div>
        )}
      </div>

      {/* 模板信息 */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-white mb-1 line-clamp-1">{template.name}</h3>
          {template.author && (
            <p className="text-sm text-white/60">作者：{template.author}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{template.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1 text-white/60 text-sm">
              <Download className="w-4 h-4" />
              <span>{(template.downloads / 1000).toFixed(1)}K</span>
            </div>
          </div>
          <div className="text-right">
            {template.discount ? (
              <div>
                <span className="text-sm text-white/40 line-through">¥{template.price}</span>
                <span className="ml-2 text-lg font-bold text-white">¥{currentPrice}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-white">¥{template.price}</span>
            )}
          </div>
        </div>

        {/* 标签 */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs border-white/10 text-white/60"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 状态和统计 */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <Badge
            variant="outline"
            className={cn("text-xs", statusColors[template.status] || statusColors.draft)}
          >
            {template.status === "published" ? "已发布" : template.status === "draft" ? "草稿" : "已下架"}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{(template.views / 1000).toFixed(1)}K</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{template.likes}</span>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-white/10 text-white/60 hover:text-white"
            onClick={() => onEdit?.(template.id)}
          >
            <Edit className="w-3 h-3 mr-1" />
            编辑
          </Button>
          <Button
            size="sm"
            variant="outline"
            asChild
            className="flex-1 border-white/10 text-white/60 hover:text-white"
          >
            <Link href={`/admin/templates/${template.id}/edit`}>
              <BarChart3 className="w-3 h-3 mr-1" />
              统计
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 text-white/60 hover:text-white"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
              <DropdownMenuItem
                onClick={() => onSetFeatured?.(template.id, !template.isFeatured)}
                className="text-white/80 hover:bg-white/10"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {template.isFeatured ? "取消精选" : "设置精选"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onArchive?.(template.id)}
                className="text-white/80 hover:bg-white/10"
              >
                <Archive className="w-4 h-4 mr-2" />
                下架
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => onDelete?.(template.id)}
                className="text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
}
