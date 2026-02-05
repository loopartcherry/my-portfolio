"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, Mail, AlertCircle } from "lucide-react";
import { Footer } from "@/components/sections/footer";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-light">隐私政策</h1>
                <p className="text-muted-foreground mt-1">Privacy Policy</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              最后更新：2026年1月23日
            </p>
          </div>

          {/* Content */}
          <div className="bg-card/40 border border-border/40 rounded-2xl p-8 md:p-10 backdrop-blur-sm space-y-8">
            {/* 1. 引言 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                1. 引言
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  LoopArt Studio（以下简称"我们"、"本平台"）重视您的隐私保护。本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。
                </p>
                <p>
                  使用本平台服务即表示您同意本隐私政策的条款。如果您不同意本政策，请不要使用我们的服务。
                </p>
              </div>
            </section>

            {/* 2. 信息收集 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                2. 我们收集的信息
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  <strong className="text-foreground">2.1 您主动提供的信息</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>账户信息：姓名、邮箱、手机号码、密码等</li>
                  <li>项目信息：项目需求、公司信息、行业类型等</li>
                  <li>支付信息：支付方式、发票信息等（支付信息由第三方支付平台处理，我们不存储完整支付信息）</li>
                  <li>通信记录：您与我们之间的邮件、站内消息等</li>
                </ul>
                <p className="mt-4">
                  <strong className="text-foreground">2.2 自动收集的信息</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>设备信息：IP地址、浏览器类型、操作系统等</li>
                  <li>使用数据：访问时间、页面浏览、功能使用情况等</li>
                  <li>Cookie和类似技术：用于改善用户体验和提供个性化服务</li>
                </ul>
              </div>
            </section>

            {/* 3. 信息使用 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                3. 信息使用目的
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>我们使用收集的信息用于以下目的：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>提供、维护和改进我们的服务</li>
                  <li>处理您的订单、支付和交付服务</li>
                  <li>与您沟通，包括发送服务通知、更新和营销信息（您可随时退订）</li>
                  <li>分析使用情况，优化用户体验</li>
                  <li>检测、预防和解决技术问题或安全问题</li>
                  <li>遵守法律法规要求</li>
                </ul>
              </div>
            </section>

            {/* 4. 信息共享 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                4. 信息共享与披露
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  我们不会出售您的个人信息。我们仅在以下情况下共享您的信息：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-foreground">服务提供商：</strong>
                    与帮助我们运营服务的第三方（如支付处理、云存储、分析服务）共享必要信息
                  </li>
                  <li>
                    <strong className="text-foreground">法律要求：</strong>
                    当法律、法规或政府要求时
                  </li>
                  <li>
                    <strong className="text-foreground">业务转让：</strong>
                    在合并、收购或资产出售的情况下，您的信息可能被转移
                  </li>
                  <li>
                    <strong className="text-foreground">经您同意：</strong>
                    在您明确同意的情况下
                  </li>
                </ul>
              </div>
            </section>

            {/* 5. 数据安全 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                5. 数据安全
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  我们采用行业标准的安全措施保护您的个人信息，包括：
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>使用加密技术传输和存储敏感信息</li>
                  <li>定期进行安全审计和漏洞扫描</li>
                  <li>限制员工访问个人信息的权限</li>
                  <li>使用安全的服务器和数据库</li>
                </ul>
                <p className="mt-4">
                  尽管我们采取了合理的安全措施，但请注意，互联网传输和电子存储都不是100%安全的。我们无法保证信息的绝对安全。
                </p>
              </div>
            </section>

            {/* 6. 您的权利 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                6. 您的权利
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>根据适用的数据保护法律，您享有以下权利：</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong className="text-foreground">访问权：</strong>
                    您可以请求访问我们持有的您的个人信息
                  </li>
                  <li>
                    <strong className="text-foreground">更正权：</strong>
                    您可以更正不准确的个人信息
                  </li>
                  <li>
                    <strong className="text-foreground">删除权：</strong>
                    您可以请求删除您的个人信息（受法律限制）
                  </li>
                  <li>
                    <strong className="text-foreground">撤回同意：</strong>
                    您可以撤回之前给予的同意
                  </li>
                  <li>
                    <strong className="text-foreground">数据可携权：</strong>
                    您可以请求以结构化、常用格式获取您的数据
                  </li>
                </ul>
                <p className="mt-4">
                  如需行使上述权利，请通过 <a href="mailto:loopart.cherry@gmail.com" className="text-primary hover:underline">loopart.cherry@gmail.com</a> 联系我们。
                </p>
              </div>
            </section>

            {/* 7. Cookie */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                7. Cookie 和跟踪技术
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  我们使用 Cookie 和类似技术来改善用户体验、分析使用情况并提供个性化服务。您可以通过浏览器设置管理 Cookie 偏好，但这可能影响某些功能的正常使用。
                </p>
              </div>
            </section>

            {/* 8. 儿童隐私 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                8. 儿童隐私
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  我们的服务面向企业用户，不面向18岁以下的儿童。如果我们发现收集了儿童的个人信息，我们将立即删除。
                </p>
              </div>
            </section>

            {/* 9. 政策更新 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                9. 政策更新
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  我们可能不时更新本隐私政策。重大变更将在本页面显著位置通知，或通过邮件通知您。继续使用服务即表示您接受更新后的政策。
                </p>
              </div>
            </section>

            {/* 10. 联系我们 */}
            <section>
              <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                10. 联系我们
              </h2>
              <div className="text-muted-foreground space-y-3 leading-relaxed">
                <p>
                  如您对本隐私政策有任何疑问或需要行使您的权利，请通过以下方式联系我们：
                </p>
                <ul className="list-none space-y-2 ml-4">
                  <li>公司名称：北京环形数维科技有限公司</li>
                  <li>邮箱：<a href="mailto:loopart.cherry@gmail.com" className="text-primary hover:underline">loopart.cherry@gmail.com</a></li>
                  <li>地址：北京 · 杭州 · 远程</li>
                </ul>
              </div>
            </section>

            {/* Footer note */}
            <div className="pt-6 border-t border-border/50 mt-8">
              <p className="text-xs text-muted-foreground text-center">
                本隐私政策的最终解释权归 LoopArt Studio 所有
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
