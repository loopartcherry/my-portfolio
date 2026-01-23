"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  FileText,
  Eye,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentStats } from "@/hooks/use-contents";
import { adminMainNav } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

export default function ContentStatsPage() {
  const { data, isLoading } = useContentStats();
  const stats = data?.data;

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
                {item.badge && (
                  <span
                    className={cn(
                      "ml-auto px-2 py-0.5 text-[10px] rounded",
                      item.badgeColor === "primary" && "bg-primary/20 text-primary"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
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
                <h1 className="text-3xl font-bold text-white">内容统计</h1>
                <p className="text-white/60 mt-1">浏览与发布概览</p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 bg-[#12121a]" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#12121a] border-white/5 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">总文章</span>
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats?.totalArticles ?? 0}</div>
                  <div className="text-xs text-white/40 mt-1">已发布：{stats?.publishedArticles ?? 0}</div>
                </Card>
                <Card className="bg-[#12121a] border-white/5 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">总浏览</span>
                    <Eye className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {(stats?.totalViews ?? 0) >= 1000
                      ? `${((stats?.totalViews ?? 0) / 1000).toFixed(1)}K`
                      : stats?.totalViews ?? 0}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    平均浏览：{stats?.publishedArticles ? Math.round((stats?.totalViews ?? 0) / stats.publishedArticles) : 0}
                  </div>
                </Card>
                <Card className="bg-[#12121a] border-white/5 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">草稿</span>
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stats?.draftArticles ?? 0}</div>
                </Card>
                <Card className="bg-[#12121a] border-white/5 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">分类数</span>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.articlesByCategory ? Object.keys(stats.articlesByCategory).length : 0}
                  </div>
                </Card>
              </div>

              {stats?.articlesByCategory && Object.keys(stats.articlesByCategory).length > 0 && (
                <Card className="bg-[#12121a] border-white/5 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">分类分布</h2>
                  <div className="space-y-3">
                    {Object.entries(stats.articlesByCategory).map(([slug, count]: [string, any]) => (
                      <div key={slug} className="flex items-center justify-between">
                        <span className="text-white/80 capitalize">{slug}</span>
                        <span className="text-white/50">{count} 篇</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {stats?.mostViewed && stats.mostViewed.length > 0 && (
                <Card className="bg-[#12121a] border-white/5 p-6">
                  <h2 className="text-lg font-bold text-white mb-4">最受欢迎 Top 10</h2>
                  <div className="space-y-3">
                    {stats.mostViewed.map((item: any, idx: number) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-medium text-white">{item.title}</p>
                            <p className="text-xs text-white/50">
                              {item.category?.name ?? "-"} · {item.type === "article" ? "文章" : item.type === "case_study" ? "案例" : item.type === "faq" ? "FAQ" : "页面"}
                            </p>
                          </div>
                        </div>
                        <span className="text-white/60">
                          {(item.views ?? 0) >= 1000 ? `${(item.views / 1000).toFixed(1)}K` : item.views} 浏览
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
