"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  Loader2,
  Calculator,
  Target,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Headphones,
} from "lucide-react";

const analysisSteps = [
  { icon: Loader2, text: "正在分析您的诊断数据...", duration: 2000 },
  { icon: Calculator, text: "正在计算 4 维度成熟度等级...", duration: 2000 },
  { icon: Target, text: "正在匹配最佳解决方案...", duration: 2000 },
  { icon: FileText, text: "正在生成您的专属诊断报告...", duration: 2000 },
  { icon: CheckCircle, text: "分析完成！即将展示结果...", duration: 1000 },
];

const stats = [
  "已为 10,528 家企业提供诊断服务",
  "85% 的企业发现了关键短板",
  "平均投资回报率（ROI）达 650%",
  "诊断后 3 个月内商业指标改善 40%+",
];

export default function DiagnosisAnalyzingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentStat, setCurrentStat] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if we have answers
    const answers = localStorage.getItem("vcma_answers");
    if (!answers) {
      router.push("/diagnosis");
      return;
    }

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 90);

    // Step animation
    let stepTimeout: NodeJS.Timeout;
    const runSteps = (stepIndex: number) => {
      if (stepIndex >= analysisSteps.length) {
        // Navigate to results with diagnosis ID
        const diagnosisId = localStorage.getItem("vcma_diagnosis_id");
        setTimeout(() => {
          router.push(`/diagnosis/results${diagnosisId ? `?id=${diagnosisId}` : ""}`);
        }, 500);
        return;
      }

      setCurrentStep(stepIndex);
      stepTimeout = setTimeout(() => {
        runSteps(stepIndex + 1);
      }, analysisSteps[stepIndex].duration);
    };

    runSteps(0);

    // Stats rotation
    const statsInterval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statsInterval);
      clearTimeout(stepTimeout);
    };
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] flex items-center justify-center p-6" data-diagnosis>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-light text-white mb-3">诊断分析失败</h1>
          <p className="text-white/50 mb-8">请稍后重试或联系客服</p>
          <div className="flex gap-4justify-center">
            <Button
              variant="outline"
              onClick={() => router.push("/diagnosis")}
              className="border-white/20 text-white/60 hover:bg-white/5 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重新诊断
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Headphones className="w-4 h-4 mr-2" />
              联系客服
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const CurrentIcon = analysisSteps[currentStep]?.icon || Loader2;
  const isComplete = currentStep === analysisSteps.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#12121a] to-[#0a0a0f] flex items-center justify-center p-6 relative overflow-hidden" data-diagnosis>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-lg w-full text-center relative z-10">
        {/* Main Animation */}
        <div className="relative mb-12">
          {/* Pulsing rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-accent/20 animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }} />
          </div>
          
          {/* Main icon */}
          <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center relative ${
            isComplete ? "bg-green-500/20" : "bg-gradient-to-br from-primary/20 to-accent/20"
          }`}>
            <Brain className={`w-14 h-14 ${isComplete ? "text-green-500" : "text-primary"} ${!isComplete ? "animate-pulse" : ""}`} />
          </div>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <CurrentIcon className={`w-5 h-5 ${isComplete ? "text-green-500" : "text-primary"} ${currentStep < 4 ? "animate-spin" : ""}`} />
          <span className={`text-lg font-light ${isComplete ? "text-green-500" : "text-white"}`}>
            {analysisSteps[currentStep]?.text}
          </span>
        </div>

        {/* Progress */}
        <div className="max-w-sm mx-auto mb-4">
          <div className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4">
            {Math.min(progress, 100)}%
          </div>
          <Progress 
            value={progress} 
            className="h-2 bg-white/10"
          />
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {analysisSteps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < currentStep
                  ? "bg-green-500"
                  : i === currentStep
                  ? "bg-primary w-4"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Stats rotation */}
        <div className="h-8 relative overflow-hidden">
          {stats.map((stat, i) => (
            <p
              key={stat}
              className={`absolute inset-x-0 text-sm text-white/40 transition-all duration-500 ${
                i === currentStat
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {stat}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

