"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Home, FolderKanban, CreditCard, Headphones, FileText, Users, Settings,
  BookOpen, Gift, MessageCircle, ClipboardCheck, ShoppingBag,
  X, Download, ExternalLink, Copy, Check, ChevronDown, Search,
  Package, Clock, CheckCircle, AlertCircle, RefreshCw, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-2024-0120",
    date: "2024-01-20 14:32",
    status: "completed",
    statusText: "已完成",
    type: "product",
    items: [
      { 
        id: 1, 
        name: "ToB融资BP模板 · 全能版", 
        price: 499, 
        quantity: 1, 
        image: "/images/product-ppt.jpg",
        downloadUrl: "/downloads/bp-template.zip",
        license: "单用户授权"
      },
      { 
        id: 2, 
        name: "数据可视化图表库", 
        price: 299, 
        quantity: 1, 
        image: "/images/product-design-system.jpg",
        downloadUrl: "/downloads/chart-library.zip",
        license: "单用户授权"
      },
    ],
    subtotal: 798,
    discount: 79.8,
    coupon: 50,
    total: 668.2,
    payment: "支付宝",
    invoice: { type: "企业", title: "北京XX科技有限公司", taxId: "91110000XXXXXXXX" },
  },
  {
    id: "ORD-2024-0115",
    date: "2024-01-15 10:15",
    status: "completed",
    statusText: "已完成",
    type: "subscription",
    items: [
      { 
        id: 3, 
        name: "Professional 年度订阅", 
        price: 19800, 
        quantity: 1, 
        image: null,
        period: "2024-01-15 至 2025-01-14",
        license: "团队授权（5人）"
      },
    ],
    subtotal: 19800,
    discount: 0,
    coupon: 0,
    total: 19800,
    payment: "对公转账",
    invoice: { type: "企业", title: "北京XX科技有限公司", taxId: "91110000XXXXXXXX" },
  },
  {
    id: "ORD-2024-0110",
    date: "2024-01-10 09:20",
    status: "pending",
    statusText: "待支付",
    type: "service",
    items: [
      { 
        id: 4, 
        name: "VCMA系统级方案定金", 
        price: 5000, 
        quantity: 1, 
        image: null,
        note: "定金，尾款 ¥23,800"
      },
    ],
    subtotal: 5000,
    discount: 0,
    coupon: 0,
    total: 5000,
    payment: "待支付",
    invoice: null,
    expireTime: "2024-01-10 21:20",
  },
  {
    id: "ORD-2023-1225",
    date: "2023-12-25 16:45",
    status: "refunded",
    statusText: "已退款",
    type: "product",
    items: [
      { 
        id: 5, 
        name: "品牌设计规范模板", 
        price: 399, 
        quantity: 1, 
        image: "/images/product-toolkit.jpg",
        license: "单用户授权"
      },
    ],
    subtotal: 399,
    discount: 0,
    coupon: 0,
    total: 399,
    refundAmount: 399,
    refundDate: "2023-12-27",
    payment: "微信支付",
    invoice: null,
  },
];

const statusFilters = [
  { key: "all", label: "全部订单" },
  { key: "pending", label: "待支付" },
  { key: "completed", label: "已完成" },
  { key: "refunded", label: "已退款" },
];

const Loading = () => null;

export default function OrdersPage() {
  const [showSupport, setShowSupport] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const searchParams = useSearchParams();

  const filteredOrders = mockOrders.filter(order => {
    if (activeFilter !== "all" && order.status !== activeFilter) return false;
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "pending": return <Clock className="w-4 h-4 text-orange-400" />;
      case "refunded": return <RefreshCw className="w-4 h-4 text-white/40" />;
      default: return <Package className="w-4 h-4 text-white/40" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500/10 text-green-400";
      case "pending": return "bg-orange-500/10 text-orange-400";
      case "refunded": return "bg-white/5 text-white/40";
      default: return "bg-white/5 text-white/40";
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
        {/* Left Sidebar */}
        <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="text-lg font-light tracking-wider">
              <span className="text-primary">SPIRAL</span>
              <span className="text-white/40">.VISION</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === "/dashboard/orders";
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
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      "px-2 py-0.5 text-[10px] font-medium rounded-full",
                      item.badgeColor === "primary" ? "bg-primary/20 text-primary" : "bg-orange-500/20 text-orange-400"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="my-4 border-t border-white/5" />

            {otherNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button
              onMouseEnter={() => setShowSupport(true)}
              onMouseLeave={() => setShowSupport(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{showSupport ? "在线客服 24/7" : "联系客服"}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full md:ml-60">
          <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <h1 className="text-base md:text-lg font-light text-white/90 truncate">我的订单</h1>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link href="/dashboard/notifications" className="relative p-2 text-white/40 hover:text-white/80 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
                张
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6 md:p-8 w-full">
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
              <div className="flex items-center gap-2 flex-wrap">
                {statusFilters.map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setActiveFilter(filter.key)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm transition-all",
                      activeFilter === filter.key
                        ? "bg-primary/10 text-primary"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  placeholder="搜索订单号..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-white/5 border-white/10 text-white/80 placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl md:rounded-2xl bg-[#12121a] border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => copyOrderId(order.id)}
                        className="flex items-center gap-2 text-sm font-mono text-white/60 hover:text-white transition-colors"
                      >
                        {order.id}
                        {copiedId === order.id ? (
                          <Check className="w-3 h-3 text-green-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <span className="text-xs text-white/30">{order.date}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1 text-xs rounded-full flex items-center gap-1.5",
                        getStatusColor(order.status)
                      )}>
                        {getStatusIcon(order.status)}
                        {order.statusText}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          {item.image ? (
                            <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                              <Package className="w-6 h-6 text-white/40" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/80 mb-1">{item.name}</p>
                            <p className="text-xs text-white/40">
                              {"license" in item && item.license}
                              {"period" in item && item.period && ` · ${item.period}`}
                              {"note" in item && item.note && ` · ${item.note}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-white/80">¥{item.price.toLocaleString()}</p>
                            <p className="text-xs text-white/30">x{item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-3 sm:py-4 border-t border-white/5 bg-white/[0.02]">
                    <div className="text-sm text-white/40">
                      支付方式：{order.payment}
                      {order.status === "refunded" && (
                        <span className="ml-4">退款金额：¥{order.refundAmount} ({order.refundDate})</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-white/50">
                        实付：<span className="text-lg text-primary font-light">¥{order.total.toLocaleString()}</span>
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                      >
                        查看详情
                      </Button>
                      {order.status === "pending" && (
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                          立即支付
                        </Button>
                      )}
                      {order.status === "paid" && (order as any).type === "template" && (order as any).templateId && (
                        <Button
                          size="sm"
                          className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-0"
                          asChild
                        >
                          <a href={`/api/templates/${(order as any).templateId}/download`} target="_blank">
                            <Download className="w-4 h-4" />
                            下载模板
                          </a>
                        </Button>
                      )}
                      {order.status === "completed" && order.type === "product" && (
                        <Button size="sm" className="gap-2 bg-primary/10 hover:bg-primary/20 text-primary border-0">
                          <Download className="w-4 h-4" />
                          下载全部
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="text-center py-20">
                  <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 mb-4">暂无订单记录</p>
                  <Link href="/shop">
                    <Button variant="outline" className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5">
                      去商城看看
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-auto bg-[#12121a] border border-white/10 rounded-xl md:rounded-2xl m-4">
              {/* Modal Header */}
              <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/5 bg-[#12121a]">
                <div>
                  <h3 className="text-xl font-light text-white/90">订单详情</h3>
                  <p className="text-xs text-white/40 font-mono mt-1">{selectedOrder.id}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(selectedOrder.status)}
                    <span className="text-sm text-white/80">{selectedOrder.statusText}</span>
                  </div>
                  <span className="text-xs text-white/40">{selectedOrder.date}</span>
                </div>

                {/* Items */}
                <div>
                  <h4 className="text-sm text-white/50 mb-4">商品信息</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                        {item.image ? (
                          <div className="w-20 h-20 rounded-lg bg-white/5 overflow-hidden shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                            <Package className="w-8 h-8 text-white/40" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-white/80 mb-2">{item.name}</p>
                          <p className="text-xs text-white/40 mb-3">
                            {"license" in item && item.license}
                            {"period" in item && item.period && <span className="block mt-1">有效期：{item.period}</span>}
                          </p>
                          {selectedOrder.status === "completed" && "downloadUrl" in item && item.downloadUrl && (
                            <a
                              href={item.downloadUrl}
                              className="inline-flex items-center gap-2 text-xs text-primary hover:underline"
                            >
                              <Download className="w-3 h-3" />
                              下载文件
                            </a>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white/80">¥{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Detail */}
                <div>
                  <h4 className="text-sm text-white/50 mb-4">价格明细</h4>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">商品小计</span>
                      <span className="text-white/80">¥{selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">会员折扣</span>
                        <span className="text-primary">-¥{selectedOrder.discount.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedOrder.coupon > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/50">优惠券</span>
                        <span className="text-primary">-¥{selectedOrder.coupon.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-sm text-white/50">实付金额</span>
                      <span className="text-xl text-primary font-light">¥{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment & Invoice */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs text-white/40 mb-2">支付方式</h4>
                    <p className="text-sm text-white/80">{selectedOrder.payment}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <h4 className="text-xs text-white/40 mb-2">发票信息</h4>
                    {selectedOrder.invoice ? (
                      <div>
                        <p className="text-sm text-white/80">{selectedOrder.invoice.title}</p>
                        <p className="text-sm text-white/40">{selectedOrder.invoice.taxId}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-white/50">未开票</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-white/5 bg-[#12121a]">
                {selectedOrder.status === "completed" && (
                  <>
                    <Button variant="outline" className="gap-2 bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5">
                      申请退款
                    </Button>
                    <Button variant="outline" className="gap-2 bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5">
                      <Download className="w-4 h-4" />
                      下载发票
                    </Button>
                  </>
                )}
                {selectedOrder.status === "pending" && (
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    立即支付
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                  className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                >
                  关闭
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
