"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/sections/footer";
import { 
  ChevronDown, 
  CheckCircle2, 
  Download, 
  FileText, 
  Calculator, 
  Map, 
  ArrowRight,
  Layers,
  Code,
  Package,
  BarChart3,
  Check,
  ExternalLink
} from "lucide-react";

// VCMA 4 Dimensions Data
const dimensions = [
  {
    id: "V",
    name: "品牌可视化",
    nameEn: "Brand Visual",
    subtitle: "百维赋",
    color: "primary",
    colorClass: "text-primary",
    bgClass: "bg-primary/10",
    borderClass: "border-primary/30",
    icon: Layers,
    definition: "构建独特的视觉语言系统，让品牌在数字世界中脱颖而出",
    scope: ["视觉识别系统", "品牌动效规范", "数字资产库", "品牌一致性管理"],
    levels: [
      {
        level: "L0",
        name: "无意识期",
        features: ["无统一视觉规范", "设计师各自为政", "品牌认知混乱", "视觉资产散乱"],
        impact: "品牌无法被识别，客户流失率高达40%",
        solution: "基础VI系统搭建 + 设计规范制定",
        roi: "品牌认知度提升60%"
      },
      {
        level: "L1",
        name: "基础期",
        features: ["有基础Logo和色彩", "缺乏系统性规范", "执行不一致", "无数字化延展"],
        impact: "品牌体验不连贯，转化率损失25%",
        solution: "完整VI手册 + 数字化组件库",
        roi: "转化率提升35%"
      },
      {
        level: "L2",
        name: "规范期",
        features: ["完整的视觉系统", "基础设计规范", "部分数字化执行", "团队认知统一"],
        impact: "品牌基础稳定，但缺乏差异化",
        solution: "品牌动效系统 + 差异化视觉语言",
        roi: "品牌溢价提升20%"
      },
      {
        level: "L3",
        name: "成熟期",
        features: ["差异化视觉语言", "完整动效规范", "自动化设计系统", "跨平台一致性"],
        impact: "品牌形成独特认知，竞争力显著提升",
        solution: "AI辅助设计 + 品牌体验升级",
        roi: "客户忠诚度提升45%"
      },
      {
        level: "L4",
        name: "领先期",
        features: ["行业视觉标杆", "创新设计引领", "品牌IP生态", "全触点沉浸体验"],
        impact: "品牌成为行业标准，引领设计趋势",
        solution: "持续创新 + 生态扩展",
        roi: "市场份额增长30%+"
      }
    ],
    checklist: [
      "是否有完整的品牌视觉识别手册？",
      "所有数字触点是否保持视觉一致？",
      "是否建立了可复用的设计组件库？",
      "品牌动效是否有规范指导？",
      "团队成员是否理解并执行品牌规范？"
    ]
  },
  {
    id: "C",
    name: "技术可视化",
    nameEn: "Tech Visual",
    subtitle: "万维图",
    color: "accent",
    colorClass: "text-accent",
    bgClass: "bg-accent/10",
    borderClass: "border-accent/30",
    icon: Code,
    definition: "将复杂的技术架构转化为直观的可视化表达",
    scope: ["架构图设计", "数据流可视化", "技术文档设计", "API可视化"],
    levels: [
      {
        level: "L0",
        name: "无意识期",
        features: ["技术文档纯文字", "架构图杂乱无章", "无统一图表风格", "沟通效率极低"],
        impact: "技术沟通成本增加60%，项目延期风险高",
        solution: "技术图表规范 + 架构图模板库",
        roi: "沟通效率提升50%"
      },
      {
        level: "L1",
        name: "基础期",
        features: ["使用通用工具", "有基础图表", "风格不统一", "缺乏交互性"],
        impact: "技术演示效果一般，决策效率受限",
        solution: "专业化图表设计 + 风格统一",
        roi: "决策效率提升40%"
      },
      {
        level: "L2",
        name: "规范期",
        features: ["统一的图表风格", "交互式架构图", "技术文档可视化", "团队规范执行"],
        impact: "技术沟通顺畅，但缺乏深度展示",
        solution: "3D架构可视化 + 实时数据联动",
        roi: "技术说服力提升60%"
      },
      {
        level: "L3",
        name: "成熟期",
        features: ["3D技术可视化", "实时数据架构图", "自动化文档生成", "全链路可视化"],
        impact: "技术展示成为竞争优势，赢单率提升",
        solution: "AI技术可视化 + 沉浸式演示",
        roi: "技术赢单率提升35%"
      },
      {
        level: "L4",
        name: "领先期",
        features: ["AI驱动的技术可视化", "实时监控大屏", "技术品牌IP", "行业影响力"],
        impact: "技术可视化成为行业标杆",
        solution: "持续创新 + 生态输出",
        roi: "行业话语权显著提升"
      }
    ],
    checklist: [
      "是否有统一的技术图表设计规范？",
      "架构图是否能让非技术人员理解？",
      "技术文档是否有可视化辅助？",
      "是否有可复用的技术图表模板？",
      "技术演示是否支持交互式展示？"
    ]
  },
  {
    id: "M",
    name: "产品可视化",
    nameEn: "Product Visual",
    subtitle: "千维镜",
    color: "chart-4",
    colorClass: "text-[oklch(0.65_0.18_320)]",
    bgClass: "bg-[oklch(0.65_0.18_320_/_0.1)]",
    borderClass: "border-[oklch(0.65_0.18_320_/_0.3)]",
    icon: Package,
    definition: "创造沉浸式的产品展示体验，提升用户认知",
    scope: ["3D产品展示", "交互原型设计", "动态演示", "产品可视化营销"],
    levels: [
      {
        level: "L0",
        name: "无意识期",
        features: ["产品截图为主", "无交互演示", "展示方式单一", "用户理解困难"],
        impact: "产品价值传递不清，试用转化率低于15%",
        solution: "基础产品演示 + 交互原型",
        roi: "试用转化率提升40%"
      },
      {
        level: "L1",
        name: "基础期",
        features: ["有产品演示视频", "简单交互原型", "展示较为被动", "缺乏差异化"],
        impact: "产品展示平淡，难以脱颖而出",
        solution: "3D产品展示 + 沉浸式体验",
        roi: "产品关注度提升55%"
      },
      {
        level: "L2",
        name: "规范期",
        features: ["3D产品渲染", "交互式原型", "场景化展示", "多平台适配"],
        impact: "产品展示专业，用户体验良好",
        solution: "实时3D + AR/VR体验",
        roi: "用户停留时间提升80%"
      },
      {
        level: "L3",
        name: "成熟期",
        features: ["实时3D交互", "AR/VR产品体验", "智能化演示", "数据驱动优化"],
        impact: "产品展示成为转化利器",
        solution: "AI个性化展示 + 全渠道覆盖",
        roi: "转化率提升65%"
      },
      {
        level: "L4",
        name: "领先期",
        features: ["AI驱动个性化展示", "元宇宙产品体验", "产品可视化IP", "行业创新引领"],
        impact: "产品可视化成为行业标杆",
        solution: "持续创新 + 生态扩展",
        roi: "市场竞争力持续领先"
      }
    ],
    checklist: [
      "产品是否有3D或交互式展示？",
      "用户是否能快速理解产品价值？",
      "产品演示是否支持自助探索？",
      "是否有针对不同用户的定制展示？",
      "产品可视化是否与品牌风格一致？"
    ]
  },
  {
    id: "A",
    name: "数据可视化",
    nameEn: "Data Visual",
    subtitle: "数维观",
    color: "chart-5",
    colorClass: "text-[oklch(0.6_0.16_20)]",
    bgClass: "bg-[oklch(0.6_0.16_20_/_0.1)]",
    borderClass: "border-[oklch(0.6_0.16_20_/_0.3)]",
    icon: BarChart3,
    definition: "让数据讲述故事，驱动商业决策",
    scope: ["数据大屏设计", "报表可视化", "实时监控界面", "BI仪表盘"],
    levels: [
      {
        level: "L0",
        name: "无意识期",
        features: ["Excel表格为主", "无数据可视化", "决策凭经验", "数据价值未挖掘"],
        impact: "决策效率低，错失商业机会",
        solution: "基础报表可视化 + 核心指标看板",
        roi: "决策效率提升45%"
      },
      {
        level: "L1",
        name: "基础期",
        features: ["简单图表展示", "静态报表", "数据分散", "缺乏实时性"],
        impact: "数据洞察有限，反应滞后",
        solution: "统一数据看板 + 实时更新",
        roi: "业务响应速度提升50%"
      },
      {
        level: "L2",
        name: "规范期",
        features: ["统一的数据看板", "实时数据更新", "多维度分析", "基础预警机制"],
        impact: "数据驱动初步形成，但深度不足",
        solution: "智能分析 + 预测模型",
        roi: "预测准确率提升40%"
      },
      {
        level: "L3",
        name: "成熟期",
        features: ["智能数据分析", "预测性可视化", "实时监控大屏", "自动化报告"],
        impact: "数据成为核心竞争力",
        solution: "AI洞察 + 决策支持系统",
        roi: "商业洞察价值提升70%"
      },
      {
        level: "L4",
        name: "领先期",
        features: ["AI驱动的数据洞察", "全域数据整合", "数据可视化IP", "行业数据标杆"],
        impact: "数据可视化成为行业标准",
        solution: "持续创新 + 生态输出",
        roi: "数据资产价值最大化"
      }
    ],
    checklist: [
      "是否有统一的数据可视化规范？",
      "核心业务指标是否有实时看板？",
      "数据展示是否支持多维度分析？",
      "是否有自动化的数据报告？",
      "数据可视化是否支持决策辅助？"
    ]
  }
];

// Tools data
const tools = [
  {
    icon: FileText,
    title: "VCMA诊断问卷",
    titleEn: "VCMA Questionnaire",
    desc: "8分钟完成专业诊断",
    action: "开始诊断",
    type: "online"
  },
  {
    icon: Check,
    title: "自评清单",
    titleEn: "Self-Assessment",
    desc: "快速定位可视化短板",
    action: "下载PDF",
    type: "download"
  },
  {
    icon: Calculator,
    title: "ROI计算器",
    titleEn: "ROI Calculator",
    desc: "量化可视化投资回报",
    action: "在线计算",
    type: "online"
  },
  {
    icon: Map,
    title: "实施路线图",
    titleEn: "Roadmap",
    desc: "分阶段落地指南",
    action: "获取方案",
    type: "download"
  }
];

// Scenarios data
const scenarios = [
  {
    stage: "初创期",
    stageEn: "Startup",
    metric: "30%",
    metricLabel: "融资估值提升",
    desc: "通过专业的品牌可视化和产品演示，让投资人快速理解产品价值"
  },
  {
    stage: "成长期",
    stageEn: "Growth",
    metric: "40%",
    metricLabel: "销售转化率提升",
    desc: "数据可视化驱动的销售演示，让客户更直观地感受产品优势"
  },
  {
    stage: "扩张期",
    stageEn: "Scale",
    metric: "25%",
    metricLabel: "客户续约率提升",
    desc: "完整的可视化体系提升品牌专业度，增强客户信任与粘性"
  }
];

export default function MethodPage() {
  const [activeDimension, setActiveDimension] = useState(0);
  const [expandedLevels, setExpandedLevels] = useState<{ [key: string]: boolean }>({});
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const toggleLevel = (dimId: string, level: string) => {
    const key = `${dimId}-${level}`;
    setExpandedLevels(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const toggleCheck = (dimId: string, index: number) => {
    const key = `${dimId}-${index}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };
  
  const currentDim = dimensions[activeDimension];
  const Icon = currentDim.icon;

  return (
    <div className="min-h-screen bg-background noise-overlay page-enter">
      <main className="pt-0 page-enter-content">
        {/* Hero Section */}
        <section className="relative py-32 overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />
          </div>
          
          <div className="relative px-2 md:px-4 lg:px-8 xl:px-32">
            {/* Label */}
            <div 
              className={cn(
                "flex items-center gap-4 mb-8 transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <span className="text-xs font-mono text-primary tracking-widest">METHOD</span>
              <div className="w-12 h-px bg-primary/50" />
            </div>
            
            {/* Title */}
            <h1 
              className={cn(
                "text-5xl md:text-7xl lg:text-8xl font-extralight leading-[0.95] mb-8 transition-all duration-700 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <span className="text-primary">VCMA</span>
              <br />
              <span className="text-foreground/90">4维诊断体系</span>
            </h1>
            
            {/* Subtitle */}
            <p 
              className={cn(
                "text-lg md:text-xl text-muted-foreground transition-all duration-700 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              服务100+企业总结的实战体系，从品牌、技术、产品、数据四个维度全面诊断可视化成熟度
            </p>
            
            {/* Stats */}
            <div 
              className={cn(
                "flex flex-wrap gap-12 mt-16 transition-all duration-700 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              {[
                { value: "4", label: "核心维度" },
                { value: "5", label: "成熟度等级" },
                { value: "20+", label: "诊断指标" },
                { value: "100+", label: "服务企业" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-4xl font-extralight text-primary">{stat.value}</span>
                  <span className="text-xs font-mono text-muted-foreground mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Framework */}
        <section className="py-24 border-t border-border/30">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-16">
              <span className="text-xs font-mono text-primary tracking-widest">01</span>
              <div className="w-12 h-px bg-primary/50" />
              <span className="text-xs font-mono text-muted-foreground">
                核心框架 <span className="text-primary/40">/ Framework</span>
              </span>
            </div>
            
            {/* 4 Dimension Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              {dimensions.map((dim, i) => {
                const DimIcon = dim.icon;
                return (
                  <button
                    key={dim.id}
                    onClick={() => setActiveDimension(i)}
                    className={cn(
                      "group relative p-6 rounded-xl border text-left transition-all duration-500",
                      activeDimension === i
                        ? `${dim.borderClass} ${dim.bgClass}`
                        : "border-border/30 bg-card/30 hover:border-border/50"
                    )}
                  >
                    {/* Corner decoration */}
                    <div className={cn(
                      "absolute top-3 right-3 w-6 h-6 border-t border-r transition-colors duration-300",
                      activeDimension === i ? dim.borderClass : "border-border/20"
                    )} />
                    
                    {/* Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300",
                      activeDimension === i ? dim.bgClass : "bg-muted/30"
                    )}>
                      <DimIcon className={cn(
                        "w-5 h-5 transition-colors duration-300",
                        activeDimension === i ? dim.colorClass : "text-muted-foreground"
                      )} />
                    </div>
                    
                    {/* Content */}
                    <div className="text-2xl font-light mb-1">{dim.id}</div>
                    <div className={cn(
                      "text-sm font-medium mb-1 transition-colors duration-300",
                      activeDimension === i ? dim.colorClass : "text-foreground"
                    )}>
                      {dim.name}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{dim.nameEn}</div>
                    
                    {/* Active indicator */}
                    {activeDimension === i && (
                      <div className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-0.5 rounded-full",
                        dim.id === "V" ? "bg-primary" : 
                        dim.id === "C" ? "bg-accent" :
                        dim.id === "M" ? "bg-[oklch(0.65_0.18_320)]" : "bg-[oklch(0.6_0.16_20)]"
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Active Dimension Detail */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Definition & Scope */}
              <div className="lg:col-span-1 space-y-6">
                <div className={cn(
                  "p-6 rounded-xl border",
                  currentDim.borderClass,
                  currentDim.bgClass
                )}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={cn("w-6 h-6", currentDim.colorClass)} />
                    <div>
                      <h3 className="text-lg font-medium">{currentDim.name} · {currentDim.subtitle}</h3>
                      <p className="text-xs font-mono text-muted-foreground">{currentDim.nameEn}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{currentDim.definition}</p>
                </div>
                
                {/* Scope */}
                <div className="p-6 rounded-xl border border-border/30 bg-card/30">
                  <h4 className="text-sm font-medium mb-4">服务范围</h4>
                  <div className="space-y-2">
                    {currentDim.scope.map((item, i) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className={cn("w-1.5 h-1.5 rounded-full", currentDim.bgClass.replace('/10', ''))} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Self Check */}
                <div className="p-6 rounded-xl border border-border/30 bg-card/30">
                  <h4 className="text-sm font-medium mb-4">自测清单</h4>
                  <div className="space-y-3">
                    {currentDim.checklist.map((item, i) => {
                      const key = `${currentDim.id}-${i}`;
                      return (
                        <button
                          key={item}
                          onClick={() => toggleCheck(currentDim.id, i)}
                          className="flex items-start gap-3 text-left w-full group"
                        >
                          <div className={cn(
                            "mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-all duration-300",
                            checkedItems[key]
                              ? `${currentDim.bgClass} ${currentDim.borderClass}`
                              : "border-border/50 group-hover:border-border"
                          )}>
                            {checkedItems[key] && (
                              <Check className={cn("w-3 h-3", currentDim.colorClass)} />
                            )}
                          </div>
                          <span className={cn(
                            "text-sm transition-colors duration-300",
                            checkedItems[key] ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {item}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Right: Maturity Levels */}
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-sm font-medium mb-6">成熟度等级 <span className="text-muted-foreground font-mono">L0 - L4</span></h4>
                
                {/* Progress bar */}
                <div className="relative h-2 bg-muted/30 rounded-full mb-8 overflow-hidden">
                  <div className="absolute inset-y-0 left-0 flex">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div 
                        key={level}
                        className={cn(
                          "w-[20%] h-full transition-all duration-500",
                          level === 0 ? "bg-muted-foreground/30" :
                          level === 1 ? "bg-muted-foreground/50" :
                          level === 2 ? currentDim.bgClass.replace('/10', '/40') :
                          level === 3 ? currentDim.bgClass.replace('/10', '/70') :
                          currentDim.bgClass.replace('/10', '')
                        )}
                      />
                    ))}
                  </div>
                  {/* Level markers */}
                  <div className="absolute inset-0 flex justify-between px-[10%]">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div key={level} className="relative">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-muted-foreground">
                          L{level}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Accordion Levels */}
                <div className="space-y-3">
                  {currentDim.levels.map((level, i) => {
                    const key = `${currentDim.id}-${level.level}`;
                    const isExpanded = expandedLevels[key];
                    
                    return (
                      <div 
                        key={level.level}
                        className={cn(
                          "rounded-xl border transition-all duration-300",
                          isExpanded ? `${currentDim.borderClass} bg-card/50` : "border-border/30 bg-card/30"
                        )}
                      >
                        <button
                          onClick={() => toggleLevel(currentDim.id, level.level)}
                          className="w-full p-5 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-4">
                            <span className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-mono font-medium transition-colors duration-300",
                              isExpanded ? `${currentDim.bgClass} ${currentDim.colorClass}` : "bg-muted/30 text-muted-foreground"
                            )}>
                              {level.level}
                            </span>
                            <div>
                              <h5 className="font-medium">{level.name}</h5>
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                {level.features[0]}...
                              </p>
                            </div>
                          </div>
                          <ChevronDown className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform duration-300",
                            isExpanded ? "rotate-180" : ""
                          )} />
                        </button>
                        
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-0 border-t border-border/30 animate-in slide-in-from-top-2 duration-300">
                            <div className="grid md:grid-cols-2 gap-6 pt-5">
                              {/* Features */}
                              <div>
                                <h6 className="text-xs font-mono text-muted-foreground mb-3">典型特征</h6>
                                <ul className="space-y-2">
                                  {level.features.map((feature, fi) => (
                                    <li key={fi} className="flex items-start gap-2 text-sm">
                                      <div className={cn("w-1 h-1 rounded-full mt-2", currentDim.bgClass.replace('/10', ''))} />
                                      <span className="text-foreground/80">{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {/* Impact & Solution */}
                              <div className="space-y-4">
                                <div>
                                  <h6 className="text-xs font-mono text-muted-foreground mb-2">商业影响</h6>
                                  <p className="text-sm text-foreground/80">{level.impact}</p>
                                </div>
                                <div>
                                  <h6 className="text-xs font-mono text-muted-foreground mb-2">解决方案</h6>
                                  <p className="text-sm text-foreground/80">{level.solution}</p>
                                </div>
                                <div className={cn(
                                  "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                                  currentDim.bgClass
                                )}>
                                  <span className={currentDim.colorClass}>ROI:</span>
                                  <span className="text-foreground">{level.roi}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-24 border-t border-border/30">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-16">
              <span className="text-xs font-mono text-primary tracking-widest">02</span>
              <div className="w-12 h-px bg-primary/50" />
              <span className="text-xs font-mono text-muted-foreground">
                配套工具 <span className="text-primary/40">/ Tools</span>
              </span>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool, i) => {
                const ToolIcon = tool.icon;
                return (
                  <a
                    key={tool.title}
                    href="#"
                    className="group relative p-6 rounded-xl border border-border/30 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all duration-500"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <ToolIcon className="w-6 h-6 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-medium mb-1">{tool.title}</h3>
                    <p className="text-xs font-mono text-muted-foreground mb-1">{tool.titleEn}</p>
                    <p className="text-sm text-muted-foreground mb-4">{tool.desc}</p>
                    
                    {/* Action */}
                    <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all duration-300">
                      <span>{tool.action}</span>
                      {tool.type === "download" ? (
                        <Download className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </div>
                    
                    {/* Corner decoration */}
                    <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-border/30 group-hover:border-primary/30 transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* Scenarios Section */}
        <section className="py-24 border-t border-border/30">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32">
            {/* Section header */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-mono text-primary tracking-widest">03</span>
              <div className="w-12 h-px bg-primary/50" />
              <span className="text-xs font-mono text-muted-foreground">
                应用场景 <span className="text-primary/40">/ Scenarios</span>
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extralight mb-16">
              不同阶段，<span className="text-muted-foreground">不同价值</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {scenarios.map((scenario, i) => (
                <div
                  key={scenario.stage}
                  className="group relative p-8 rounded-xl border border-border/30 bg-card/30 hover:border-primary/30 transition-all duration-500"
                >
                  {/* Stage label */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-xs font-mono text-primary">{scenario.stageEn}</span>
                    <span className="text-lg font-medium">{scenario.stage}</span>
                  </div>
                  
                  {/* Metric */}
                  <div className="mb-6">
                    <div className="text-5xl font-extralight text-primary mb-2">{scenario.metric}</div>
                    <div className="text-sm text-muted-foreground">{scenario.metricLabel}</div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">{scenario.desc}</p>
                  
                  {/* Decorative line */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-32 border-t border-border/30">
          <div className="px-2 md:px-4 lg:px-8 xl:px-32 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary font-mono">开启可视化之旅</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-6">
              8分钟，<span className="text-primary">全面诊断</span>
              <br />
              <span className="text-muted-foreground">可视化成熟度</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              完成VCMA诊断问卷，获取专属可视化提升方案和投资回报预测
            </p>
            
            <a
              href="#diagnosis"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 group"
            >
              <span className="font-medium">免费诊断（8分钟）</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
