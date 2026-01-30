"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Shield, Users, CreditCard, AlertCircle } from "lucide-react";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-4 pb-20 px-6">
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
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-light">服务条款</h1>
                <p className="text-muted-foreground mt-1">Terms of Service</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              最后更新：2026年1月23日
            </p>
          </div>

          {/* Content */}
          <div className="bg-card/40 border border-border/40 rounded-2xl p-8 md:p-10 backdrop-blur-sm space-y-8">
            {/* 1. 接受条款 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                1. 接受条款
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  欢迎使用 LoopArt Studio（以下简称"我们"、"本平台"）提供的可视化设计服务。通过访问或使用本平台，您表示同意遵守本服务条款的所有规定。
                </p>
                <p>
                  如果您不同意本条款的任何部分，请不要使用我们的服务。我们保留随时修改本条款的权利，修改后的条款将在本页面公布后立即生效。
                </p>
              </div>
            </section>

            {/* 2. 服务描述 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                2. 服务描述
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>LoopArt Studio 提供以下服务：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>品牌可视化设计服务（Logo、VI系统、官网设计等）</li>
                  <li>技术可视化设计服务（架构图、技术文档设计等）</li>
                  <li>产品可视化设计服务（UI/UX设计、产品界面设计等）</li>
                  <li>数据可视化设计服务（数据大屏、图表设计等）</li>
                  <li>数字商品销售（设计模板、组件库等）</li>
                  <li>订阅制设计服务（按月/年订阅，无限设计请求）</li>
                </ul>
              </div>
            </section>

            {/* 3. 用户账户 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                3. 用户账户
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  为使用本平台的某些功能，您需要注册账户。您同意：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>提供真实、准确、完整的注册信息</li>
                  <li>维护并及时更新您的账户信息</li>
                  <li>对您账户下的所有活动负责</li>
                  <li>立即通知我们任何未经授权的账户使用行为</li>
                  <li>不得将账户转让给他人或与他人共享</li>
                </ul>
              </div>
            </section>

            {/* 4. 服务使用规则 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                4. 服务使用规则
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>在使用本平台服务时，您同意：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>遵守所有适用的法律法规</li>
                  <li>不得使用服务从事任何非法活动</li>
                  <li>不得干扰或破坏服务的正常运行</li>
                  <li>不得尝试未经授权访问任何系统、网络或数据</li>
                  <li>不得上传、发布或传播任何违法、有害、威胁、辱骂、骚扰、诽谤、粗俗、淫秽或其他令人反感的内容</li>
                  <li>不得侵犯他人的知识产权或其他合法权益</li>
                </ul>
              </div>
            </section>

            {/* 5. 知识产权 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                5. 知识产权
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  <strong className="text-foreground">5.1 平台内容</strong>
                  <br />
                  本平台的所有内容，包括但不限于文字、图形、标识、图标、图像、音频、视频、软件等，均受知识产权法保护，归 LoopArt Studio 或其许可方所有。
                </p>
                <p>
                  <strong className="text-foreground">5.2 设计作品</strong>
                  <br />
                  对于定制设计服务，在您支付全部费用后，设计作品的知识产权将根据双方签署的具体协议转移给您。对于订阅服务，设计作品的知识产权归属将在服务协议中明确约定。
                </p>
                <p>
                  <strong className="text-foreground">5.3 数字商品</strong>
                  <br />
                  数字商品（模板、组件库等）的授权范围将在购买时明确说明。未经授权，不得复制、分发、修改或用于商业用途。
                </p>
              </div>
            </section>

            {/* 6. 付款与退款 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                6. 付款与退款
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  <strong className="text-foreground">6.1 付款</strong>
                  <br />
                  您同意按照我们公布的收费标准支付服务费用。所有费用均以人民币（CNY）计价。我们接受支付宝、微信支付、银行卡支付及对公转账等支付方式。
                </p>
                <p>
                  <strong className="text-foreground">6.2 退款政策</strong>
                  <br />
                  退款政策详见我们的<Link href="/refund" className="text-primary hover:underline">《退款政策》</Link>。数字商品一经下载，除非存在重大质量问题，否则不支持退款。
                </p>
                <p>
                  <strong className="text-foreground">6.3 订阅服务</strong>
                  <br />
                  订阅服务按周期收费，您可以在任何时候取消订阅。取消后，您将继续享有已付费周期的服务，但不会自动续费。
                </p>
              </div>
            </section>

            {/* 7. 服务变更与终止 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                7. 服务变更与终止
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  我们保留随时修改、暂停或终止服务的权利，无需提前通知。如果我们终止您的账户或服务，我们将根据本条款和适用法律处理您的数据和已付费服务。
                </p>
              </div>
            </section>

            {/* 8. 免责声明 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                8. 免责声明
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  在法律允许的最大范围内，本平台按"现状"提供，不提供任何明示或暗示的保证。我们不保证服务将不间断、及时、安全或无错误。
                </p>
                <p>
                  对于因使用或无法使用本服务而造成的任何直接、间接、偶然、特殊或后果性损害，我们不承担责任。
                </p>
              </div>
            </section>

            {/* 9. 联系我们 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                9. 联系我们
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  如您对本服务条款有任何疑问，请通过以下方式联系我们：
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li>邮箱：<a href="mailto:hello@loopart.studio" className="text-primary hover:underline">hello@loopart.studio</a></li>
                  <li>地址：北京 · 上海 · 远程</li>
                </ul>
              </div>
            </section>

            {/* Footer note */}
            <div className="pt-6 border-t border-border/50 mt-8">
              <p className="text-xs text-muted-foreground text-center">
                本服务条款的最终解释权归 LoopArt Studio 所有
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
