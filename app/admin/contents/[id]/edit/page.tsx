"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  Trash2,
  Upload,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RichTextEditor } from "@/components/admin/contents/rich-text-editor";
import { SeoPanel } from "@/components/admin/contents/seo-panel";
import { PublishPanel } from "@/components/admin/contents/publish-panel";
import {
  useContentDetail,
  useContentCategories,
  useCreateContent,
  useUpdateContent,
  usePublishContent,
  useDeleteContent,
  useUploadContentImage,
  type ContentStatus,
} from "@/hooks/use-contents";
import { cn } from "@/lib/utils";

const titleMax = 100;

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fa5-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "untitled";
}

export default function ContentEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNew = id === "new";

  const { data: detailRes, isLoading } = useContentDetail(isNew ? null : id);
  const { data: categoriesRes } = useContentCategories();
  const createMutation = useCreateContent();
  const updateMutation = useUpdateContent();
  const publishMutation = usePublishContent();
  const deleteMutation = useDeleteContent();
  const uploadImage = useUploadContentImage();

  const categories = categoriesRes?.data ?? [];
  const content = detailRes?.data;

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentBody, setContentBody] = useState("");
  const [contentFormat, setContentFormat] = useState<"html" | "markdown">("markdown");
  const [featuredImage, setFeaturedImage] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"article" | "case_study" | "faq" | "page">("article");
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [publishedAt, setPublishedAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [enableExpires, setEnableExpires] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredOrder, setFeaturedOrder] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [categoryKeyword, setCategoryKeyword] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (content) {
      setTitle(content.title ?? "");
      setSubtitle(content.subtitle ?? "");
      setExcerpt(content.excerpt ?? "");
      setContentBody(content.content ?? "");
      setContentFormat((content.contentFormat as "html" | "markdown") || "markdown");
      setFeaturedImage(content.featuredImage ?? "");
      setSlug(content.slug ?? "");
      setType((content.type as any) ?? "article");
      setStatus((content.status as ContentStatus) ?? "draft");
      setPublishedAt(content.publishedAt ? new Date(content.publishedAt).toISOString() : "");
      setExpiresAt(content.expiresAt ? new Date(content.expiresAt).toISOString() : "");
      setEnableExpires(!!content.expiresAt);
      setIsFeatured(content.isFeatured ?? false);
      setFeaturedOrder(content.featuredOrder ?? 0);
      setCategoryId(content.category?.id ?? "");
      setCategoryKeyword(content.categoryKeyword ?? "");
      setTags((content.tags as string[]) ?? []);
      const seo = content.seo as { metaTitle?: string; metaDescription?: string; keywords?: string } | null;
      setMetaTitle(seo?.metaTitle ?? "");
      setMetaDescription(seo?.metaDescription ?? "");
      setKeywords(seo?.keywords ?? "");
    }
  }, [content]);

  useEffect(() => {
    if (isNew && title && !slug) setSlug(slugify(title));
  }, [isNew, title, slug]);

  const handleImageSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
      try {
        const res = await uploadImage.mutateAsync(f);
        if (res?.data?.url) setFeaturedImage(res.data.url);
      } catch {
        setImageFile(null);
        setImagePreview("");
      }
    },
    [uploadImage]
  );

  const removeImage = () => {
    setFeaturedImage("");
    setImageFile(null);
    setImagePreview("");
  };

  const saveDraft = async () => {
    const payload = {
      slug: slug || slugify(title) || "untitled",
      type,
      title,
      subtitle: subtitle || undefined,
      excerpt: excerpt || undefined,
      content: contentBody,
      contentFormat,
      featuredImage: featuredImage || undefined,
      categoryKeyword: categoryKeyword || undefined,
      categoryId: categoryId || undefined,
      tags: tags.length ? tags : undefined,
      seo: { metaTitle, metaDescription, keywords },
      status: "draft" as ContentStatus,
      isFeatured,
      featuredOrder,
      expiresAt: enableExpires && expiresAt ? expiresAt : undefined,
    };

    try {
      if (isNew) {
        const res = await createMutation.mutateAsync(payload as any);
        router.replace(`/admin/contents/${res.data.id}/edit`);
      } else {
        await updateMutation.mutateAsync({
          id,
          data: { ...payload, status: "draft", changeNote: "保存草稿" },
        });
      }
    } catch {}
  };

  const publish = async () => {
    const payload = {
      slug: slug || slugify(title) || "untitled",
      type,
      title,
      subtitle: subtitle || undefined,
      excerpt: excerpt || undefined,
      content: contentBody,
      contentFormat,
      featuredImage: featuredImage || undefined,
      categoryKeyword: categoryKeyword || undefined,
      categoryId: categoryId || undefined,
      tags: tags.length ? tags : undefined,
      seo: { metaTitle, metaDescription, keywords },
      status: "published" as ContentStatus,
      isFeatured,
      featuredOrder,
      publishedAt: publishedAt || new Date().toISOString(),
      expiresAt: enableExpires && expiresAt ? expiresAt : undefined,
    };

    try {
      if (isNew) {
        const res = await createMutation.mutateAsync({
          ...payload,
          status: "published",
          publishedAt: publishedAt || new Date().toISOString(),
        } as any);
        router.replace(`/admin/contents/${res.data.id}/edit`);
        return;
      }
      await updateMutation.mutateAsync({
        id,
        data: { ...payload, status: "published", changeNote: "发布" },
      });
      await publishMutation.mutateAsync({
        id,
        status: "published",
        publishedAt: publishedAt || new Date().toISOString(),
      });
    } catch {}
  };

  const handleDelete = async () => {
    if (!confirm("确定删除这篇内容？")) return;
    try {
      await deleteMutation.mutateAsync(id);
      router.push("/admin/contents");
    } catch {}
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        saveDraft();
      }
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        publish();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!isNew && isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Skeleton className="h-96 w-full max-w-4xl" />
      </div>
    );
  }

  if (!isNew && !content) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Card className="bg-[#12121a] border-white/5 p-8 text-center">
          <p className="text-white/60 mb-4">内容不存在</p>
          <Button asChild variant="outline" className="border-white/10">
            <Link href="/admin/contents">返回列表</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="flex-1 w-full md:ml-60">
        <div className="p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Button asChild variant="ghost" size="sm" className="text-white/60 hover:text-white">
              <Link href="/admin/contents" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                返回列表
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-white/10 text-white/60 hover:text-white"
                onClick={saveDraft}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                保存草稿
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={publish}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                <Send className="w-4 h-4 mr-2" />
                发布
              </Button>
              {!isNew && (
                <Button
                  variant="outline"
                  className="border-white/10 text-white/60 hover:text-white"
                  asChild
                >
                  <Link href={`/admin/contents/${id}/preview`}>
                    <Eye className="w-4 h-4 mr-2" />
                    预览
                  </Link>
                </Button>
              )}
              {!isNew && (
                <Button
                  variant="outline"
                  className="border-white/10 text-white/60 hover:text-white"
                  asChild
                >
                  <Link href={`/admin/contents/${id}/history`}>
                    版本历史
                  </Link>
                </Button>
              )}
              {!isNew && (
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  删除
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#12121a] border-white/5 p-4 space-y-4">
                <h3 className="font-semibold text-white">基本信息</h3>
                <div>
                  <Label className="text-white/80">标题 *</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="如：2024设计趋势"
                    className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                    maxLength={titleMax}
                  />
                  <p className="text-xs text-white/40 mt-1">
                    字数：{title.length}/{titleMax}
                  </p>
                </div>
                <div>
                  <Label className="text-white/80">副标题</Label>
                  <Input
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="可选"
                    className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80">URL Slug</Label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="如：design-trends-2024"
                    className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/80">文章类型 *</Label>
                  <div className="flex gap-4 mt-2">
                    {(["article", "case_study", "faq", "page"] as const).map((t) => (
                      <label key={t} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          checked={type === t}
                          onChange={() => setType(t)}
                          className="rounded-full border-white/20 bg-[#0a0a0f] text-primary"
                        />
                        <span className="text-sm text-white/80">
                          {t === "article" ? "文章" : t === "case_study" ? "案例" : t === "faq" ? "FAQ" : "页面"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>

              <Card className="bg-[#12121a] border-white/5 p-4 space-y-4">
                <h3 className="font-semibold text-white">摘要 *</h3>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="最多 200 字，用于列表展示"
                  maxLength={200}
                  className="bg-[#0a0a0f] border-white/10 text-white resize-none"
                  rows={3}
                />
                <p className="text-xs text-white/40">字数：{excerpt.length}/200</p>
              </Card>

              <Card className="bg-[#12121a] border-white/5 p-4 space-y-4">
                <h3 className="font-semibold text-white">特色配图</h3>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="featured-upload"
                  />
                  <label htmlFor="featured-upload" className="cursor-pointer block">
                    <Upload className="w-10 h-10 mx-auto text-white/40 mb-2" />
                    <p className="text-sm text-white/60">点击上传或拖拽图片</p>
                    <p className="text-xs text-white/40 mt-1">建议 1920×1080，JPG/PNG</p>
                  </label>
                </div>
                {(imagePreview || featuredImage) && (
                  <div className="relative inline-block">
                    <div className="relative w-48 h-28 rounded overflow-hidden bg-[#0a0a0f]">
                      <Image
                        src={imagePreview || featuredImage}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline" className="border-white/10" onClick={removeImage}>
                        <X className="w-4 h-4 mr-1" /> 删除
                      </Button>
                    </div>
                  </div>
                )}
              </Card>

              <Card className="bg-[#12121a] border-white/5 p-4 space-y-4">
                <h3 className="font-semibold text-white">文章内容 *</h3>
                <RichTextEditor
                  value={contentBody}
                  onChange={setContentBody}
                  format={contentFormat}
                  minHeight="320px"
                />
              </Card>
            </div>

            <div className="space-y-6">
              <PublishPanel
                status={status}
                onStatusChange={setStatus}
                publishedAt={publishedAt}
                onPublishedAtChange={setPublishedAt}
                expiresAt={expiresAt}
                onExpiresAtChange={setExpiresAt}
                enableExpires={enableExpires}
                onEnableExpiresChange={setEnableExpires}
                isFeatured={isFeatured}
                onIsFeaturedChange={setIsFeatured}
                featuredOrder={featuredOrder}
                onFeaturedOrderChange={setFeaturedOrder}
                categoryId={categoryId}
                onCategoryIdChange={setCategoryId}
                tags={tags}
                onTagsChange={setTags}
                categories={categories}
                lastModified={content?.updatedAt ? new Date(content.updatedAt).toLocaleString() : undefined}
                lastModifiedBy={(content?.author as any)?.name}
              />
              <SeoPanel
                metaTitle={metaTitle}
                metaDescription={metaDescription}
                keywords={keywords}
                onMetaTitleChange={setMetaTitle}
                onMetaDescriptionChange={setMetaDescription}
                onKeywordsChange={setKeywords}
              />
              <Card className="bg-[#12121a] border-white/5 p-4">
                <p className="text-xs text-white/40 mb-2">快捷键</p>
                <p className="text-xs text-white/50">Ctrl+S 保存 · Ctrl+Enter 发布</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
