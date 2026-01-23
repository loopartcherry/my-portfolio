"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { 
  FileText, Palette, ImageIcon, CheckCircle, ArrowLeft, ArrowRight,
  Upload, Save, X, Check, AlertCircle, Info, Plus, Trash2,
  Eye, Link as LinkIcon,   Home, FolderKanban, CreditCard,
  Headphones, Users, Settings, BookOpen, Gift, MessageCircle,
  Paintbrush, Code, Monitor, BarChart3, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { mainNav, otherNav } from "@/lib/dashboard-nav";

// Steps
const steps = [
  { id: 1, name: "基本信息", icon: FileText },
  { id: 2, name: "设计需求", icon: Palette },
  { id: 3, name: "参考资料", icon: ImageIcon },
  { id: 4, name: "确认提交", icon: CheckCircle },
];

// Design categories
const categories = [
  { 
    id: "brand", 
    name: "百维赋", 
    subtitle: "品牌可视化", 
    icon: Paintbrush,
    desc: "Logo、VI、品牌手册、海报、名片",
    forms: ["Logo设计", "VI设计", "品牌手册", "海报设计", "名片设计", "PPT模板"]
  },
  { 
    id: "tech", 
    name: "万维图", 
    subtitle: "技术可视化", 
    icon: Code,
    desc: "产品架构图、技术流程图、系统拓扑图",
    forms: ["产品架构图", "技术流程图", "系统拓扑图", "信息架构图"]
  },
  { 
    id: "product", 
    name: "千维镜", 
    subtitle: "产品可视化", 
    icon: Monitor,
    desc: "产品原型、UI设计、交互设计",
    forms: ["产品原型", "UI设计", "交互设计", "图标设计"]
  },
  { 
    id: "data", 
    name: "数维观", 
    subtitle: "数据可视化", 
    icon: BarChart3,
    desc: "数据大屏、可视化图表、BI报表",
    forms: ["数据大屏", "可视化图表", "BI报表", "信息图表"]
  },
];

// Audience options
const audienceOptions = [
  "年轻人（18-30岁）", "中年人（30-50岁）", "企业客户（B2B）",
  "普通消费者（B2C）", "技术人员", "管理层"
];

// Style options
const styleOptions = [
  "现代简约", "复古怀旧", "科技未来", "自然清新",
  "商务专业", "活泼可爱", "高端奢华", "艺术创意",
  "工业风格", "中国风"
];

// Preset colors
const presetColors = [
  "#FF6C2E", "#9666FF", "#3B82F6", "#10B981", "#F59E0B",
  "#EF4444", "#EC4899", "#8B5CF6", "#06B6D4", "#84CC16",
  "#F97316", "#14B8A6", "#6366F1", "#A855F7", "#0EA5E9",
  "#22C55E", "#FACC15", "#F43F5E", "#64748B", "#0F172A"
];

const DRAFT_KEY = "project_draft";

export default function NewProjectPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSupport, setShowSupport] = useState(false);
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Form data
  const [formData, setFormData] = useState({
    // Step 1
    projectName: "",
    category: "",
    designForm: "",
    deadline: "",
    // Step 2
    description: "",
    audience: [] as string[],
    styles: [] as string[],
    colors: [] as string[],
    keywords: [] as string[],
    specialRequirements: "",
    // Step 3
    files: [] as { name: string; size: number; preview?: string }[],
    referenceLinks: [""],
    referenceNote: "",
    // Step 4
    confirmed: false,
  });

  const [keywordInput, setKeywordInput] = useState("");

  // Check for draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      setShowDraftDialog(true);
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);
    return () => clearInterval(interval);
  }, [formData]);

  const saveDraft = useCallback(() => {
    setSaving(true);
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      ...formData,
      savedAt: new Date().toISOString()
    }));
    setTimeout(() => {
      setSaving(false);
      setLastSaved(new Date().toLocaleTimeString());
    }, 500);
  }, [formData]);

  const loadDraft = () => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const data = JSON.parse(draft);
      setFormData(data);
      setShowDraftDialog(false);
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY);
    setShowDraftDialog(false);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.projectName || formData.projectName.length < 5) {
        newErrors.projectName = "项目名称至少5个字符";
      }
      if (formData.projectName.length > 50) {
        newErrors.projectName = "项目名称不超过50个字符";
      }
      if (!formData.category) {
        newErrors.category = "请选择设计类别";
      }
      if (!formData.designForm) {
        newErrors.designForm = "请选择具体设计形式";
      }
    }
    
    if (step === 2) {
      if (!formData.description || formData.description.length < 200) {
        newErrors.description = "需求描述至少200字";
      }
    }
    
    if (step === 4) {
      if (!formData.confirmed) {
        newErrors.confirmed = "请确认信息无误";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        saveDraft();
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      // Submit logic here
      localStorage.removeItem(DRAFT_KEY);
      window.location.href = "/dashboard/projects";
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && formData.keywords.length < 5) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()]
      });
      setKeywordInput("");
    }
  };

  const removeKeyword = (index: number) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== index)
    });
  };

  const toggleColor = (color: string) => {
    if (formData.colors.includes(color)) {
      setFormData({
        ...formData,
        colors: formData.colors.filter(c => c !== color)
      });
    } else if (formData.colors.length < 3) {
      setFormData({
        ...formData,
        colors: [...formData.colors, color]
      });
    }
  };

  const addReferenceLink = () => {
    setFormData({
      ...formData,
      referenceLinks: [...formData.referenceLinks, ""]
    });
  };

  const updateReferenceLink = (index: number, value: string) => {
    const links = [...formData.referenceLinks];
    links[index] = value;
    setFormData({ ...formData, referenceLinks: links });
  };

  const removeReferenceLink = (index: number) => {
    setFormData({
      ...formData,
      referenceLinks: formData.referenceLinks.filter((_, i) => i !== index)
    });
  };

  const selectedCategory = categories.find(c => c.id === formData.category);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex" data-dashboard>
      {/* Left Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-60 bg-[#0d0d14] border-r border-white/5 flex-col z-40">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-lg font-light tracking-wider">
            <span className="text-primary">SPIRAL</span>
            <span className="text-white/40">.VISION</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard/projects";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary border-l-2 border-primary" 
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="my-4 border-t border-white/5" />
          {otherNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onMouseEnter={() => setShowSupport(true)}
            onMouseLeave={() => setShowSupport(false)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 hover:bg-white/5 transition-all duration-200 text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{showSupport ? "在线客服 24/7" : "联系客服"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-60 pb-24">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Link href="/dashboard/projects" className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">返回项目列表</span>
            </Link>
            <h1 className="text-base md:text-lg font-light text-white/90 truncate">新建项目</h1>
            {lastSaved && (
              <span className="hidden md:inline text-xs text-white/30">
                {saving ? "保存中..." : `已保存 ${lastSaved}`}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/dashboard/notifications" className="relative p-2 text-white/40 hover:text-white/80 transition-colors">
              <Bell className="w-5 h-5" />
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center text-xs font-medium text-white">
              张
            </div>
          </div>
        </header>

        {/* Form Container */}
        <div className="px-4 sm:px-6 md:px-8 py-8 md:py-12 w-full">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-10 md:mb-16 overflow-x-auto pb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                      isCompleted ? "bg-green-500/20 text-green-400" :
                      isActive ? "bg-primary/20 text-primary scale-110" :
                      "bg-white/5 text-white/30"
                    )}>
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={cn(
                      "mt-3 text-xs font-medium transition-colors",
                      isActive ? "text-primary" : isCompleted ? "text-green-400" : "text-white/30"
                    )}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-12 sm:w-24 h-px mx-2 sm:mx-4 transition-colors shrink-0",
                      currentStep > step.id ? "bg-green-500/50" : "bg-white/10"
                    )} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="text-lg md:text-xl font-light text-white mb-2">项目基本信息</h2>
                <p className="text-white/40 text-sm">请填写项目的基础信息</p>
              </div>

              {/* Project Name */}
              <div className="space-y-3">
                <Label className="text-white/70">项目名称 <span className="text-primary">*</span></Label>
                <Input
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  placeholder="例如：企业品牌 Logo 设计"
                  className="h-12 bg-[#12121a] border-white/10 text-white placeholder:text-white/20"
                />
                <div className="flex justify-between text-xs">
                  <span className={errors.projectName ? "text-red-400" : "text-white/30"}>
                    {errors.projectName || "项目名称将在后台显示"}
                  </span>
                  <span className="text-white/30">{formData.projectName.length} / 50</span>
                </div>
              </div>

              {/* Category Cards */}
              <div className="space-y-3">
                <Label className="text-white/70">设计类别 <span className="text-primary">*</span></Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = formData.category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id, designForm: "" })}
                        className={cn(
                          "relative p-6 rounded-xl border text-left transition-all duration-200",
                          isSelected 
                            ? "border-primary bg-primary/5" 
                            : "border-white/10 hover:border-white/20 bg-[#12121a]"
                        )}
                      >
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                          isSelected ? "bg-primary/20" : "bg-white/5"
                        )}>
                          <Icon className={cn("w-6 h-6", isSelected ? "text-primary" : "text-white/40")} />
                        </div>
                        <h3 className="text-base md:text-lg font-medium text-white mb-1">{cat.name}</h3>
                        <p className="text-sm text-white/40 mb-2">{cat.subtitle}</p>
                        <p className="text-xs text-white/30">{cat.desc}</p>
                      </button>
                    );
                  })}
                </div>
                {errors.category && <p className="text-xs text-red-400">{errors.category}</p>}
              </div>

              {/* Design Form Select */}
              <div className="space-y-3">
                <Label className="text-white/70">具体设计形式 <span className="text-primary">*</span></Label>
                <Select
                  value={formData.designForm}
                  onValueChange={(value) => setFormData({ ...formData, designForm: value })}
                  disabled={!formData.category}
                >
                  <SelectTrigger className="h-12 bg-[#12121a] border-white/10 text-white">
                    <SelectValue placeholder={formData.category ? "请选择设计形式" : "请先选择设计类别"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a24] border-white/10">
                    {selectedCategory?.forms.map((form) => (
                      <SelectItem key={form} value={form} className="text-white/80 focus:bg-white/10">
                        {form}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.designForm && <p className="text-xs text-red-400">{errors.designForm}</p>}
              </div>

              {/* Deadline */}
              <div className="space-y-3">
                <Label className="text-white/70">期望交付时间（可选）</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  min={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="h-12 bg-[#12121a] border-white/10 text-white"
                />
                <p className="text-xs text-white/30">平均交付时间为 48 小时，如无特殊要求可不填</p>
              </div>
            </div>
          )}

          {/* Step 2: Design Requirements */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="text-lg md:text-xl font-light text-white mb-2">详细设计需求</h2>
                <p className="text-white/40 text-sm">请详细描述您的需求，越详细越能帮助设计师理解</p>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <Label className="text-white/70">需求描述 <span className="text-primary">*</span></Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={`请详细描述您的设计需求，包括：\n\n1. 设计目标和用途\n2. 目标受众是谁\n3. 想要传达的信息或理念\n4. 风格偏好（如现代、复古、科技感等）\n5. 颜色偏好\n6. 其他特殊要求`}
                  className="min-h-[200px] bg-[#12121a] border-white/10 text-white placeholder:text-white/20 resize-none"
                />
                <div className="flex justify-between text-xs">
                  <span className={errors.description ? "text-red-400" : "text-white/30"}>
                    {errors.description || "建议至少 200 字，描述越详细效果越好"}
                  </span>
                  <span className={cn(
                    formData.description.length >= 200 ? "text-green-400" : "text-white/30"
                  )}>{formData.description.length} / 2000</span>
                </div>
              </div>

              {/* Audience */}
              <div className="space-y-3">
                <Label className="text-white/70">目标受众（可选）</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {audienceOptions.map((option) => (
                    <label
                      key={option}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                        formData.audience.includes(option)
                          ? "border-primary/50 bg-primary/5"
                          : "border-white/10 hover:border-white/20 bg-[#12121a]"
                      )}
                    >
                      <Checkbox
                        checked={formData.audience.includes(option)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, audience: [...formData.audience, option] });
                          } else {
                            setFormData({ ...formData, audience: formData.audience.filter(a => a !== option) });
                          }
                        }}
                        className="border-white/20"
                      />
                      <span className="text-sm text-white/70">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Styles */}
              <div className="space-y-3">
                <Label className="text-white/70">风格偏好（可选）</Label>
                <div className="flex flex-wrap gap-2">
                  {styleOptions.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => {
                        if (formData.styles.includes(style)) {
                          setFormData({ ...formData, styles: formData.styles.filter(s => s !== style) });
                        } else {
                          setFormData({ ...formData, styles: [...formData.styles, style] });
                        }
                      }}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-colors",
                        formData.styles.includes(style)
                          ? "bg-primary text-white"
                          : "bg-white/5 text-white/50 hover:bg-white/10"
                      )}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <Label className="text-white/70">颜色偏好（可选，最多3个）</Label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={cn(
                        "w-10 h-10 rounded-lg transition-all",
                        formData.colors.includes(color) && "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f]"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {formData.colors.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {formData.colors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5"
                      >
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                        <span className="text-xs text-white/50">{color}</span>
                        <button onClick={() => toggleColor(color)} className="text-white/30 hover:text-white/60">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Keywords */}
              <div className="space-y-3">
                <Label className="text-white/70">品牌关键词（可选，最多5个）</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                    placeholder="输入关键词后按回车添加，如：创新、专业、可信赖"
                    className="flex-1 h-12 bg-[#12121a] border-white/10 text-white placeholder:text-white/20"
                    disabled={formData.keywords.length >= 5}
                  />
                  <Button
                    type="button"
                    onClick={addKeyword}
                    disabled={formData.keywords.length >= 5 || !keywordInput.trim()}
                    className="h-12 px-4 bg-white/10 hover:bg-white/20 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm"
                      >
                        {keyword}
                        <button onClick={() => removeKeyword(index)} className="hover:text-white">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Requirements */}
              <div className="space-y-3">
                <Label className="text-white/70">特殊要求（可选）</Label>
                <Textarea
                  value={formData.specialRequirements}
                  onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                  placeholder="如有其他特殊要求或限制，请在此说明"
                  className="min-h-[100px] bg-[#12121a] border-white/10 text-white placeholder:text-white/20 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 3: Reference Materials */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="text-lg md:text-xl font-light text-white mb-2">上传参考资料</h2>
                <p className="text-white/40 text-sm">上传参考图片或文档，帮助设计师更好地理解需求（可选）</p>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <Label className="text-white/70">参考图片上传</Label>
                <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 mb-2">拖放图片到这里，或点击选择文件</p>
                  <p className="text-xs text-white/30">支持 JPG、PNG、GIF，单个文件不超过 10MB</p>
                </div>
                {formData.files.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
                    {formData.files.map((file, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden bg-white/5 aspect-square">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText className="w-8 h-8 text-white/20" />
                        </div>
                        <button
                          onClick={() => setFormData({
                            ...formData,
                            files: formData.files.filter((_, i) => i !== index)
                          })}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60">
                          <p className="text-xs text-white/70 truncate">{file.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reference Links */}
              <div className="space-y-3">
                <Label className="text-white/70">参考链接（可选）</Label>
                <div className="space-y-2">
                  {formData.referenceLinks.map((link, index) => (
                    <div key={index} className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <Input
                          value={link}
                          onChange={(e) => updateReferenceLink(index, e.target.value)}
                          placeholder="如果有参考网站或作品链接，请粘贴在此"
                          className="h-12 pl-12 bg-[#12121a] border-white/10 text-white placeholder:text-white/20"
                        />
                      </div>
                      {formData.referenceLinks.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => removeReferenceLink(index)}
                          className="h-12 px-3 text-white/30 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={addReferenceLink}
                  className="text-white/50 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  添加更多链接
                </Button>
              </div>

              {/* Reference Note */}
              <div className="space-y-3">
                <Label className="text-white/70">补充说明（可选）</Label>
                <Textarea
                  value={formData.referenceNote}
                  onChange={(e) => setFormData({ ...formData, referenceNote: e.target.value })}
                  placeholder="对参考资料的补充说明，如：喜欢某个参考的配色方案，但不喜欢字体等"
                  className="min-h-[100px] bg-[#12121a] border-white/10 text-white placeholder:text-white/20 resize-none"
                />
              </div>

              {/* Info Card */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="text-sm text-white/60 space-y-1">
                    <p>参考资料非必需，但可以帮助设计师更准确理解您的需求</p>
                    <p>可以上传喜欢的设计作品、竞品截图等</p>
                    <p>也可以上传公司现有素材，如旧版 Logo、品牌色等</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirm */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center mb-10 md:mb-12">
                <h2 className="text-lg md:text-xl font-light text-white mb-2">确认并提交</h2>
                <p className="text-white/40 text-sm">请仔细检查以下信息，提交后可在项目详情中修改</p>
              </div>

              {/* Summary Cards */}
              <div className="space-y-4">
                {/* Basic Info */}
                <div className="p-4 sm:p-6 rounded-xl bg-[#12121a] border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white/80">基本信息</h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="text-white/40 hover:text-primary h-8">
                      编辑
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/40 mb-1">项目名称</p>
                      <p className="text-white/80">{formData.projectName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-1">设计类别</p>
                      <p className="text-white/80">{selectedCategory?.name} · {selectedCategory?.subtitle}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-1">设计形式</p>
                      <p className="text-white/80">{formData.designForm || "-"}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-1">期望交付时间</p>
                      <p className="text-white/80">{formData.deadline || "无特殊要求"}</p>
                    </div>
                  </div>
                </div>

                {/* Design Requirements */}
                <div className="p-6 rounded-xl bg-[#12121a] border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white/80">设计需求</h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="text-white/40 hover:text-primary h-8">
                      编辑
                    </Button>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-white/40 mb-1">需求描述</p>
                      <p className="text-white/60 line-clamp-3">{formData.description || "-"}</p>
                    </div>
                    {formData.audience.length > 0 && (
                      <div>
                        <p className="text-white/40 mb-2">目标受众</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.audience.map(a => (
                            <span key={a} className="px-2 py-1 rounded bg-white/5 text-white/60 text-xs">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.styles.length > 0 && (
                      <div>
                        <p className="text-white/40 mb-2">风格偏好</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.styles.map(s => (
                            <span key={s} className="px-2 py-1 rounded bg-white/5 text-white/60 text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {formData.colors.length > 0 && (
                      <div>
                        <p className="text-white/40 mb-2">颜色偏好</p>
                        <div className="flex gap-2">
                          {formData.colors.map(c => (
                            <div key={c} className="w-6 h-6 rounded" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reference Materials */}
                <div className="p-4 sm:p-6 rounded-xl bg-[#12121a] border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white/80">参考资料</h3>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)} className="text-white/40 hover:text-primary h-8">
                      编辑
                    </Button>
                  </div>
                  <div className="text-sm">
                    <p className="text-white/60">
                      {formData.files.length > 0 ? `已上传 ${formData.files.length} 个文件` : "未上传文件"}
                    </p>
                    {formData.referenceLinks.filter(l => l).length > 0 && (
                      <p className="text-white/60 mt-2">
                        {formData.referenceLinks.filter(l => l).length} 个参考链接
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                  <div className="text-sm text-white/70 space-y-1">
                    <p className="font-medium text-orange-400">提交后的流程：</p>
                    <p>1. 我们将在 24 小时内为您分配专业设计师</p>
                    <p>2. 设计师会主动联系您确认需求细节</p>
                    <p>3. 您可以随时在项目详情中查看进度和沟通</p>
                  </div>
                </div>
              </div>

              {/* Quota Warning */}
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-sm text-white/60">
                  当前配额：已使用 <span className="text-primary">1/2</span> 个并发项目
                </p>
                <p className="text-xs text-white/40 mt-1">
                  提交此项目后，您的配额将被占用，直到项目完成
                </p>
              </div>

              {/* Confirm Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={formData.confirmed}
                  onCheckedChange={(checked) => setFormData({ ...formData, confirmed: checked as boolean })}
                  className="border-white/20"
                />
                <span className="text-sm text-white/70">我已仔细检查以上信息，确认无误</span>
              </label>
              {errors.confirmed && <p className="text-xs text-red-400">{errors.confirmed}</p>}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 md:left-60 right-0 h-20 bg-[#0d0d14]/95 backdrop-blur-xl border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-8 py-3 sm:py-0 z-30">
          <div>
            {currentStep > 1 && (
              <Button
                variant="ghost"
                onClick={handlePrev}
                className="text-white/60 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-white/40">
            <span>第 {currentStep} 步，共 4 步</span>
            <Progress value={(currentStep / 4) * 100} className="w-16 sm:w-24 h-1 bg-white/10" />
            <span>{Math.round((currentStep / 4) * 100)}%</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Button
              variant="ghost"
              onClick={saveDraft}
              className="text-white/50 hover:text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              保存草稿
            </Button>
            {currentStep < 4 ? (
              <Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white">
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.confirmed}
                className="bg-primary hover:bg-primary/90 text-white disabled:opacity-50"
              >
                提交项目
                <Check className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>

      {/* Draft Recovery Dialog */}
      <Dialog open={showDraftDialog} onOpenChange={setShowDraftDialog}>
        <DialogContent className="bg-[#1a1a24] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>发现未完成的草稿</DialogTitle>
            <DialogDescription className="text-white/50">
              检测到您有未完成的项目草稿，是否继续编辑？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={clearDraft} className="text-white/50 hover:text-white">
              重新开始
            </Button>
            <Button onClick={loadDraft} className="bg-primary hover:bg-primary/90">
              继续编辑
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
