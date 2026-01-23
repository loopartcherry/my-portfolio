"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ContentStatus = "draft" | "published" | "archived";

interface PublishPanelProps {
  status: ContentStatus;
  onStatusChange: (s: ContentStatus) => void;
  publishedAt: string;
  onPublishedAtChange: (v: string) => void;
  expiresAt: string;
  onExpiresAtChange: (v: string) => void;
  enableExpires: boolean;
  onEnableExpiresChange: (v: boolean) => void;
  isFeatured: boolean;
  onIsFeaturedChange: (v: boolean) => void;
  featuredOrder: number;
  onFeaturedOrderChange: (v: number) => void;
  categoryId: string;
  onCategoryIdChange: (v: string) => void;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  categories: Array<{ id: string; name: string; slug: string }>;
  lastModified?: string;
  lastModifiedBy?: string;
  suggestedTags?: string[];
  className?: string;
}

export function PublishPanel({
  status,
  onStatusChange,
  publishedAt,
  onPublishedAtChange,
  expiresAt,
  onExpiresAtChange,
  enableExpires,
  onEnableExpiresChange,
  isFeatured,
  onIsFeaturedChange,
  featuredOrder,
  onFeaturedOrderChange,
  categoryId,
  onCategoryIdChange,
  tags,
  onTagsChange,
  categories,
  lastModified,
  lastModifiedBy,
  suggestedTags = ["品牌", "UI/UX", "排版", "设计趋势", "案例"],
  className,
}: PublishPanelProps) {
  const addTag = (t: string) => {
    if (t && !tags.includes(t)) onTagsChange([...tags, t]);
  };

  const removeTag = (t: string) => {
    onTagsChange(tags.filter((x) => x !== t));
  };

  const [tagInput, setTagInput] = useState("");
  return (
    <Card className={cn("bg-[#12121a] border-white/5 p-4 space-y-4", className)}>
      <h3 className="font-semibold text-white">分类和标签</h3>
      <div>
        <Label className="text-white/80">分类</Label>
        <Select value={categoryId || "none"} onValueChange={(v) => onCategoryIdChange(v === "none" ? "" : v)}>
          <SelectTrigger className="mt-1 bg-[#0a0a0f] border-white/10 text-white">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent className="bg-[#12121a] border-white/10">
            <SelectItem value="none">无</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-white/80">标签</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/10 text-sm text-white/80"
            >
              {t}
              <button
                type="button"
                onClick={() => removeTag(t)}
                className="text-white/40 hover:text-white"
              >
                ×
              </button>
            </span>
          ))}
          <div className="flex gap-1 flex-wrap">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput.trim());
                  setTagInput("");
                }
              }}
              placeholder="+ 添加标签"
              className="w-24 h-8 text-sm bg-[#0a0a0f] border-white/10"
            />
            {suggestedTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => addTag(t)}
                className="px-2 py-0.5 text-xs rounded border border-white/20 text-white/60 hover:bg-white/10"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-white pt-2 border-t border-white/10">发布设置</h3>
      <div>
        <Label className="text-white/80">状态</Label>
        <div className="flex gap-4 mt-2">
          {(["draft", "published", "archived"] as const).map((s) => (
            <label key={s} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={status === s}
                onChange={() => onStatusChange(s)}
                className="rounded-full border-white/20 bg-[#0a0a0f] text-primary"
              />
              <span className="text-sm text-white/80">
                {s === "draft" ? "草稿" : s === "published" ? "已发布" : "已存档"}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-white/80">发布时间</Label>
        <Input
          type="datetime-local"
          value={publishedAt ? publishedAt.slice(0, 16) : ""}
          onChange={(e) => onPublishedAtChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
          className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={enableExpires}
            onCheckedChange={(c) => onEnableExpiresChange(c === true)}
            className="border-white/20"
          />
          <span className="text-sm text-white/80">设置过期时间</span>
        </label>
        {enableExpires && (
          <Input
            type="datetime-local"
            value={expiresAt ? expiresAt.slice(0, 16) : ""}
            onChange={(e) => onExpiresAtChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
            className="mt-2 bg-[#0a0a0f] border-white/10 text-white"
          />
        )}
      </div>
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={isFeatured}
            onCheckedChange={(c) => onIsFeaturedChange(c === true)}
            className="border-white/20"
          />
          <span className="text-sm text-white/80">在首页推荐</span>
        </label>
        {isFeatured && (
          <Input
            type="number"
            min={0}
            value={featuredOrder}
            onChange={(e) => onFeaturedOrderChange(parseInt(e.target.value, 10) || 0)}
            className="mt-2 bg-[#0a0a0f] border-white/10 text-white"
            placeholder="排序（越小越靠前）"
          />
        )}
      </div>
      {(lastModified || lastModifiedBy) && (
        <p className="text-xs text-white/40 pt-2 border-t border-white/10">
          最后修改：{lastModified}
          {lastModifiedBy && ` 由 ${lastModifiedBy}`}
        </p>
      )}
    </Card>
  );
}
