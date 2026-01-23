"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeoPanelProps {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
  onKeywordsChange: (v: string) => void;
  className?: string;
}

const metaTitleMax = 60;
const metaDescMax = 160;

function score(a: number, max: number) {
  if (a >= max) return 100;
  if (a >= max * 0.9) return 90;
  if (a >= max * 0.7) return 70;
  if (a > 0) return 50;
  return 0;
}

export function SeoPanel({
  metaTitle,
  metaDescription,
  keywords,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onKeywordsChange,
  className,
}: SeoPanelProps) {
  const tScore = score(metaTitle.length, metaTitleMax);
  const dScore = score(metaDescription.length, metaDescMax);
  const avg = Math.round((tScore + dScore) / 2);
  const grade = avg >= 90 ? "A" : avg >= 70 ? "B+" : avg >= 50 ? "B" : "C";

  return (
    <Card className={cn("bg-[#12121a] border-white/5 p-4 space-y-4", className)}>
      <h3 className="font-semibold text-white">SEO 设置</h3>

      <div>
        <Label className="text-white/80">Meta 标题</Label>
        <Input
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder="用于搜索引擎的标题"
          className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
          maxLength={metaTitleMax}
        />
        <p className="text-xs text-white/40 mt-1">
          字数：{metaTitle.length}/{metaTitleMax}
        </p>
      </div>

      <div>
        <Label className="text-white/80">Meta 描述</Label>
        <Textarea
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder="简短描述，用于搜索结果"
          className="mt-1 bg-[#0a0a0f] border-white/10 text-white resize-none"
          rows={3}
          maxLength={metaDescMax}
        />
        <p className="text-xs text-white/40 mt-1">
          字数：{metaDescription.length}/{metaDescMax}
        </p>
      </div>

      <div>
        <Label className="text-white/80">关键词</Label>
        <Input
          value={keywords}
          onChange={(e) => onKeywordsChange(e.target.value)}
          placeholder="逗号分隔"
          className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
        />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/10">
        <span className="text-sm text-white/60">SEO 评分：</span>
        <span
          className={cn(
            "font-medium",
            grade === "A" && "text-green-400",
            grade === "B+" && "text-green-300",
            grade === "B" && "text-yellow-400",
            grade === "C" && "text-orange-400"
          )}
        >
          {grade} {grade === "A" ? "优秀" : grade === "B+" ? "良好" : grade === "B" ? "一般" : "待优化"}
        </span>
      </div>
      <button
        type="button"
        className="flex items-center gap-1 text-xs text-white/40 hover:text-white/60"
      >
        <Info className="w-3.5 h-3.5" />
        查看建议
      </button>
    </Card>
  );
}
