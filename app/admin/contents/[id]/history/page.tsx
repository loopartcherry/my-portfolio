"use client";

import Link from "next/link";
import { ArrowLeft, Eye, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentDetail, useContentRevisions, useRestoreRevision } from "@/hooks/use-contents";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ContentHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: detailRes, isLoading } = useContentDetail(id);
  const { data: revisionsRes, isLoading: revLoading } = useContentRevisions(id);
  const restoreMutation = useRestoreRevision();

  const content = detailRes?.data;
  const revisions = revisionsRes?.data ?? [];
  const count = revisionsRes?.count ?? 0;

  const handleRestore = async (revisionId: string) => {
    if (!confirm("确定恢复到此版本？当前内容将被覆盖。")) return;
    try {
      await restoreMutation.mutateAsync({ contentId: id, revisionId });
      router.push(`/admin/contents/${id}/edit`);
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Skeleton className="h-96 w-full max-w-2xl" />
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
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
            <Link href={`/admin/contents/${id}/edit`} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回编辑
            </Link>
          </Button>
          <h1 className="text-xl font-bold text-white">版本历史</h1>
        </div>

        <p className="text-white/60 mb-6">{content.title}</p>

        {revLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full bg-[#12121a]" />
            ))}
          </div>
        ) : revisions.length === 0 ? (
          <Card className="bg-[#12121a] border-white/5 p-8 text-center">
            <p className="text-white/60">暂无版本历史</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {revisions.map((rev: any, idx: number) => (
              <Card key={rev.id} className="bg-[#12121a] border-white/5 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-white">
                      版本 {count - idx}
                      {idx === 0 && " (当前)"}
                    </p>
                    <p className="text-sm text-white/50 mt-1">
                      修改于：{new Date(rev.revisedAt).toLocaleString("zh-CN")}
                    </p>
                    <p className="text-sm text-white/50">
                      修改人：{(rev.revisedBy as any)?.name ?? rev.revisedBy?.email ?? "–"}
                    </p>
                    {rev.changeNote && (
                      <p className="text-sm text-white/60 mt-2">改动说明：{rev.changeNote}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/10 text-white/60 hover:text-white"
                      asChild
                    >
                      <Link href={`/admin/contents/${id}/preview`}>
                        <Eye className="w-4 h-4 mr-1" />
                        预览
                      </Link>
                    </Button>
                    {idx > 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => handleRestore(rev.id)}
                        disabled={restoreMutation.isPending}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        恢复到此版本
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
