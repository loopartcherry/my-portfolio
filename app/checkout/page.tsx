"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  FileText,
  CreditCard,
  Tag,
  Lock,
  ArrowLeft,
  Clock,
  Info,
  CheckCircle,
  Copy,
  Headphones,
  Building,
  Shield,
  Mail,
  ChevronDown,
  ChevronUp,
  X,
  Smartphone,
} from "lucide-react";
import Header from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";

// Mock data
const cartItems = [
  {
    id: 1,
    name: "ToB品牌视觉系统模版",
    image: "/images/product-design-system.jpg",
    price: 299,
    originalPrice: 399,
    license: "商业授权",
    quantity: 1,
  },
  {
    id: 2,
    name: "融资BP高端定制模版",
    image: "/images/product-ppt.jpg",
    price: 499,
    originalPrice: 699,
    license: "商业授权",
    quantity: 1,
  },
  {
    id: 3,
    name: "数据可视化图表库",
    image: "/images/product-toolkit.jpg",
    price: 199,
    originalPrice: 299,
    license: "个人授权",
    quantity: 2,
  },
];

const paymentMethods = [
  {
    id: "alipay",
    name: "支付宝",
    icon: "💳",
    description: "推荐使用，安全快捷",
    recommended: true,
    discount: 5,
  },
  {
    id: "wechat",
    name: "微信支付",
    icon: "💚",
    description: "支持微信扫码支付",
    recommended: false,
  },
  {
    id: "card",
    name: "银行卡支付",
    icon: "💳",
    description: "支持各大银行卡",
    recommended: false,
  },
  {
    id: "bank",
    name: "对公转账",
    icon: "🏢",
    description: "企业用户专享，发票自动开具",
    recommended: false,
    note: "需要1-3个工作日确认",
  },
  {
    id: "balance",
    name: "账户余额",
    icon: "👛",
    description: "当前余额：¥1,250",
    recommended: false,
    balance: 1250,
  },
];

const discounts = [
  { id: 1, name: "新人专享券", amount: 50, type: "coupon", canRemove: true },
  { id: 2, name: "VIP会员折扣", amount: 300, type: "vip", canRemove: false },
  { id: 3, name: "模版商城8折活动", amount: 200, type: "promo", canRemove: false, countdown: 3600 },
];

export default function CheckoutPage() {
  const [email, setEmail] = useState("user@example.com");
  const [phone, setPhone] = useState("138****5678");
  const [realName, setRealName] = useState("");
  const [invoiceType, setInvoiceType] = useState("none");
  const [invoiceCategory, setInvoiceCategory] = useState("normal");
  const [companyName, setCompanyName] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [invoiceContent, setInvoiceContent] = useState("digital");
  const [paymentMethod, setPaymentMethod] = useState("alipay");
  const [agreements, setAgreements] = useState({
    purchase: false,
    license: false,
    refund: false,
  });
  const [orderCountdown, setOrderCountdown] = useState(1800);
  const [showAllItems, setShowAllItems] = useState(false);
  const [appliedDiscounts, setAppliedDiscounts] = useState(discounts);
  const [usePoints, setUsePoints] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setOrderCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountTotal = appliedDiscounts.reduce((sum, d) => sum + d.amount, 0);
  const pointsDiscount = usePoints ? 15 : 0;
  const paymentDiscount = paymentMethod === "alipay" ? 5 : 0;
  const totalDiscount = discountTotal + pointsDiscount + paymentDiscount;
  const finalTotal = subtotal - totalDiscount;

  const removeDiscount = (id: number) => {
    setAppliedDiscounts(appliedDiscounts.filter((d) => d.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const allAgreed = agreements.purchase && agreements.license && agreements.refund;

  const handleSubmit = async () => {
    if (!allAgreed) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // 这里保留模拟，实际可以跳转到支付成功页或第三方支付
    setIsSubmitting(false);
  };

  const steps = [
    { id: 1, name: "商品确认", completed: true },
    { id: 2, name: "购物车", completed: true },
    { id: 3, name: "确认结算", current: true },
    { id: 4, name: "支付完成", completed: false },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main className="pt-24 pb-32">
        <div className="max-w-[1400px] mx-auto px-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono transition-all ${
                      step.completed
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : step.current
                          ? "bg-primary/20 text-primary border-2 border-primary scale-110"
                          : "bg-white/5 text-white/30 border border-white/10"
                    }`}
                  >
                    {step.completed ? <CheckCircle className="w-5 h-5" /> : step.id}
                  </div>
                  <span
                    className={`mt-2 text-xs font-mono ${
                      step.current ? "text-primary" : step.completed ? "text-white/60" : "text-white/30"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 md:w-24 h-px mx-2 ${
                      steps[index + 1].completed || steps[index + 1].current
                        ? "bg-primary/50"
                        : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Order Countdown */}
          <div className="flex items-center justify-center gap-2 mb-8 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-white/60">订单有效期：</span>
            <span className="font-mono text-primary">{formatTime(orderCountdown)}</span>
            <span className="text-white/40">内完成支付</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Info Cards */}
            <div className="lg:col-span-3 space-y-6">
              {/* Account Info */}
              <div className="bg-[#12121a] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">账户信息</h3>
                    <p className="text-xs text-white/40">用于接收订单通知和下载链接</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white/60 text-sm">接收邮箱 *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                    <p className="text-[10px] text-white/30">订单确认、下载链接将发送到此邮箱</p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white/60 text-sm">手机号 *</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        placeholder="138xxxx5678"
                      />
                    </div>
                    <p className="text-[10px] text-white/30">用于接收订单短信通知</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-white/60 text-sm">真实姓名（可选）</Label>
                    <Input
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="用于开具发票"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="bg-[#12121a] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">发票信息</h3>
                    <p className="text-xs text-white/40">可选择不开发票，购买后可补开</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Invoice Type Selection */}
                  <div className="space-y-3">
                    {[
                      { id: "none", label: "不开发票", desc: "购买后可在订单详情中补开" },
                      { id: "personal", label: "个人发票", desc: "电子发票，发送至邮箱" },
                      { id: "company", label: "企业发票", desc: "支持普票/专票" },
                    ].map((type) => (
                      <label
                        key={type.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                          invoiceType === type.id
                            ? "border-primary/50 bg-primary/5"
                            : "border-white/10 hover:border-white/20"
                        }`}
                      >
                        <input
                          type="radio"
                          name="invoiceType"
                          value={type.id}
                          checked={invoiceType === type.id}
                          onChange={(e) => setInvoiceType(e.target.value)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            invoiceType === type.id ? "border-primary" : "border-white/30"
                          }`}
                        >
                          {invoiceType === type.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <div className="flex-1">
                          <span className="text-white/90">{type.label}</span>
                          <p className="text-xs text-white/40">{type.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Company Invoice Form */}
                  {invoiceType === "company" && (
                    <div className="mt-4 p-4 bg-white/5 rounded-lg space-y-4">
                      <div className="flex gap-4">
                        {[
                          { id: "normal", label: "增值税普通发票" },
                          { id: "special", label: "增值税专用发票" },
                        ].map((cat) => (
                          <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="invoiceCategory"
                              value={cat.id}
                              checked={invoiceCategory === cat.id}
                              onChange={(e) => setInvoiceCategory(e.target.value)}
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                invoiceCategory === cat.id ? "border-primary" : "border-white/30"
                              }`}
                            >
                              {invoiceCategory === cat.id && (
                                <div className="w-2 h-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <span className="text-sm text-white/70">{cat.label}</span>
                          </label>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-white/60 text-sm">企业名称 *</Label>
                          <Input
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="请输入企业全称"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white/60 text-sm">纳税人识别号 *</Label>
                          <Input
                            value={taxNumber}
                            onChange={(e) => setTaxNumber(e.target.value)}
                            className="bg-white/5 border-white/10 text-white"
                            placeholder="统一社会信用代码"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-white/60 text-sm">发票内容</Label>
                          <Select value={invoiceContent} onValueChange={setInvoiceContent}>
                            <SelectTrigger className="bg-white/5 border-white/10 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="digital">数字商品</SelectItem>
                              <SelectItem value="service">信息技术服务</SelectItem>
                              <SelectItem value="design">设计服务</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Invoice Info */}
                  <div className="flex items-start gap-2 p-3 bg-primary/5 rounded-lg">
                    <Info className="w-4 h-4 text-primary mt-0.5" />
                    <div className="text-xs text-white/50 space-y-1">
                      <p>电子发票将在付款后24小时内发送到您的邮箱</p>
                      <p>发票金额为实际支付金额</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-[#12121a] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">选择支付方式</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-primary/50 bg-primary/5"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === method.id ? "border-primary" : "border-white/30"
                        }`}
                      >
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white/90 font-medium">{method.name}</span>
                          {method.recommended && (
                            <Badge className="bg-primary/20 text-primary text-[10px]">推荐</Badge>
                          )}
                          {method.discount && (
                            <Badge className="bg-red-500/20 text-red-400 text-[10px]">立减¥{method.discount}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/40">{method.description}</p>
                        {method.note && <p className="text-xs text-yellow-500/70 mt-1">{method.note}</p>}
                      </div>
                    </label>
                  ))}

                  {/* Bank Transfer Details */}
                  {paymentMethod === "bank" && (
                    <div className="ml-9 p-4 bg-white/5 rounded-lg space-y-3">
                      <p className="text-sm text-white/60">收款账户信息：</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-white/40">户名</span>
                          <span className="text-white/80">XX科技有限公司</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/40">开户行</span>
                          <span className="text-white/80">招商银行北京分行</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/40">账号</span>
                          <div className="flex items-center gap-2">
                            <span className="text-white/80 font-mono">6226 0000 0000 0000</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-primary"
                              onClick={() => copyToClipboard("6226000000000000")}
                            >
                              {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-yellow-500/70">
                        请在备注中填写订单号：#ORD202401150001
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Discounts */}
              <div className="bg-[#12121a] border border-white/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                </div>

                <div className="space-y-3">
                  {appliedDiscounts.map((discount) => (
                    <div
                      key={discount.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            discount.type === "coupon"
                              ? "bg-green-500"
                              : discount.type === "vip"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                        />
                        <span className="text-white/80 text-sm">{discount.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-mono ${
                            discount.type === "coupon"
                              ? "text-green-400"
                              : discount.type === "vip"
                                ? "text-yellow-400"
                                : "text-red-400"
                          }`}
                        >
                          -¥{discount.amount}
                        </span>
                        {discount.canRemove && (
                          <button
                            onClick={() => removeDiscount(discount.id)}
                            className="text-white/30 hover:text-white/60"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Points */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={usePoints}
                        onCheckedChange={(checked) => setUsePoints(!!checked)}
                      />
                      <span className="text-white/80 text-sm">使用1,500积分抵扣</span>
                    </label>
                    <span className="font-mono text-primary">-¥15</span>
                  </div>
                </div>
              </div>

              {/* Agreements */}
              <div className="bg-[#12121a] border border-white/5 rounded-xl p-6">
                <div className="space-y-3">
                  {[
                    { key: "purchase", label: "用户购买协议", link: "#" },
                    { key: "license", label: "数字商品授权协议", link: "#" },
                    { key: "refund", label: "退款政策", link: "#" },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={agreements[item.key as keyof typeof agreements]}
                        onCheckedChange={(checked) =>
                          setAgreements((prev) => ({ ...prev, [item.key]: !!checked }))
                        }
                      />
                      <span className="text-white/60 text-sm">
                        我已阅读并同意
                        <a href={item.link} className="text-primary hover:underline ml-1">
                          《{item.label}》
                        </a>
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-white/30 mt-4">
                  数字商品一经下载不支持退款，请确认后购买
                </p>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {/* Order Summary Card */}
                <div className="bg-[#12121a] border border-white/5 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-white mb-4">订单摘要</h3>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {(showAllItems ? cartItems : cartItems.slice(0, 2)).map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/80 truncate">{item.name}</p>
                          <p className="text-xs text-white/40">{item.license} × {item.quantity}</p>
                        </div>
                        <span className="text-sm font-mono text-white/80">¥{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {cartItems.length > 2 && (
                    <button
                      onClick={() => setShowAllItems(!showAllItems)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline mb-4"
                    >
                      {showAllItems ? "收起" : `查看全部 ${cartItems.length} 件商品`}
                      {showAllItems ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}

                  <Separator className="bg-white/10 my-4" />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">商品总价</span>
                      <span className="text-white/80">¥{subtotal}</span>
                    </div>
                    {appliedDiscounts.map((d) => (
                      <div key={d.id} className="flex justify-between">
                        <span className="text-white/50">{d.name}</span>
                        <span className={d.type === "vip" ? "text-yellow-400" : "text-green-400"}>
                          -¥{d.amount}
                        </span>
                      </div>
                    ))}
                    {usePoints && (
                      <div className="flex justify-between">
                        <span className="text-white/50">积分抵扣</span>
                        <span className="text-primary">-¥{pointsDiscount}</span>
                      </div>
                    )}
                    {paymentDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/50">支付优惠</span>
                        <span className="text-red-400">-¥{paymentDiscount}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-400">优惠合计</span>
                      <span className="text-green-400 font-medium">-¥{totalDiscount}</span>
                    </div>
                  </div>

                  <Separator className="bg-white/10 my-4" />

                  {/* Final Total */}
                  <div className="flex justify-between items-end">
                    <span className="text-white/80 font-medium">实付金额</span>
                    <div className="text-right">
                      <span className="text-3xl font-bold text-primary">¥{finalTotal}</span>
                      <p className="text-xs text-green-400 mt-1">已节省 ¥{totalDiscount}</p>
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="mt-4 pt-4 border-t border-white/5 space-y-1 text-xs text-white/40">
                    <div className="flex justify-between">
                      <span>订单编号</span>
                      <span className="font-mono text-white/60">#ORD202401150001</span>
                    </div>
                    <div className="flex justify-between">
                      <span>下单时间</span>
                      <span>2024-01-15 14:30</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="w-full mt-6 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    onClick={handleSubmit}
                    disabled={!allAgreed || isSubmitting}
                  >
                    {isSubmitting ? (
                      "提交中..."
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        提交订单
                      </>
                    )}
                  </Button>

                  {!allAgreed && (
                    <p className="text-xs text-red-400 text-center mt-2">请先同意用户协议</p>
                  )}

                  <Link href="/cart">
                    <Button variant="outline" className="w-full mt-3 border-white/10 text-white/60 bg-transparent hover:bg-white/5">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      返回购物车
                    </Button>
                  </Link>
                </div>

                {/* Security Badges */}
                <div className="bg-[#12121a] border border-white/5 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {[
                      { icon: Shield, text: "正版授权保障" },
                      { icon: CheckCircle, text: "永久免费更新" },
                      { icon: Lock, text: "SSL加密传输" },
                      { icon: Headphones, text: "客服支持" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/50">
                        <item.icon className="w-4 h-4 text-primary/60" />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Service */}
                <div className="bg-[#12121a] border border-white/5 rounded-xl p-4 flex items-center gap-3">
                  <Headphones className="w-5 h-5 text-white/40" />
                  <div className="flex-1">
                    <p className="text-sm text-white/60">支付遇到问题？</p>
                    <p className="text-xs text-white/30">平均响应 {"<"} 1分钟</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-white/10 text-white/60 bg-transparent hover:bg-white/5">
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

