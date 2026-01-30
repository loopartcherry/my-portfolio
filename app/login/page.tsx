"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/providers/lang-provider";
import { getT } from "@/lib/i18n";
import { Mail, Lock, Phone, Eye, EyeOff, Github, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const router = useRouter();
  const { lang } = useLang();
  const T = getT(lang);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string }>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSendCode = () => {
    if (!phone || phone.length < 11) {
      setErrors({ ...errors, phone: T.loginPage.errorPhone });
      return;
    }
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateEmail(email)) {
      setErrors({ email: T.loginPage.errorInvalidEmail });
      return;
    }
    if (password.length < 6) {
      setErrors({ password: T.loginPage.errorPasswordMin });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error?.message || (lang === "zh" ? "登录失败，请重试" : "Login failed. Please try again.");
        setErrors({ email: msg });
        return;
      }

      const role = data?.data?.role;
      if (role === "admin") router.push("/admin/overview");
      else if (role === "designer") router.push("/designer/overview");
      else router.push("/dashboard/overview");
    } catch {
      setErrors({ email: lang === "zh" ? "网络错误，请重试" : "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: CheckCircle2, text: T.loginPage.feature1 },
    { icon: CheckCircle2, text: T.loginPage.feature2 },
    { icon: CheckCircle2, text: T.loginPage.feature3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen pt-0">
        {/* Left - Brand Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />

          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,108,46,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,108,46,0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-center px-16 xl:px-24">
            {/* Logo */}
            <div className="mb-12">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-2xl font-light tracking-wider">SPIRAL</span>
              </Link>
            </div>

            {/* Headline */}
            <h1 className="text-4xl xl:text-5xl font-extralight leading-tight mb-6">
              <span className="text-foreground/90">{T.loginPage.headlineA}</span>
              <br />
              <span className="text-primary">{T.loginPage.headlineB}</span>
            </h1>

            <p className="text-lg text-muted-foreground/70 font-light mb-12 max-w-md">
              {T.loginPage.subline}
            </p>

            {/* Features */}
            <div className="space-y-4 mb-16">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <feature.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground/80 font-light">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="border-l-2 border-primary/30 pl-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-muted-foreground/60">{T.loginPage.testimonial}</p>
            </div>
          </div>
        </div>

        {/* Right - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-light mb-3">{T.loginPage.welcomeBack}</h2>
              <p className="text-muted-foreground/70">{T.loginPage.loginDesc}</p>
            </div>

            {/* Login Tabs */}
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-secondary/30">
                <TabsTrigger value="email" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  {T.loginPage.emailLogin}
                </TabsTrigger>
                <TabsTrigger value="phone" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  {T.loginPage.phoneLogin}
                </TabsTrigger>
              </TabsList>

              {/* Email Login */}
              <TabsContent value="email">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-muted-foreground">
                      {T.loginPage.emailAddress}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-secondary/20 border-border/30 focus:border-primary/50"
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm text-muted-foreground">
                      {T.loginPage.password}
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={T.loginPage.enterPassword}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-secondary/20 border-border/30 focus:border-primary/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                      <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        {T.loginPage.rememberMe}
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                      {T.loginPage.forgotPassword}
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        {T.loginPage.login}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Phone Login */}
              <TabsContent value="phone">
                <form className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm text-muted-foreground">
                      {T.loginPage.phoneNumber}
                    </Label>
                    <div className="relative flex gap-2">
                      <div className="flex items-center px-3 bg-secondary/20 border border-border/30 rounded-md text-sm text-muted-foreground">
                        +86
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={T.loginPage.enterPhone}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10 bg-secondary/20 border-border/30 focus:border-primary/50"
                        />
                      </div>
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-sm text-muted-foreground">
                      {T.loginPage.verifyCode}
                    </Label>
                    <div className="flex gap-3">
                      <Input
                        id="code"
                        type="text"
                        placeholder={T.loginPage.enterCode}
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        className="flex-1 bg-secondary/20 border-border/30 focus:border-primary/50"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSendCode}
                        disabled={countdown > 0}
                        className="px-4 border-primary/30 text-primary hover:bg-primary/10"
                      >
                        {countdown > 0 ? `${countdown}s` : T.loginPage.sendCode}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        {T.loginPage.login}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm text-muted-foreground/50 bg-background">{T.loginPage.or}</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-11 border-border/30 hover:border-green-500/50 hover:bg-green-500/5 bg-transparent" variant="outline">
                <svg className="w-5 h-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z" />
                </svg>
                {T.loginPage.wechatLogin}
              </Button>
              <Button className="h-11 border-border/30 hover:border-foreground/50 hover:bg-foreground/5 bg-transparent" variant="outline">
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </Button>
            </div>

            {/* Register Link */}
            <p className="text-center mt-8 text-sm text-muted-foreground">
              {T.loginPage.noAccount}
              <Link href="/register" className="text-primary hover:text-primary/80 ml-1 transition-colors">
                {T.loginPage.registerNow}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

