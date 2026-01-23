"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentDetail } from "@/hooks/use-contents";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

function simpleMarkdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n/g, "<br />");
}

export default function ContentPreviewPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, isLoading } = useContentDetail(id);

  const content = data?.data;
  const html = useMemo(() => {
    if (!content) return "";
    return content.contentFormat === "markdown"
      ? simpleMarkdownToHtml(content.content)
      : content.content;
  }, [content]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Skeleton className="h-96 w-full max-w-3xl" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Card className="bg-[#12121a] border-white/5 p-8 text-center">
          <p className="text-white/60 mb-4">内容不存在</p>
          <Button asChild variant="outline" className="border-white/10">
            <Link href="/admin/contents">返回列表</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <Link href={`/admin/contents/${id}/edit`} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回编辑
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white/60 hover:text-white"
            asChild
          >
            <a href={`/insights/${content.slug}`} target="_blank" rel="noopener">
              <ExternalLink className="w-4 h-4 mr-2" />
              在新标签打开
            </a>
          </Button>
        </div>

        <Card className="bg-[#12121a] border-white/5 overflow-hidden">
          <div className="p-8 md:p-12">
            <p className="text-xs text-white/40 mb-4">预览：{content.title}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{content.title}</h1>
            {content.subtitle && (
              <p className="text-lg text-white/60 mb-6">{content.subtitle}</p>
            )}
            {content.featuredImage && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#0a0a0f] mb-8">
                <Image
                  src={content.featuredImage}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div
              className={cn(
                "prose prose-invert prose-lg max-w-none text-white/80",
                "prose-headings:text-white prose-a:text-primary"
              )}
              dangerouslySetInnerHTML={{ __html: html }}
            />
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap gap-4 text-sm text-white/50">
              <span>发布于：{content.publishedAt ? new Date(content.publishedAt).toLocaleDateString("zh-CN") : "未发布"}</span>
              <span>作者：{(content.author as any)?.name ?? "–"}</span>
              <span>分类：{(content.category as any)?.name ?? content.categoryKeyword ?? "–"}</span>
              <span>浏览：{content.views >= 1000 ? `${(content.views / 1000).toFixed(1)}K` : content.views} 次</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
