"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FileText,
  Search,
  Filter,
  Download,
  Calendar,
  Phone,
  Mail,
  Building,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  adminMainNav,
  adminSystemNav,
  adminSettingsNav,
} from "@/lib/admin-nav";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function AdminDiagnosesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-diagnoses", statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", page.toString());
      params.set("limit", "20");

      const res = await fetch(`/api/admin/diagnoses?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("获取诊断记录失败");
      return res.json();
    },
  });

  const diagnoses = data?.data || [];
  const pagination = data?.pagination || { total: 0, totalPages: 1 };

  const filteredDiagnoses = diagnoses.filter((d: any) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        d.contactName?.toLowerCase().includes(query) ||
        d.contactEmail?.toLowerCase().includes(query) ||
        d.contactPhone?.toLowerCase().includes(query) ||
        d.user?.email?.toLowerCase().includes(query) ||
        d.user?.name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getLevelColor = (level: number) => {
    if (level === 1) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (level === 2) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (level === 3) return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    return "bg-green-500/20 text-green-400 border-green-500/30";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
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
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            {adminMainNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/admin/diagnoses";
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                    isActive
                      ? "text-white bg-white/10"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60">
        <div className="p-6 max-w-[1400px] mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-white">VCMA 诊断记录</h1>
                <FileText className="w-6 h-6 text-white/40" />
              </div>
            </div>
            <p className="text-sm text-white/60">
              共 {pagination.total} 条诊断记录
            </p>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6 bg-[#12121a] border-white/5">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  placeholder="搜索姓名、邮箱、手机号..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-[#0a0a0f] border-white/5 text-white placeholder:text-white/30"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-[#0a0a0f] border-white/5 text-white">
                  <SelectValue placeholder="筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="with_consultation">有预约</SelectItem>
                  <SelectItem value="no_consultation">无预约</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Card className="bg-[#12121a] border-white/5">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5">
                    <TableHead className="text-white/60">诊断ID</TableHead>
                    <TableHead className="text-white/60">用户信息</TableHead>
                    <TableHead className="text-white/60">企业信息</TableHead>
                    <TableHead className="text-white/60">得分/等级</TableHead>
                    <TableHead className="text-white/60">联系方式</TableHead>
                    <TableHead className="text-white/60">预约状态</TableHead>
                    <TableHead className="text-white/60">诊断时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiagnoses.map((diagnosis: any) => (
                    <TableRow key={diagnosis.id} className="border-white/5 hover:bg-white/5">
                      <TableCell>
                        <span className="font-mono text-xs text-white/60">
                          {diagnosis.id.slice(0, 8)}...
                        </span>
                      </TableCell>
                      <TableCell>
                        {diagnosis.user ? (
                          <div>
                            <div className="text-white">{diagnosis.user.name || "未设置"}</div>
                            <div className="text-xs text-white/40">{diagnosis.user.email}</div>
                          </div>
                        ) : (
                          <span className="text-white/40">未登录用户</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {diagnosis.companyInfo ? (
                          <div>
                            <div className="text-white">
                              {(diagnosis.companyInfo as any).name || "未填写"}
                            </div>
                            <div className="text-xs text-white/40">
                              {(diagnosis.companyInfo as any).industry || ""}
                            </div>
                          </div>
                        ) : (
                          <span className="text-white/40">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{diagnosis.totalScore}</span>
                          <Badge className={cn("text-xs", getLevelColor(diagnosis.level))}>
                            L{diagnosis.level} {diagnosis.levelName}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {diagnosis.contactName && (
                            <div className="text-sm text-white">{diagnosis.contactName}</div>
                          )}
                          {diagnosis.contactEmail && (
                            <div className="text-xs text-white/40 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {diagnosis.contactEmail}
                            </div>
                          )}
                          {diagnosis.contactPhone && (
                            <div className="text-xs text-white/40 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {diagnosis.contactPhone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {diagnosis.consultationCount > 0 ? (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            {diagnosis.consultationCount} 个预约
                          </Badge>
                        ) : (
                          <Badge className="bg-white/10 text-white/40 border-white/20">
                            无预约
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-white/60">
                          {new Date(diagnosis.createdAt).toLocaleDateString("zh-CN")}
                        </div>
                        <div className="text-xs text-white/40">
                          {new Date(diagnosis.createdAt).toLocaleTimeString("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-white/5">
                  <div className="text-sm text-white/60">
                    第 {page} / {pagination.totalPages} 页
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="border-white/10"
                    >
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="border-white/10"
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
