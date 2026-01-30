"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  Palette,
  Code,
  Layout,
  BarChart3,
  Clock,
  CheckCircle,
  Building,
  Briefcase,
  Users,
  Save,
} from "lucide-react";
import { Footer } from "@/components/sections/footer";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";

// VCMA 4维度16个问题
const dimensions = [
  {
    id: "v1",
    name: "品牌可视化",
    nameEn: "Brand Visual",
    icon: Palette,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    questions: [
      {
        id: "q1",
        question: "客户/投资人看到你们的品牌视觉，第一反应是什么？",
        options: [
          { value: 1, label: "看起来像小作坊/不专业", desc: "没有统一视觉，随意设计" },
          { value: 2, label: "一般/没什么印象", desc: "有基础设计但不突出" },
          { value: 3, label: "还不错/比较专业", desc: "有系统的品牌视觉" },
          { value: 4, label: "非常专业/印象深刻", desc: "品牌视觉是竞争优势" },
        ],
      },
      {
        id: "q2",
        question: "你们的品牌视觉资产完整度如何？",
        options: [
          { value: 1, label: "只有Logo", desc: "没有系统的视觉规范" },
          { value: 2, label: "有Logo和基础颜色", desc: "缺少完整的VI系统" },
          { value: 3, label: "有完整VI系统", desc: "Logo+颜色+字体+辅助图形" },
          { value: 4, label: "有品牌设计系统", desc: "包含设计规范和组件库" },
        ],
      },
      {
        id: "q3",
        question: "官网/宣传物料的视觉水平与竞争对手相比？",
        options: [
          { value: 1, label: "明显落后", desc: "对手视觉明显更好" },
          { value: 2, label: "差不多", desc: "在同一水平线" },
          { value: 3, label: "略有优势", desc: "某些方面更突出" },
          { value: 4, label: "行业领先", desc: "被认为是行业标杆" },
        ],
      },
      {
        id: "q4",
        question: "过去半年，因视觉形象问题损失过商业机会吗？",
        options: [
          { value: 1, label: "经常发生", desc: "多次因形象问题丢单" },
          { value: 2, label: "偶尔发生", desc: "有几次相关反馈" },
          { value: 3, label: "很少发生", desc: "基本没有影响" },
          { value: 4, label: "从未发生", desc: "视觉是加分项" },
        ],
      },
    ],
  },
  {
    id: "v2",
    name: "技术可视化",
    nameEn: "Tech Visual",
    icon: Code,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    questions: [
      {
        id: "q5",
        question: "销售/售前给客户讲技术方案时，主要用什么？",
        options: [
          { value: 1, label: "纯文字文档", desc: "没有可视化内容" },
          { value: 2, label: "简单PPT", desc: "基础图表和文字" },
          { value: 3, label: "专业演示材料", desc: "有设计的PPT和文档" },
          { value: 4, label: "可视化演示系统", desc: "交互式演示+动态效果" },
        ],
      },
      {
        id: "q6",
        question: "技术内容的可视化表达效果如何？",
        options: [
          { value: 1, label: "客户听不懂", desc: "技术太抽象难理解" },
          { value: 2, label: "需要反复解释", desc: "理解成本较高" },
          { value: 3, label: "基本能理解", desc: "一次讲解即可理解" },
          { value: 4, label: "一看就懂", desc: "可视化清晰直观" },
        ],
      },
      {
        id: "q7",
        question: "技术文档/白皮书的视觉专业度？",
        options: [
          { value: 1, label: "没有技术文档", desc: "或只有纯文字版本" },
          { value: 2, label: "有但很简陋", desc: "基础排版无设计" },
          { value: 3, label: "专业度不错", desc: "有设计有图表" },
          { value: 4, label: "行业标杆水平", desc: "被同行参考学习" },
        ],
      },
      {
        id: "q8",
        question: "技术可视化资产的复用效率？",
        options: [
          { value: 1, label: "每次重新做", desc: "没有资产沉淀" },
          { value: 2, label: "有些可复用", desc: "但需要大量修改" },
          { value: 3, label: "大部分可复用", desc: "有模板和组件" },
          { value: 4, label: "高度模块化", desc: "快速组装新内容" },
        ],
      },
    ],
  },
  {
    id: "v3",
    name: "产品可视化",
    nameEn: "Product Visual",
    icon: Layout,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    questions: [
      {
        id: "q9",
        question: "产品界面的视觉设计水平？",
        options: [
          { value: 1, label: "功能能用就行", desc: "没有专门设计" },
          { value: 2, label: "有基础设计", desc: "但不够精致" },
          { value: 3, label: "设计专业", desc: "有设计规范和组件" },
          { value: 4, label: "体验出色", desc: "设计是产品亮点" },
        ],
      },
      {
        id: "q10",
        question: "产品设计的一致性如何？",
        options: [
          { value: 1, label: "各页面风格不统一", desc: "看起来像不同产品" },
          { value: 2, label: "基本一致", desc: "偶有不协调" },
          { value: 3, label: "高度一致", desc: "有设计系统支撑" },
          { value: 4, label: "完美统一", desc: "体验流畅无断层" },
        ],
      },
      {
        id: "q11",
        question: "用户对产品视觉的反馈？",
        options: [
          { value: 1, label: "经常吐槽难用", desc: "视觉是减分项" },
          { value: 2, label: "没什么反馈", desc: "不好不坏" },
          { value: 3, label: "偶尔夸赞", desc: "有正面评价" },
          { value: 4, label: "经常被夸", desc: "视觉是卖点" },
        ],
      },
      {
        id: "q12",
        question: "产品设计团队的效率？",
        options: [
          { value: 1, label: "没有专职设计", desc: "开发兼职或外包" },
          { value: 2, label: "有设计但效率低", desc: "重复造轮子" },
          { value: 3, label: "效率不错", desc: "有组件库和规范" },
          { value: 4, label: "高效协作", desc: "设计系统完善" },
        ],
      },
    ],
  },
  {
    id: "v4",
    name: "数据可视化",
    nameEn: "Data Visual",
    icon: BarChart3,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    questions: [
      {
        id: "q13",
        question: "数据报表/看板的呈现方式？",
        options: [
          { value: 1, label: "Excel导出", desc: "纯表格数据" },
          { value: 2, label: "基础图表", desc: "简单柱状/折线图" },
          { value: 3, label: "专业看板", desc: "多维度数据可视化" },
          { value: 4, label: "智能看板", desc: "实时+交互+洞察" },
        ],
      },
      {
        id: "q14",
        question: "数据辅助决策的效果？",
        options: [
          { value: 1, label: "数据难以理解", desc: "决策靠直觉" },
          { value: 2, label: "需要分析解读", desc: "有专人翻译" },
          { value: 3, label: "一目了然", desc: "数据驱动决策" },
          { value: 4, label: "智能洞察", desc: "自动发现问题" },
        ],
      },
      {
        id: "q15",
        question: "对外数据展示的专业度？",
        options: [
          { value: 1, label: "不对外展示", desc: "或很粗糙" },
          { value: 2, label: "基础展示", desc: "简单截图或报表" },
          { value: 3, label: "专业报告", desc: "设计精美的数据报告" },
          { value: 4, label: "数据故事", desc: "用数据讲好故事" },
        ],
      },
      {
        id: "q16",
        question: "数据可视化工具和流程？",
        options: [
          { value: 1, label: "手动制作", desc: "Excel或手绘" },
          { value: 2, label: "基础工具", desc: "BI工具默认样式" },
          { value: 3, label: "定制化工具", desc: "有可视化规范" },
          { value: 4, label: "自动化平台", desc: "一键生成美观报表" },
        ],
      },
    ],
  },
];

export default function DiagnosisFormPage() {
  const router = useRouter();
  const { lang } = useLang();
  const T = getT(lang);
  const [currentDimension, setCurrentDimension] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    industry: "",
    stage: "",
    size: "",
  });
  const [showCompanyForm, setShowCompanyForm] = useState(true);

  const totalQuestions = 16;
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / totalQuestions) * 100;

  const currentDim = dimensions[currentDimension];
  const currentQ = currentDim.questions[currentQuestion];
  const globalQuestionIndex = currentDimension * 4 + currentQuestion;

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));

    // Auto advance
    setTimeout(() => {
      if (currentQuestion < 3) {
        setCurrentQuestion(currentQuestion + 1);
      } else if (currentDimension < 3) {
        setCurrentDimension(currentDimension + 1);
        setCurrentQuestion(0);
      }
    }, 300);
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentDimension > 0) {
      setCurrentDimension(currentDimension - 1);
      setCurrentQuestion(3);
    }
  };

  const handleNext = () => {
    if (currentQuestion < 3) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentDimension < 3) {
      setCurrentDimension(currentDimension + 1);
      setCurrentQuestion(0);
    }
  };

  const handleSubmit = async () => {
    try {
      // 提交到后端API
      const res = await fetch("/api/diagnosis/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          companyInfo,
          answers,
          contactInfo: {
            name: companyInfo.name || undefined,
            email: undefined,
            phone: undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "提交失败");
      }

      // 保存到localStorage用于analyzing页面
      localStorage.setItem("vcma_answers", JSON.stringify(answers));
      localStorage.setItem("vcma_company", JSON.stringify(companyInfo));
      localStorage.setItem("vcma_diagnosis_id", data.data.diagnosisId);
      
      router.push("/diagnosis/analyzing");
    } catch (error: any) {
      const msg = error?.message ?? "";
      const isEmailError = /email|contactInfo/i.test(msg);
      const T = getT(lang);
      alert(isEmailError ? T.common.diagnosisInvalidEmail : T.common.diagnosisSubmitFailed);
    }
  };

  const canSubmit = answeredCount === 16;

  if (showCompanyForm) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]" data-diagnosis>
        <main className="pt-4 pb-20 px-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono text-primary">{T.diagnosisPage.estimatedTime}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-light text-white mb-4">
                {T.diagnosisPage.title}
              </h1>
              <p className="text-white/50">
                {T.diagnosisPage.subtitle}
              </p>
            </div>

            {/* Company Info Form */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
              <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-3">
                <Building className="w-5 h-5 text-primary" />
                {T.diagnosisPage.companyInfoOptional}
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-white/60 mb-2">{T.diagnosisPage.companyName}</label>
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    placeholder={T.diagnosisPage.companyNamePlaceholder}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">{T.diagnosisPage.industry}</label>
                  <select
                    value={companyInfo.industry}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, industry: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                  >
                    <option value="">{T.diagnosisPage.pleaseSelect}</option>
                    <option value="ai">{T.diagnosisPage.industryAi}</option>
                    <option value="saas">{T.diagnosisPage.industrySaas}</option>
                    <option value="fintech">{T.diagnosisPage.industryFintech}</option>
                    <option value="data">{T.diagnosisPage.industryData}</option>
                    <option value="cloud">{T.diagnosisPage.industryCloud}</option>
                    <option value="iot">{T.diagnosisPage.industryIot}</option>
                    <option value="other">{T.diagnosisPage.industryOther}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">{T.diagnosisPage.stage}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { value: "seed", label: T.diagnosisPage.stageSeed, icon: Briefcase },
                      { value: "growth", label: T.diagnosisPage.stageGrowth, icon: Users },
                      { value: "expansion", label: T.diagnosisPage.stageExpansion, icon: Building },
                      { value: "mature", label: T.diagnosisPage.stageMature, icon: CheckCircle },
                    ].map((stage) => (
                      <button
                        key={stage.value}
                        type="button"
                        onClick={() => setCompanyInfo({ ...companyInfo, stage: stage.value })}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          companyInfo.stage === stage.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-white/10 text-white/60 hover:border-white/20"
                        }`}
                      >
                        <stage.icon className="w-5 h-5 mx-auto mb-2" />
                        <span className="text-sm">{stage.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/60 mb-2">{T.diagnosisPage.teamSize}</label>
                  <select
                    value={companyInfo.size}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, size: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary/50"
                  >
                    <option value="">{T.diagnosisPage.pleaseSelect}</option>
                    <option value="1-10">{T.diagnosisPage.size1_10}</option>
                    <option value="11-50">{T.diagnosisPage.size11_50}</option>
                    <option value="51-200">{T.diagnosisPage.size51_200}</option>
                    <option value="201-500">{T.diagnosisPage.size201_500}</option>
                    <option value="500+">{T.diagnosisPage.size500Plus}</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1 border-white/20 text-white/60 hover:bg-white/5 bg-transparent"
                  onClick={() => setShowCompanyForm(false)}
                >
                  {T.diagnosisPage.skipAndStart}
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => setShowCompanyForm(false)}
                >
                  {T.diagnosisPage.startDiagnosis}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <main className="pt-4 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                {dimensions.map((dim, i) => {
                  const Icon = dim.icon;
                  const isActive = i === currentDimension;
                  const isCompleted =
                    i < currentDimension ||
                    (i === currentDimension && currentQuestion === 3 && answers[currentQ.id]);
                  return (
                    <button
                      key={dim.id}
                      onClick={() => {
                        setCurrentDimension(i);
                        setCurrentQuestion(0);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                        isActive
                          ? `${dim.bgColor} ${dim.color}`
                          : isCompleted
                          ? "bg-white/10 text-white/80"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium hidden md:inline">{lang === "en" ? dim.nameEn : dim.name}</span>
                      {isCompleted && <CheckCircle className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
              <span className="text-sm font-mono text-white/40">
                {globalQuestionIndex + 1} / 16
              </span>
            </div>
            <Progress value={progress} className="h-1 bg-white/10" />
          </div>

          {/* Question Card */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-12">
            {/* Dimension Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`w-10 h-10 rounded-xl ${currentDim.bgColor} flex items-center justify-center`}>
                <currentDim.icon className={`w-5 h-5 ${currentDim.color}`} />
              </div>
              <div>
                <span className={`text-sm font-mono ${currentDim.color}`}>{currentDim.nameEn}</span>
                <h2 className="text-lg font-medium text-white">{lang === "en" ? currentDim.nameEn : currentDim.name}</h2>
              </div>
              <span className="ml-auto text-sm text-white/40">
                {T.diagnosisPage.questionLabel} {currentQuestion + 1}/4
              </span>
            </div>

            {/* Question */}
            <h3 className="text-xl md:text-2xl font-light text-white mb-8 leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="space-y-4">
              {currentQ.options.map((option) => {
                const isSelected = answers[currentQ.id] === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQ.id, option.value)}
                    className={`w-full p-5 rounded-xl border text-left transition-all group ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-white/20 group-hover:border-white/40"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-sm text-white/40">{option.value}</span>
                        )}
                      </div>
                      <div>
                        <p className={`font-medium mb-1 ${isSelected ? "text-primary" : "text-white"}`}>
                          {option.label}
                        </p>
                        <p className="text-sm text-white/40">{option.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentDimension === 0 && currentQuestion === 0}
              className="border-white/20 text-white/60 hover:bg-white/5 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              {T.diagnosisPage.prevQuestion}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                localStorage.setItem("vcma_answers_draft", JSON.stringify(answers));
                localStorage.setItem("vcma_company_draft", JSON.stringify(companyInfo));
              }}
              className="border-white/20 text-white/40 hover:bg-white/5 bg-transparent"
            >
              <Save className="w-4 h-4 mr-2" />
              {T.diagnosisPage.saveDraft}
            </Button>

            {canSubmit ? (
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                {T.diagnosisPage.submitDiagnosis}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentDimension === 3 && currentQuestion === 3}
                className="bg-white/10 hover:bg-white/20 text-white"
              >
                {T.diagnosisPage.nextQuestion}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

