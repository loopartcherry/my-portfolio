"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, ChevronLeft, ChevronRight, ShoppingCart, Download,
  CheckCircle2, Loader2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/sections/footer";
import { useQuery } from "@tanstack/react-query";
import { useCreateTemplateOrder, useCreatePaymentSession } from "@/hooks/use-orders";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  const [currentImage, setCurrentImage] = useState(0);

  const { data: templateData, isLoading } = useQuery({
    queryKey: ['template', templateId],
    queryFn: async () => {
      const res = await fetch(`/api/templates/${templateId}`);
      if (!res.ok) throw new Error('获取模板失败');
      const data = await res.json();
      return data.data;
    },
  });

  const createOrder = useCreateTemplateOrder();
  const createPayment = useCreatePaymentSession();

  const handlePurchase = async () => {
    try {
      // 创建订单
      const orderData = await createOrder.mutateAsync(templateId);
      
      // 创建支付会话
      const paymentData = await createPayment.mutateAsync({
        orderId: orderData.orderId,
        paymentMethod: 'alipay',
      });

      // 跳转到支付页面
      window.location.href = paymentData.paymentUrl;
    } catch (e: any) {
      toast.error(e.message || '购买失败');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-4 pb-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!templateData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-4 pb-32 flex items-center justify-center">
          <p className="text-muted-foreground">模板不存在</p>
        </div>
        <Footer />
      </div>
    );
  }

  const template = templateData;
  const finalPrice = template.finalPrice || template.price;
  const previews = template.preview || [];

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-4 pb-32">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 lg:px-20 py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground transition-colors">
              模板商城
            </Link>
            <span>/</span>
            <span className="text-foreground">{template.name}</span>
          </nav>
        </div>

        <div className="px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Preview Images */}
            <div>
              {previews.length > 0 ? (
                <>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-4">
                    <Image
                      src={previews[currentImage]}
                      alt={template.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {previews.length > 1 && (
                    <div className="flex gap-2">
                      {previews.map((url: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImage(i)}
                          className={cn(
                            "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                            currentImage === i
                              ? "border-primary"
                              : "border-transparent opacity-60 hover:opacity-100"
                          )}
                        >
                          <Image src={url} alt={`预览 ${i + 1}`} fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] rounded-xl bg-muted flex items-center justify-center">
                  <p className="text-muted-foreground">暂无预览图</p>
                </div>
              )}
            </div>

            {/* Right: Template Info */}
            <div>
              <h1 className="text-3xl font-bold mb-4">{template.name}</h1>
              
              {template.description && (
                <p className="text-muted-foreground mb-6">{template.description}</p>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{template.rating.toFixed(1)}</span>
                </div>
                <span className="text-muted-foreground">
                  {template._count?.downloadRecords || 0} 次下载
                </span>
                <span className="text-muted-foreground">
                  {template.views} 次浏览
                </span>
              </div>

              {/* Categories */}
              {template.categories && template.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {template.categories.map((cat: any) => (
                    <span
                      key={cat.id}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold">¥{finalPrice.toFixed(2)}</span>
                  {template.discount && (
                    <span className="text-xl text-muted-foreground line-through">
                      ¥{template.price.toFixed(2)}
                    </span>
                  )}
                </div>
                {template.discount && (
                  <p className="text-sm text-muted-foreground mt-1">
                    限时折扣 {(1 - template.discount) * 100}% OFF
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={handlePurchase}
                  disabled={createOrder.isPending || createPayment.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  size="lg"
                >
                  {createOrder.isPending || createPayment.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      立即购买
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  加入购物车
                </Button>
              </div>

              {/* Author */}
              {template.author && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    设计师：<span className="text-foreground">{template.author}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
