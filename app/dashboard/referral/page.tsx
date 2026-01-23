"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Gift,
  DollarSign,
  Users,
  Wallet,
  Award,
  TrendingUp,
  Copy,
  Download,
  Share2,
  QrCode,
  CheckCircle,
  UserPlus,
  Activity,
  BarChart3,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";

const mockStats = {
  totalEarnings: 128500,
  monthlyEarnings: 25000,
  referralCount: 86,
  monthlyNew: 12,
  pendingAmount: 18500,
  ranking: 8,
};

const mockActivities = [
  {
    id: 1,
    time: "2024-01-18 15:30",
    type: "register",
    icon: UserPlus,
    iconColor: "text-green-400",
    content: "张三 通过您的推广链接注册",
    status: "待转化",
    statusColor: "text-blue-400",
  },
  {
    id: 2,
    time: "2024-01-18 14:20",
    type: "purchase",
    icon: DollarSign,
    iconColor: "text-yellow-400",
    content: "李四 购买了系统提升套餐",
    orderAmount: 198000,
    commission: 29700,
    status: "已到账",
    statusColor: "text-green-400",
  },
  {
    id: 3,
    time: "2024-01-17 16:45",
    type: "diagnosis",
    icon: Activity,
    iconColor: "text-blue-400",
    content: "王五 完成了 VCMA 诊断",
    score: "42 分",
    level: "Level 2",
    status: "待跟进",
    statusColor: "text-orange-400",
  },
];

export default function ReferralPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const referralLink = "https://vcma.com/ref/ABC123";
  const referralCode = "ABC123";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-lg font-light tracking-wider">
            <span className="text-primary">VCMA</span>
            <span className="text-white/40"> 控制台</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-1">
            <div className="text-xs text-white/40 mb-2 px-4">主要功能</div>
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              );
            })}

            <div className="my-4 border-t border-white/5" />

            <div className="text-xs text-white/40 mb-2 px-4">其他</div>
            {otherNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/dashboard/referral";
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
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">推荐返佣</h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/dashboard/notifications" className="relative p-2 text-white/40 hover:text-white/80 transition-colors">
              <Bell className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 w-full">
          {/* Page Description */}
          <p className="text-sm text-white/60 mb-6">推荐好友使用 VCMA，获取丰厚返佣</p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-[#12121a] border-white/5 mb-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                返佣概览
              </TabsTrigger>
              <TabsTrigger value="tools" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                推广工具
              </TabsTrigger>
              <TabsTrigger value="records" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                推荐记录
              </TabsTrigger>
              <TabsTrigger value="earnings" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                收益明细
              </TabsTrigger>
              <TabsTrigger value="withdraw" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                提现记录
              </TabsTrigger>
              <TabsTrigger value="rules" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                返佣规则
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6 bg-[#12121a] border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs">本月 +¥25,000</span>
                    </div>
                  </div>
                  <p className="text-white/40 text-xs mb-1">累计收益</p>
                  <p className="text-3xl font-bold text-white mb-2">¥{mockStats.totalEarnings.toLocaleString()}</p>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: "85%" }} />
                  </div>
                  <Button className="mt-4 w-full bg-primary text-white" size="sm">
                    立即提现
                  </Button>
                </Card>

                <Card className="p-6 bg-[#12121a] border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-green-400 text-xs">+12</div>
                  </div>
                  <p className="text-white/40 text-xs mb-1">推荐人数</p>
                  <p className="text-3xl font-bold text-white mb-2">{mockStats.referralCount} 人</p>
                  <div className="text-xs text-white/60 space-y-1">
                    <div>已注册：{mockStats.referralCount} 人</div>
                    <div>已成交：35 人</div>
                    <div>转化率：40.7%</div>
                  </div>
                </Card>

                <Card className="p-6 bg-[#12121a] border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-orange-400" />
                    </div>
                  </div>
                  <p className="text-white/40 text-xs mb-1">待提现金额</p>
                  <p className="text-3xl font-bold text-white mb-2">¥{mockStats.pendingAmount.toLocaleString()}</p>
                  <p className="text-xs text-white/60 mb-3">满 ¥1,000 可提现</p>
                  <Progress value={1850} className="mb-3" />
                  <Button className="w-full bg-orange-500 text-white" size="sm">
                    提现
                  </Button>
                </Card>

                <Card className="p-6 bg-[#12121a] border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-white/40 text-xs mb-1">推广排名</p>
                  <p className="text-3xl font-bold text-white mb-2">第 {mockStats.ranking} 名</p>
                  <p className="text-xs text-white/60">本月推广排行</p>
                  <p className="text-xs text-primary mt-2">超越 92% 用户</p>
                </Card>
              </div>

              {/* Earnings Trend Chart */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">收益趋势分析</h2>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                      近 7 天
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                      近 30 天
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                      近 90 天
                    </Button>
                    <Button variant="outline" size="sm" className="border-white/10 text-white/60">
                      全部
                    </Button>
                  </div>
                </div>
                <div className="h-64 flex items-center justify-center text-white/40">
                  <BarChart3 className="w-16 h-16" />
                  <span className="ml-2">收益趋势图表</span>
                </div>
              </Card>

              {/* Recent Activities */}
              <Card className="p-6 bg-[#12121a] border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">最新推荐动态</h2>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </div>
                <div className="space-y-4">
                  {mockActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg hover:bg-white/5 transition-colors"
                      >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-white/5", activity.iconColor)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-white/60">{activity.time}</span>
                            <Badge className={cn("text-xs", activity.statusColor.includes("green") ? "bg-green-500/20 text-green-400" : activity.statusColor.includes("orange") ? "bg-orange-500/20 text-orange-400" : "bg-blue-500/20 text-blue-400")}>
                              {activity.status}
                            </Badge>
                          </div>
                          <p className="text-white mb-2">{activity.content}</p>
                          {activity.orderAmount && (
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-white/60">订单金额：¥{activity.orderAmount.toLocaleString()}</span>
                              <span className="text-green-400 font-semibold">
                                返佣：+¥{activity.commission?.toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="text-white/60">
                          查看详情
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">我的专属推广链接</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-white/80 mb-2 block">完整链接</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={referralLink}
                        readOnly
                        className="bg-[#0a0a0f] border-white/5 text-white font-mono"
                      />
                      <Button
                        size="sm"
                        className="bg-primary text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(referralLink);
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block">短链接</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={`vcma.com/r/${referralCode}`}
                        readOnly
                        className="bg-[#0a0a0f] border-white/5 text-white font-mono"
                      />
                      <Button
                        size="sm"
                        className="bg-primary text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(`vcma.com/r/${referralCode}`);
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block">推广码</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={referralCode}
                        readOnly
                        className="bg-[#0a0a0f] border-white/5 text-white font-mono text-lg font-bold"
                      />
                      <Button
                        size="sm"
                        className="bg-primary text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(referralCode);
                        }}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制
                      </Button>
                    </div>
                    <p className="text-xs text-white/40 mt-1">好友注册时输入此推广码</p>
                  </div>

                  <div>
                    <Label className="text-white/80 mb-2 block">二维码</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-gray-800" />
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="border-white/10 text-white/60">
                          <Download className="w-4 h-4 mr-2" />
                          下载二维码
                        </Button>
                        <p className="text-xs text-white/40">微信扫一扫，立即注册</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="records">
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">推荐记录</h2>
                <p className="text-white/60">推荐记录列表...</p>
              </Card>
            </TabsContent>

            <TabsContent value="earnings">
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">收益明细</h2>
                <p className="text-white/60">收益明细列表...</p>
              </Card>
            </TabsContent>

            <TabsContent value="withdraw">
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">提现记录</h2>
                <p className="text-white/60">提现记录列表...</p>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card className="p-6 bg-[#12121a] border-white/5">
                <h2 className="text-lg font-semibold text-white mb-4">返佣规则</h2>
                <div className="prose prose-invert max-w-none text-white/80">
                  <h3 className="text-white">返佣比例</h3>
                  <p>推荐返佣比例为订单金额的 15%，最高返佣金额为 ¥XX</p>
                  <h3 className="text-white mt-6">提现规则</h3>
                  <p>满 ¥1,000 可申请提现，提现将在 3-5 个工作日内到账</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
