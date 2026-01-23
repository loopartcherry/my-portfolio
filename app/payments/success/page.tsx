"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Order {
  id: string;
  amount: number;
  type: string;
  status: string;
  templateId?: string;
  template?: {
    name: string;
  };
  paidAt?: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("order_id");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push("/dashboard/orders");
      return;
    }

    // 获取订单信息
    fetch(`/api/orders/${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/60">加载中...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/60">订单不存在</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full bg-[#12121a] border-white/10 p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">支付成功！</h1>
          <p className="text-white/60">您的订单已成功支付</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/60">订单号</span>
            <span className="text-white font-mono">{order.id}</span>
          </div>
          {order.template && (
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-white/60">商品名称</span>
              <span className="text-white">{order.template.name}</span>
            </div>
          )}
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/60">支付金额</span>
            <span className="text-white text-xl font-bold">¥{order.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-white/60">支付时间</span>
            <span className="text-white">
              {order.paidAt
                ? new Date(order.paidAt).toLocaleString("zh-CN")
                : "刚刚"}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          {order.type === "template" && order.status === "paid" && (
            <Button
              asChild
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <Link href={`/api/templates/${order.templateId}/download`}>
                <Download className="w-4 h-4 mr-2" />
                立即下载
              </Link>
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            className="flex-1 border-white/10"
          >
            <Link href="/dashboard/orders">
              查看订单
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-white/10"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white/60">加载中...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
