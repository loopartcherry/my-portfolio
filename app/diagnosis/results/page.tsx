"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Download,
  Share2,
  Save,
  Building,
  Trophy,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { ConsultationDialog } from "@/components/diagnosis/consultation-dialog";
import { Loader2 } from "lucide-react";

// Mock data（后续可以接真实诊断结果）
const mockResults = {
  totalScore: 42,
  maxScore: 64,
  level: 2,
  levelName: "初建期",
  percentile: 62,
  companyInfo: {
    name: "XX 科技有限公司",
    industry: "AI/算法",
    stage: "成长期（B-C轮）",
  },
  dimensions: [
    {
      id: "v1",
      name: "品牌可视化",
      nameEn: "Brand Visual",
      score: 8,
      maxScore: 16,
      level: 1,
      levelName: "缺失期",
      industryAvg: 11.2,
      rank: "后35%",
      isWeakest: true,
      questions: [
        { id: "q1", score: 1, maxScore: 4, answer: "A", label: "看起来像小作坊" },
        { id: "q2", score: 2, maxScore: 4, answer: "B", label: "有Logo和基础颜色" },
        { id: "q3", score: 2, maxScore: 4, answer: "B", label: "差不多" },
        { id: "q4", score: 1, maxScore: 4, answer: "A", label: "经常发生", isRisk: true },
      ],
      impacts: [
        "融资BP被投资人质疑专业度，影响融资成功率",
        "客户首次接触印象差，信任建立成本增加40%",
        "品牌溢价能力低，难以支撑高客单价",
      ],
      estimatedLoss: "50-80万/年",
      suggestions: [
        { priority: "紧急", title: "建立基础VI系统", desc: "Logo+颜色+字体", budget: "5-8万", roi: "200%+" },
        { priority: "中期", title: "升级融资BP", desc: "30页专业设计", budget: "3-5万", roi: "300%+" },
      ],
    },
    {
      id: "v2",
      name: "技术可视化",
      nameEn: "Tech Visual",
      score: 13,
      maxScore: 16,
      level: 3,
      levelName: "成熟期",
      industryAvg: 10.5,
      rank: "前20%",
      isStrongest: true,
      questions: [
        { id: "q5", score: 3, maxScore: 4, answer: "C", label: "专业演示材料" },
        { id: "q6", score: 3, maxScore: 4, answer: "C", label: "基本能理解" },
        { id: "q7", score: 4, maxScore: 4, answer: "D", label: "行业标杆水平", isStrength: true },
        { id: "q8", score: 3, maxScore: 4, answer: "C", label: "大部分可复用" },
      ],
      impacts: [
        "技术方案演示专业，成单周期缩短25%",
        "客户理解成本低，售前效率高",
      ],
      isPositive: true,
      suggestions: [
        { priority: "优化", title: "建立技术可视化组件库", desc: "架构图模板、演示模板", budget: "3-5万", roi: "效率提升3倍" },
      ],
    },
    {
      id: "v3",
      name: "产品可视化",
      nameEn: "Product Visual",
      score: 10,
      maxScore: 16,
      level: 2,
      levelName: "初建期",
      industryAvg: 10.8,
      rank: "中位数",
      questions: [
        { id: "q9", score: 2, maxScore: 4, answer: "B", label: "有基础设计" },
        { id: "q10", score: 3, maxScore: 4, answer: "C", label: "高度一致" },
        { id: "q11", score: 2, maxScore: 4, answer: "B", label: "没什么反馈" },
        { id: "q12", score: 3, maxScore: 4, answer: "C", label: "效率不错" },
      ],
      impacts: ["产品体验影响用户满意度和续约率"],
      suggestions: [
        { priority: "中期", title: "建立产品设计规范", desc: "UI组件库+设计系统", budget: "10-15万", roi: "150%+" },
      ],
    },
    {
      id: "v4",
      name: "数据可视化",
      nameEn: "Data Visual",
      score: 11,
      maxScore: 16,
      level: 2,
      levelName: "初建后期",
      industryAvg: 9.3,
      rank: "前30%",
      questions: [
        { id: "q13", score: 3, maxScore: 4, answer: "C", label: "专业看板" },
        { id: "q14", score: 3, maxScore: 4, answer: "C", label: "一目了然" },
        { id: "q15", score: 2, maxScore: 4, answer: "B", label: "基础展示" },
        { id: "q16", score: 3, maxScore: 4, answer: "C", label: "定制化工具" },
      ],
      impacts: ["数据决策效率受影响"],
      suggestions: [
        { priority: "优化", title: "建立数据可视化看板", desc: "优化数据呈现方式", budget: "5-8万", roi: "200%+" },
      ],
    },
  ],
};

export default function DiagnosisResultsPage() {
  const searchParams = useSearchParams();
  const diagnosisId = searchParams.get("id") || null;
  const [expandedDimensions, setExpandedDimensions] = useState<string[]>(["v1"]);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);

  useEffect(() => {
    if (!mockResults) return;
    const duration = 1500;
    const steps = 60;
    const increment = mockResults.totalScore / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= mockResults.totalScore) {
        setAnimatedScore(mockResults.totalScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [mockResults]);

  const radarData = mockResults.dimensions.map((dim) => ({
    dimension: dim.name,
    score: dim.score,
    industryAvg: dim.industryAvg,
    fullMark: 16,
  }));

  const toggleDimension = (id: string) => {
    setExpandedDimensions((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]" data-diagnosis>
      <Header />
      <main className="pt-24 pb-20">
        {/* Breadcrumb */}
        <div className="px-6 md:px-12 lg:px-20 mb-8">
          <div className="max-w-6xl mx-auto">
            <nav className="flex items-center gap-2 text-sm text-white/40">
              <Link href="/diagnosis" className="hover:text-white/60">诊断表单</Link>
              <span>/</span>
              <span className="text-white/60">诊断结果</span>
            </nav>
          </div>
        </div>

        {/* Header */}
        <div className="px-6 md:px-12 lg:px-20 mb-12">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-3">
              您的 VCMA 诊断报告已生成
            </h1>
            <p className="text-white/50 mb-4">ToB 科技企业可视化能力成熟度评估报告</p>
            <div className="flex items-center justify-center gap-4 text-sm text-white/40">
              <span>生成于 2024-01-15 14:30</span>
              <span>|</span>
              <span>#VCMA-20240115-001</span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <Button variant="outline" className="border-white/20 text-white/60 hover:bg-white/5 bg-transparent">
                <Download className="w-4 h-4 mr-2" />
                下载报告
              </Button>
              <Button variant="outline" className="border-white/20 text-white/60 hover:bg-white/5 bg-transparent">
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Button variant="outline" className="border-white/20 text-white/60 hover:bg-white/5 bg-transparent">
                <Save className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>

            {/* Company info */}
            {mockResults.companyInfo.name && (
              <div className="inline-flex items-center gap-3 mt-6 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
                <Building className="w-4 h-4 text-white/40" />
                <span className="text-white/60">{mockResults.companyInfo.name}</span>
                <span className="text-white/30">|</span>
                <span className="text-white/40">{mockResults.companyInfo.industry}</span>
                <span className="text-white/30">|</span>
                <span className="text-white/40">{mockResults.companyInfo.stage}</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 md:px-12 lg:px-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Score Overview Card */}
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Score */}
                    <div className="text-center">
                      <p className="text-sm text-white/40 mb-2">VCMA 总分</p>
                      <div className="text-7xl font-light text-primary mb-2">
                        {animatedScore}
                      </div>
                      <p className="text-white/40 mb-4">/ {mockResults.maxScore} 分</p>

                      {/* Level badge */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary">
                        <span className="font-medium">Level {mockResults.level} {mockResults.levelName}</span>
                      </div>

                      {/* Industry rank */}
                      <div className="mt-6 p-4 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-4 h-4 text-primary" />
                          <span className="text-sm text-white/60">
                            您的得分超过了 {mockResults.percentile}% 的同行业企业
                          </span>
                        </div>
                        <Progress value={mockResults.percentile} className="h-2 bg-white/10" />
                      </div>
                    </div>

                    {/* Right: Radar chart */}
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid stroke="rgba(255,255,255,0.1)" />
                          <PolarAngleAxis dataKey="dimension" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 16]} tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} />
                          <Radar name="行业平均" dataKey="industryAvg" stroke="rgba(255,255,255,0.3)" fill="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                          <Radar name="您的得分" dataKey="score" stroke="#FF6C2E" fill="#FF6C2E" fillOpacity={0.2} />
                          <Tooltip
                            contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }}
                            labelStyle={{ color: "rgba(255,255,255,0.8)" }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Quick insights */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-white/60">最大优势</span>
                      </div>
                      <p className="text-white font-medium">V2 技术可视化</p>
                      <p className="text-sm text-white/40">13/16 · 超越行业平均25%</p>
                    </div>

                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-white/60" />
                        <span className="text-sm font-medium text-white/60">核心短板</span>
                      </div>
                      <p className="text-white font-medium">V1 品牌可视化</p>
                      <p className="text-sm text-white/40">8/16 · 影响客户信任</p>
                    </div>
                  </div>
                </div>

                {/* Dimension Details */}
                {mockResults.dimensions.map((dim) => {
                  const isExpanded = expandedDimensions.includes(dim.id);

                  return (
                    <div
                      key={dim.id}
                      className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden"
                    >
                      {/* Header */}
                      <button
                        onClick={() => toggleDimension(dim.id)}
                        className="w-full p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
                            <span className="text-lg font-mono text-primary">{dim.id.toUpperCase()}</span>
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-medium text-white">{dim.name}</h3>
                              {dim.isWeakest && (
                                <span className="px-2 py-0.5 text-xs bg-white/10 text-white/60 rounded">短板</span>
                              )}
                              {dim.isStrongest && (
                                <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">优势</span>
                              )}
                            </div>
                            <p className="text-sm text-white/40">{dim.nameEn}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-2xl font-light text-white">
                              {dim.score}<span className="text-sm text-white/40">/{dim.maxScore}</span>
                            </p>
                            <span className="text-xs text-white/40">Level {dim.level}</span>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-white/40" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-white/40" />
                          )}
                        </div>
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-6 pb-6 space-y-6">
                          {/* Questions */}
                          <div className="space-y-3">
                            {dim.questions.map((q, i) => (
                              <div
                                key={q.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/40">
                                    Q{i + 1}
                                  </span>
                                  <span className="text-sm text-white/60">{q.label}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-mono text-white/60">{q.answer}</span>
                                  <div className="flex gap-0.5">
                                    {[1, 2, 3, 4].map((n) => (
                                      <div
                                        key={n}
                                        className={`w-2 h-2 rounded-full ${n <= q.score ? "bg-primary" : "bg-white/10"}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Impact */}
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <p className="text-sm font-medium text-white/60 mb-3">商业影响</p>
                            <ul className="space-y-2">
                              {dim.impacts.map((impact, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-white/50">
                                  <span className="text-white/30 mt-1">·</span>
                                  {impact}
                                </li>
                              ))}
                            </ul>
                            {dim.estimatedLoss && (
                              <p className="mt-3 text-sm text-primary">预计损失：{dim.estimatedLoss}</p>
                            )}
                          </div>

                          {/* Suggestions */}
                          <div className="space-y-3">
                            <p className="text-sm font-medium text-white/60">改善建议</p>
                            {dim.suggestions.map((sug, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                <div>
                                  <p className="text-sm text-white">{sug.title}</p>
                                  <p className="text-xs text-white/40">{sug.desc}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-white/60">{sug.budget}</p>
                                  <p className="text-xs text-primary">ROI {sug.roi}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* CTA Card */}
                <div className="sticky top-24 space-y-6">
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-medium text-white mb-2">获取专属解决方案</h3>
                    <p className="text-sm text-white/40 mb-6">
                      根据诊断结果，我们为您匹配了最适合的改善方案
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">核心短板</span>
                        <span className="text-white">V1 品牌可视化</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">预期提升</span>
                        <span className="text-primary">+12分 → Level 3</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/40">投资回报</span>
                        <span className="text-white">580% ROI</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => setShowConsultationDialog(true)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        预约专家咨询
                      </Button>
                      <Link href="/pricing">
                        <Button
                          variant="outline"
                          className="w-full border-white/10 text-white hover:bg-white/5"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          购买专属服务包
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                    <h4 className="text-sm font-medium text-white/60 mb-4">快捷操作</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start border-white/10 text-white/60 hover:bg-white/5 bg-transparent">
                        <Download className="w-4 h-4 mr-2" />
                        下载PDF报告
                      </Button>
                      <Button variant="outline" className="w-full justify-start border-white/10 text-white/60 hover:bg-white/5 bg-transparent">
                        <Share2 className="w-4 h-4 mr-2" />
                        分享给同事
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {diagnosisId && (
        <ConsultationDialog
          open={showConsultationDialog}
          onOpenChange={setShowConsultationDialog}
          diagnosisId={diagnosisId}
        />
      )}
    </div>
  );
}

