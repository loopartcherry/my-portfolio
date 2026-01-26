"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, CreditCard, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button
              asChild
              variant="ghost"
              className="mb-6 text-muted-foreground hover:text-foreground"
            >
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Link>
            </Button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-light">退款政策</h1>
                <p className="text-muted-foreground mt-1">Refund Policy</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              最后更新：2026年1月23日
            </p>
          </div>

          {/* Content */}
          <div className="bg-card/40 border border-border/40 rounded-2xl p-8 md:p-10 backdrop-blur-sm space-y-8">
            {/* 重要提示 */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-medium text-foreground mb-2">重要提示</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    数字商品（设计模板、组件库等）一经下载，除非存在重大质量问题，否则不支持退款。请在下单前仔细确认商品信息。
                  </p>
                </div>
              </div>
            </div>

            {/* 1. 适用范围 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                1. 适用范围
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  本退款政策适用于 LoopArt Studio（以下简称"我们"、"本平台"）提供的所有付费服务，包括但不限于：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>定制设计服务（品牌设计、UI设计、数据可视化等）</li>
                  <li>订阅制设计服务（按月/年订阅）</li>
                  <li>数字商品（设计模板、组件库、工具包等）</li>
                  <li>咨询服务（VCMA诊断、设计咨询等）</li>
                </ul>
              </div>
            </section>

            {/* 2. 定制设计服务退款 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                2. 定制设计服务退款
              </h2>
              <div className="text-muted-foreground space-y-4 leading-relaxed">
                <div>
                  <p className="mb-2">
                    <strong className="text-foreground">2.1 服务开始前</strong>
                  </p>
                  <p>
                    在设计师开始工作之前，您可以申请全额退款。退款将在3-5个工作日内原路退回。
                  </p>
                </div>
                <div>
                  <p className="mb-2">
                    <strong className="text-foreground">2.2 服务进行中</strong>
                  </p>
                  <p>
                    如果服务已经开始，我们将根据已完成的工作量计算退款金额：
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>完成度 ≤ 30%：退还70%的费用</li>
                    <li>完成度 30%-60%：退还40%的费用</li>
                    <li>完成度 {'>'} 60%：不支持退款</li>
                  </ul>
                </div>
                <div>
                  <p className="mb-2">
                    <strong className="text-foreground">2.3 服务完成后</strong>
                  </p>
                  <p>
                    服务交付后，如存在以下情况可申请退款：
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li>设计作品存在重大质量问题，无法正常使用</li>
                    <li>交付内容与合同约定严重不符</li>
                    <li>在约定的修改次数内，我们无法满足合理的设计要求</li>
                  </ul>
                  <p className="mt-3">
                    退款申请需在交付后7天内提出，并提供充分的证明材料。
                  </p>
                </div>
              </div>
            </section>

            {/* 3. 订阅服务退款 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                3. 订阅服务退款
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  <strong className="text-foreground">3.1 月度订阅</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>订阅后7天内：可申请全额退款</li>
                  <li>订阅后7-30天：按剩余天数比例退款</li>
                  <li>订阅超过30天：不支持退款，但可随时取消，不会自动续费</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-foreground">3.2 年度订阅</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>订阅后30天内：可申请全额退款</li>
                  <li>订阅后30-90天：按剩余天数比例退款，扣除已使用服务费用</li>
                  <li>订阅超过90天：不支持退款，但可随时取消，不会自动续费</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-foreground">3.3 升级/降级</strong>
                </p>
                <p>
                  订阅升级或降级时，我们将按比例计算差价。如果降级导致需要退款，退款金额将在下个计费周期返还。
                </p>
              </div>
            </section>

            {/* 4. 数字商品退款 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-primary" />
                4. 数字商品退款
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <p className="font-medium text-foreground mb-2">重要：数字商品一经下载，不支持退款</p>
                  <p className="text-sm">
                    由于数字商品的特殊性，一旦下载即视为交付完成。除非存在以下情况，否则不支持退款：
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                  <li>商品文件损坏或无法正常打开</li>
                  <li>商品内容与描述严重不符</li>
                  <li>商品存在版权问题</li>
                  <li>在下载前发现商品不符合需求（需在购买后24小时内，且未下载）</li>
                </ul>
                <p className="mt-4">
                  退款申请需提供充分的证明材料，我们将在3-5个工作日内审核并处理。
                </p>
              </div>
            </section>

            {/* 5. 退款流程 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                5. 退款流程
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <ol className="list-decimal list-inside space-y-3 ml-4">
                  <li>
                    <strong className="text-foreground">提交申请：</strong>
                    通过订单页面或联系客服提交退款申请，说明退款原因
                  </li>
                  <li>
                    <strong className="text-foreground">审核处理：</strong>
                    我们将在1-3个工作日内审核您的申请，必要时会与您沟通
                  </li>
                  <li>
                    <strong className="text-foreground">退款处理：</strong>
                    审核通过后，退款将在3-5个工作日内原路退回您的支付账户
                  </li>
                  <li>
                    <strong className="text-foreground">到账时间：</strong>
                    具体到账时间取决于支付平台，通常为1-7个工作日
                  </li>
                </ol>
              </div>
            </section>

            {/* 6. 特殊情况 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                6. 特殊情况
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  <strong className="text-foreground">6.1 重复扣款</strong>
                  <br />
                  如因系统问题导致重复扣款，我们将立即退还重复扣款金额。
                </p>
                <p>
                  <strong className="text-foreground">6.2 服务中断</strong>
                  <br />
                  如因我们的原因导致服务长时间中断（超过48小时），我们将按中断时间比例退款或延长服务期限。
                </p>
                <p>
                  <strong className="text-foreground">6.3 不可抗力</strong>
                  <br />
                  因不可抗力（如自然灾害、战争、政府行为等）导致无法提供服务，我们将与您协商解决方案。
                </p>
              </div>
            </section>

            {/* 7. 不适用退款的情况 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-primary" />
                7. 不适用退款的情况
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>以下情况不支持退款：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>数字商品已下载（除非存在质量问题）</li>
                  <li>定制服务已完成交付且无质量问题</li>
                  <li>因客户原因导致项目无法继续（如客户取消项目、无法提供必要材料等）</li>
                  <li>超过退款申请期限</li>
                  <li>因违反服务条款而被终止服务</li>
                </ul>
              </div>
            </section>

            {/* 8. 联系我们 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                8. 联系我们
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  如需申请退款或有任何疑问，请通过以下方式联系我们：
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li>邮箱：<a href="mailto:hello@loopart.studio" className="text-primary hover:underline">hello@loopart.studio</a></li>
                  <li>地址：北京 · 上海 · 远程</li>
                </ul>
                <p className="mt-4">
                  我们承诺在收到您的退款申请后，尽快处理并给予明确回复。
                </p>
              </div>
            </section>

            {/* Footer note */}
            <div className="pt-6 border-t border-border/50 mt-8">
              <p className="text-xs text-muted-foreground text-center">
                本退款政策的最终解释权归 LoopArt Studio 所有
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
