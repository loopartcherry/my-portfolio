"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  TrendingUp,
  Download,
  Star,
  Eye,
  FileImage,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTemplateStats } from "@/hooks/use-templates";
import {
  adminMainNav,
  adminSystemNav,
  adminSettingsNav,
} from "@/lib/admin-nav";

export default function TemplateStatsPage() {
  const { data: statsData, isLoading } = useTemplateStats();
  const stats = statsData?.data;

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
                <h1 className="text-3xl font-bold text-white">模板统计</h1>
                <p className="text-white/60 mt-1">查看模板的整体数据和分析</p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full bg-[#12121a]" />
              ))}
            </div>
          ) : (
            <>
              {/* 关键指标 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-[#12121a] border-white/5 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">总模板数</span>
                    <FileImage className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.totalTemplates || 0}
                  </div>
                  <div className="text-xs text-white/40 mt-2">
                    已发布: {stats?.publishedTemplates || 0} | 草稿:{" "}
                    {stats?.draftTemplates || 0}
                  </div>
                </Card>

                <Card className="bg-[#12121a] border-white/5 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">总下载数</span>
                    <Download className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {(stats?.totalDownloads || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-white/40 mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    持续增长
                  </div>
                </Card>

                <Card className="bg-[#12121a] border-white/5 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">平均评分</span>
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {stats?.averageRating?.toFixed(1) || "0.0"}
                  </div>
                  <div className="text-xs text-white/40 mt-2">
                    基于所有评价
                  </div>
                </Card>

                <Card className="bg-[#12121a] border-white/5 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/60">总查看数</span>
                    <Eye className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {((stats?.totalDownloads || 0) * 3).toLocaleString()}
                  </div>
                  <div className="text-xs text-white/40 mt-2">
                    估算值（下载数 × 3）
                  </div>
                </Card>
              </div>

              {/* 分类分布 */}
              {stats?.downloadsByCategory && (
                <Card className="bg-[#12121a] border-white/5 p-6">
                  <h2 className="text-xl font-bold text-white mb-4">分类下载分布</h2>
                  <div className="space-y-3">
                    {Object.entries(stats.downloadsByCategory).map(([slug, count]: [string, any]) => (
                      <div key={slug} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/80 capitalize">{slug}</span>
                          <span className="text-white/60">{count.toLocaleString()} 次下载</span>
                        </div>
                        <div className="h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{
                              width: `${(count / (stats.totalDownloads || 1)) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* 热门模板 */}
              {stats?.popularTemplates && stats.popularTemplates.length > 0 && (
                <Card className="bg-[#12121a] border-white/5 p-6">
                  <h2 className="text-xl font-bold text-white mb-4">最受欢迎的模板 Top 10</h2>
                  <div className="space-y-3">
                    {stats.popularTemplates.map((template: any, index: number) => (
                      <div
                        key={template.id}
                        className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">
                              {template.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {template.categories?.slice(0, 2).map((cat: any) => (
                                <Badge
                                  key={cat.slug}
                                  variant="outline"
                                  className="text-xs border-white/10 text-white/60"
                                >
                                  {cat.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{template.rating.toFixed(1)}</span>
                          </div>
                          <div className="text-white/60">
                            {template.downloads.toLocaleString()} 下载
                          </div>
                          <div className="text-white/60">
                            {template.views.toLocaleString()} 查看
                          </div>
                        </div>
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
