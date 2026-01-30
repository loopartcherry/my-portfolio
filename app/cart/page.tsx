"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ShoppingCart, Heart, Trash2, Tag, ArrowLeft, ArrowRight, 
  Clock, AlertCircle, Plus, Minus, FileType, HardDrive, 
  Folder, Crown, Gift, Zap, ChevronDown, ChevronUp,
  CheckCircle, XCircle, Shield, Award, Users, Headphones,
  Eye, Receipt, Package
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock cart items
const initialCartItems = [
  {
    id: 1,
    name: "企业品牌 Logo 设计模版套装",
    type: "template",
    typeLabel: "模版",
    image: "/images/product-design-system.jpg",
    format: "AI, PSD, PNG",
    size: "126 MB",
    software: "Adobe Illustrator CC+",
    category: "品牌设计 / Logo 模版",
    tags: ["热销", "精品"],
    licenses: [
      { id: "personal", name: "个人授权", price: 99, desc: "仅限个人非商业使用" },
      { id: "commercial", name: "商业授权", price: 299, desc: "可用于商业项目" },
      { id: "enterprise", name: "企业授权", price: 599, desc: "企业团队使用，5个席位" },
    ],
    selectedLicense: "commercial",
    originalPrice: 399,
    quantity: 1,
    stock: 999,
    rating: 4.8,
    reviews: 523,
    status: "normal",
    hasDiscount: true,
    discountEndsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    name: "高端商务 PPT 模版合集",
    type: "bundle",
    typeLabel: "素材包",
    image: "/images/product-ppt.jpg",
    format: "PPTX, KEY",
    size: "850 MB",
    software: "PowerPoint / Keynote",
    category: "演示设计 / PPT 模版",
    tags: [],
    licenses: [
      { id: "commercial", name: "商业授权", price: 599, desc: "包含所有素材的商业使用权" },
    ],
    selectedLicense: "commercial",
    originalPrice: 999,
    quantity: 1,
    stock: 999,
    rating: 4.9,
    reviews: 312,
    status: "normal",
    bundleInfo: {
      count: 20,
      pages: 500,
      savings: 400,
    },
  },
  {
    id: 3,
    name: "品牌 VI 系统设计源文件",
    type: "source",
    typeLabel: "源文件",
    image: "/images/product-toolkit.jpg",
    format: "AI, EPS, PDF",
    size: "256 MB",
    software: "Adobe Illustrator CC+",
    category: "品牌设计 / VI 系统",
    tags: ["会员专享"],
    licenses: [
      { id: "vip", name: "会员价", price: 199, desc: "VIP免费商业授权" },
    ],
    selectedLicense: "vip",
    originalPrice: 499,
    quantity: 1,
    stock: 999,
    rating: 4.7,
    reviews: 186,
    status: "normal",
    isVipItem: true,
  },
  {
    id: 4,
    name: "新年主题海报设计模版",
    type: "template",
    typeLabel: "模版",
    image: "/images/product-course.jpg",
    format: "PSD, AI",
    size: "89 MB",
    software: "Photoshop CC+",
    category: "营销设计 / 海报模版",
    tags: ["限时秒杀"],
    licenses: [
      { id: "commercial", name: "商业授权", price: 49, desc: "限时特价" },
    ],
    selectedLicense: "commercial",
    originalPrice: 199,
    quantity: 1,
    stock: 144,
    rating: 4.6,
    reviews: 856,
    status: "flash_sale",
    flashSaleEndsAt: new Date(Date.now() + 2 * 60 * 60 * 1000 + 15 * 60 * 1000),
    soldCount: 856,
  },
  {
    id: 5,
    name: "圣诞节海报模版套装",
    type: "template",
    typeLabel: "模版",
    image: "/images/article-brand.jpg",
    format: "PSD",
    size: "45 MB",
    software: "Photoshop CC+",
    category: "营销设计 / 海报模版",
    tags: [],
    licenses: [],
    selectedLicense: "",
    originalPrice: 199,
    quantity: 1,
    stock: 0,
    rating: 4.5,
    reviews: 234,
    status: "unavailable",
    unavailableReason: "已下架",
  },
];

const coupons = [
  { id: 1, type: "fixed", value: 50, minOrder: 300, name: "满减券", expiry: "2024-02-15", applicable: "全场通用", isUsable: true },
  { id: 2, type: "percent", value: 10, minOrder: 0, name: "9折券", expiry: "7天后到期", applicable: "仅限设计模版类", isUsable: true },
  { id: 3, type: "fixed", value: 100, minOrder: 1000, name: "满减券", expiry: "2024-03-01", applicable: "全场通用", isUsable: false },
];

const recommendedProducts = [
  { id: 101, name: "极简风格名片模版", price: 49, image: "/images/product-ppt.jpg", rating: 4.8 },
  { id: 102, name: "科技感数据图表库", price: 199, image: "/images/product-toolkit.jpg", rating: 4.9 },
  { id: 103, name: "品牌宣传手册模版", price: 129, image: "/images/product-design-system.jpg", rating: 4.7 },
  { id: 104, name: "社交媒体素材包", price: 79, image: "/images/product-course.jpg", rating: 4.6 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [selectedItems, setSelectedItems] = useState<number[]>([1, 2, 3, 4]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<typeof coupons[0] | null>(null);
  const [showCoupons, setShowCoupons] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [showActivityBanner, setShowActivityBanner] = useState(true);
  const [countdown, setCountdown] = useState({ hours: 2, minutes: 15, seconds: 33 });

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const validItems = cartItems.filter(item => item.status !== "unavailable");
  const invalidItems = cartItems.filter(item => item.status === "unavailable");

  const selectAll = selectedItems.length === validItems.length;

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(validItems.map(item => item.id));
    }
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleQuantityChange = (id: number, delta: number) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, Math.min(item.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleLicenseChange = (id: number, licenseId: string) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        return { ...item, selectedLicense: licenseId };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
    setSelectedItems(selected => selected.filter(i => i !== id));
  };

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "vip50") {
      setAppliedCoupon(coupons[0]);
    } else {
      setAppliedCoupon(null);
    }
  };

  const getItemPrice = (item: typeof cartItems[0]) => {
    const license = item.licenses.find(l => l.id === item.selectedLicense);
    return license?.price || 0;
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id) && item.status !== "unavailable");
  
  const subtotal = selectedCartItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);
  const originalTotal = selectedCartItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
  const discountAmount = originalTotal - subtotal;
  const couponDiscount = appliedCoupon && subtotal >= appliedCoupon.minOrder ? appliedCoupon.value : 0;
  const pointsDiscount = usePoints ? 15 : 0;
  const total = Math.max(0, subtotal - couponDiscount - pointsDiscount);
  const totalSavings = discountAmount + couponDiscount + pointsDiscount;

  const typeColors: Record<string, string> = {
    template: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    bundle: "bg-green-500/20 text-green-400 border-green-500/30",
    source: "bg-accent/20 text-accent border-accent/30",
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <main className="pt-4 pb-32">
          <div className="max-w-2xl mx-auto px-6 py-32 text-center">
            <ShoppingCart className="w-20 h-20 text-white/20 mx-auto mb-6" />
            <h1 className="text-2xl font-light text-white/80 mb-3">购物车是空的</h1>
            <p className="text-white/40 mb-8">去模版商城看看有什么好东西</p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                浏览模版商城
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <main className="pt-4 pb-32">
        {/* Activity Banner */}
        {showActivityBanner && (
          <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border-b border-primary/20">
            <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm text-white/80">
                  限时活动：全场模版 8 折起，还剩 
                  <span className="font-mono text-primary ml-2">
                    {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/shop" className="text-xs text-primary hover:underline">立即抢购</Link>
                <button onClick={() => setShowActivityBanner(false)} className="text-white/40 hover:text-white/60">
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/60">首页</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white/60">模版商城</Link>
            <span>/</span>
            <span className="text-white/60">购物车</span>
          </nav>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <ShoppingCart className="w-7 h-7 text-primary" />
              <h1 className="text-2xl font-light text-white/90">购物车</h1>
              <span className="text-sm text-white/40">共 {cartItems.length} 件商品</span>
            </div>
            <Link href="/shop" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              继续购物
            </Link>
          </div>

          {/* Upsell Banner */}
          {subtotal > 0 && subtotal < 300 && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white/70">
                  再买 <span className="text-green-400 font-medium">¥{300 - subtotal}</span> 即可享受满减优惠 ¥50
                </span>
              </div>
              <Progress value={(subtotal / 300) * 100} className="w-32 h-1.5 bg-white/10" />
              <Link href="/shop" className="text-xs text-green-400 hover:underline">去凑单</Link>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Cart Items */}
            <div className="flex-1 lg:w-[68%]">
              {/* Batch Actions */}
              <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/5 mb-4">
                <div className="flex items-center gap-4">
                  <Checkbox 
                    checked={selectAll} 
                    onCheckedChange={handleSelectAll}
                    className="border-white/20"
                  />
                  <span className="text-sm text-white/60">全选</span>
                  {selectedItems.length > 0 && (
                    <span className="text-xs text-white/40">已选 {selectedItems.length} 件</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {selectedItems.length > 0 && (
                    <>
                      <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white/70 gap-1.5 h-8">
                        <Trash2 className="w-3.5 h-3.5" />
                        删除选中
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-white/50 hover:text-white/70 gap-1.5 h-8">
                        <Heart className="w-3.5 h-3.5" />
                        移至收藏
                      </Button>
                    </>
                  )}
                  {invalidItems.length > 0 && (
                    <button className="text-xs text-white/40 hover:text-white/60">清空失效商品</button>
                  )}
                </div>
              </div>

              {/* Cart Items List */}
              <div className="space-y-4">
                {validItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "relative p-5 rounded-xl border transition-all duration-300",
                      selectedItems.includes(item.id) 
                        ? "bg-white/[0.03] border-primary/30" 
                        : "bg-white/[0.02] border-white/5 hover:border-white/10",
                      item.status === "flash_sale" && "border-primary/50 bg-primary/5"
                    )}
                  >
                    {/* Flash Sale Banner */}
                    {item.status === "flash_sale" && (
                      <div className="absolute -top-px left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                    )}

                    <div className="flex gap-5">
                      {/* Checkbox */}
                      <div className="pt-1">
                        <Checkbox 
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                          className="border-white/20"
                        />
                      </div>

                      {/* Image */}
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 group">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <Badge className={cn("absolute top-2 left-2 text-[10px] border", typeColors[item.type])}>
                          {item.typeLabel}
                        </Badge>
                        {item.status === "flash_sale" && (
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-primary text-[10px] text-white rounded animate-pulse">
                            秒杀
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <Link href={`/shop/${item.id}`} className="text-base font-medium text-white/90 hover:text-primary transition-colors line-clamp-1">
                              {item.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              {item.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-[10px] border-primary/30 text-primary/80">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Price */}
                          <div className="text-right">
                            <div className="text-xs text-white/30 line-through">¥{item.originalPrice}</div>
                            <div className="text-xl font-medium text-primary">¥{getItemPrice(item)}</div>
                            {item.hasDiscount && (
                              <Badge className="mt-1 bg-primary/20 text-primary border-0 text-[10px]">
                                {Math.round((getItemPrice(item) / item.originalPrice) * 100) / 10}折
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Specs */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] text-white/40">
                          <span className="flex items-center gap-1"><FileType className="w-3 h-3" />{item.format}</span>
                          <span className="flex items-center gap-1"><HardDrive className="w-3 h-3" />{item.size}</span>
                          <span className="flex items-center gap-1"><Package className="w-3 h-3" />{item.software}</span>
                          <span className="flex items-center gap-1"><Folder className="w-3 h-3" />{item.category}</span>
                        </div>

                        {/* Bundle Info */}
                        {item.bundleInfo && (
                          <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                            <p className="text-xs text-green-400">
                              包含 {item.bundleInfo.count} 个模版，共 {item.bundleInfo.pages}+ 页面 · 比单买节省 ¥{item.bundleInfo.savings}
                            </p>
                          </div>
                        )}

                        {/* VIP Badge */}
                        {item.isVipItem && (
                          <div className="mt-3 p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs text-yellow-400">VIP 用户专享价 · 免费商业授权 · 节省 ¥{item.originalPrice - getItemPrice(item)}</span>
                          </div>
                        )}

                        {/* License & Quantity */}
                        <div className="flex items-end justify-between mt-4">
                          <div className="flex items-center gap-4">
                            {item.licenses.length > 1 && (
                              <div className="space-y-1">
                                <label className="text-[10px] text-white/30">选择授权</label>
                                <Select value={item.selectedLicense} onValueChange={(v) => handleLicenseChange(item.id, v)}>
                                  <SelectTrigger className="w-40 h-8 text-xs bg-white/5 border-white/10">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {item.licenses.map(license => (
                                      <SelectItem key={license.id} value={license.id} className="text-xs">
                                        <div className="flex items-center justify-between gap-4">
                                          <span>{license.name}</span>
                                          <span className="text-primary">¥{license.price}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {!item.bundleInfo && (
                              <div className="space-y-1">
                                <label className="text-[10px] text-white/30">数量</label>
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => handleQuantityChange(item.id, -1)}
                                    className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 transition-colors disabled:opacity-30"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center text-sm text-white/80">{item.quantity}</span>
                                  <button 
                                    onClick={() => handleQuantityChange(item.id, 1)}
                                    className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors disabled:opacity-30"
                                    disabled={item.quantity >= item.stock}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-3">
                            <button className="text-white/30 hover:text-white/50 transition-colors">
                              <Heart className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-white/30 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Details */}
                        <button 
                          onClick={() => setExpandedItems(prev => prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id])}
                          className="flex items-center gap-1 mt-3 text-[11px] text-white/30 hover:text-white/50 transition-colors"
                        >
                          查看商品详情
                          {expandedItems.includes(item.id) ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {expandedItems.includes(item.id) && (
                          <div className="mt-3 p-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs text-white/50">
                            <div className="flex items-center gap-4">
                              <span>评分：{item.rating} 星（{item.reviews} 评价）</span>
                              <span>库存：{item.stock > 100 ? "充足" : `仅剩 ${item.stock} 件`}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Invalid Items */}
                {invalidItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative p-5 rounded-xl bg-white/[0.01] border border-white/5 opacity-50"
                  >
                    <div className="flex gap-5">
                      <div className="pt-1">
                        <Checkbox disabled className="border-white/10" />
                      </div>
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 grayscale">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base text-white/40 line-through">{item.name}</span>
                          <Badge variant="outline" className="text-[10px] border-white/20 text-white/40">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            {item.unavailableReason}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-xs text-white/40 hover:text-red-400 transition-colors"
                          >
                            删除
                          </button>
                          <Link href="/shop" className="text-xs text-primary/60 hover:text-primary transition-colors">
                            查看相似商品
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recommended */}
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <Eye className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-medium text-white/70">看了又看</h3>
                  <span className="text-xs text-white/30">其他用户也购买了这些商品</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedProducts.map(product => (
                    <Link 
                      key={product.id} 
                      href={`/shop/${product.id}`}
                      className="group p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                        <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <h4 className="text-sm text-white/70 line-clamp-1 mb-1">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-primary font-medium">¥{product.price}</span>
                        <span className="text-[10px] text-white/30">{product.rating} 星</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:w-[32%]">
              <div className="sticky top-24 space-y-4">
                {/* Order Summary */}
                <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2 mb-6">
                    <Receipt className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-white/80">结算信息</h3>
                  </div>

                  {/* Coupon Input */}
                  <div className="mb-6">
                    <label className="flex items-center gap-1.5 text-xs text-white/40 mb-2">
                      <Tag className="w-3 h-3" />
                      优惠券 / 折扣码
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="输入优惠码"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 h-9 text-xs bg-white/5 border-white/10"
                      />
                      <Button onClick={handleApplyCoupon} size="sm" variant="outline" className="h-9 text-xs border-white/10 hover:bg-white/5 bg-transparent">
                        使用
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        已应用优惠券 -¥{appliedCoupon.value}
                      </div>
                    )}
                  </div>

                  {/* Available Coupons */}
                  <button 
                    onClick={() => setShowCoupons(!showCoupons)}
                    className="flex items-center justify-between w-full text-xs text-white/50 hover:text-white/70 mb-4"
                  >
                    <span>{coupons.filter(c => c.isUsable).length} 张可用优惠券</span>
                    {showCoupons ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                  {showCoupons && (
                    <div className="space-y-2 mb-6">
                      {coupons.map(coupon => (
                        <div 
                          key={coupon.id}
                          className={cn(
                            "p-3 rounded-lg border flex items-center justify-between",
                            coupon.isUsable ? "bg-primary/5 border-primary/20" : "bg-white/[0.02] border-white/5 opacity-50"
                          )}
                        >
                          <div>
                            <div className="text-lg font-medium text-primary">
                              {coupon.type === "fixed" ? `¥${coupon.value}` : `${100 - coupon.value}折`}
                            </div>
                            <div className="text-[10px] text-white/40">
                              {coupon.minOrder > 0 ? `满¥${coupon.minOrder}可用` : coupon.applicable}
                            </div>
                          </div>
                          {coupon.isUsable ? (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 text-[10px] text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => setAppliedCoupon(coupon)}
                            >
                              使用
                            </Button>
                          ) : (
                            <span className="text-[10px] text-red-400">金额未达到</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="h-px bg-white/5 my-4" />

                  {/* Price Breakdown */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-white/50">
                      <span>商品总价</span>
                      <span>¥{originalTotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>限时折扣</span>
                        <span>-¥{discountAmount}</span>
                      </div>
                    )}
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>优惠券</span>
                        <span>-¥{couponDiscount}</span>
                      </div>
                    )}
                    
                    {/* Points */}
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-white/50">
                        <Checkbox 
                          checked={usePoints} 
                          onCheckedChange={(c) => setUsePoints(!!c)}
                          className="border-white/20 w-3.5 h-3.5"
                        />
                        <span className="text-xs">使用积分抵扣（1,500 积分）</span>
                      </label>
                      {usePoints && <span className="text-xs text-green-400">-¥15</span>}
                    </div>

                    <div className="flex justify-between text-white/30 text-xs">
                      <span>运费</span>
                      <span>数字商品，无需物流</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/10 my-4" />

                  {/* Total */}
                  <div className="flex items-end justify-between mb-2">
                    <span className="text-base font-medium text-white/80">应付总额</span>
                    <span className="text-3xl font-bold text-primary">¥{total}</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="text-right text-xs text-green-400 mb-4">
                      已节省 ¥{totalSavings}
                    </div>
                  )}

                  <p className="text-[10px] text-white/30 mb-4">含税价，无需额外支付</p>

                  {/* Checkout Button */}
                  <Link href="/checkout">
                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-medium gap-2"
                      disabled={selectedItems.length === 0}
                    >
                      去结算（{selectedItems.length}）
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* Benefits */}
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-300/80">
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3" />极速下载</span>
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3" />永久使用</span>
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3" />免费更新</span>
                    <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3" />技术支持</span>
                  </div>
                </div>

                {/* Security */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-[10px] text-white/40">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" />加密传输</span>
                    <span className="flex items-center gap-1"><Award className="w-3 h-3" />正版授权</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />50,000+ 用户</span>
                  </div>
                </div>

                {/* Support */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Headphones className="w-5 h-5 text-white/40" />
                    <div>
                      <p className="text-xs text-white/60">购买咨询</p>
                      <p className="text-[10px] text-white/30">平均响应时间：30秒</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] border-white/10 hover:bg-white/5 bg-transparent">
                    联系客服
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

