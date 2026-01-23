"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Save,
  Download,
  Eye,
  Star,
  TrendingUp,
  FileText,
  Tag,
  DollarSign,
  Settings,
  BarChart3,
  Image as ImageIcon,
  File,
  Sparkles,
  Archive,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTemplateDetail,
  useTemplateCategories,
  useUpdateTemplate,
  useUpdateTemplateFiles,
  useUpdateTemplatePreviews,
  useSetTemplateFeatured,
  useUpdateTemplateStatus,
  useDeleteTemplate,
  useUploadFiles,
} from "@/hooks/use-templates";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [activeTab, setActiveTab] = useState("basic");
  const [previewIndex, setPreviewIndex] = useState(0);

  const { data: templateData, isLoading } = useTemplateDetail(templateId);
  const { data: categoriesData } = useTemplateCategories();
  const updateTemplate = useUpdateTemplate();
  const updateFiles = useUpdateTemplateFiles();
  const updatePreviews = useUpdateTemplatePreviews();
  const setFeatured = useSetTemplateFeatured();
  const updateStatus = useUpdateTemplateStatus();
  const deleteTemplate = useDeleteTemplate();
  const uploadFilesMutation = useUploadFiles();

  const template = templateData?.data;
  const categories = categoriesData?.data || [];

  // 表单状态
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [isFeatured, setIsFeatured] = useState(false);

  // 初始化表单数据
  if (template && name === "") {
    setName(template.name || "");
    setDescription(template.description || "");
    setAuthor(template.author || "");
    setSelectedCategoryIds(template.categories?.map((c: any) => c.id) || []);
    setTags((template.tags as string[])?.join(",") || "");
    setPrice(template.price?.toString() || "");
    setDiscount(template.discount?.toString() || "");
    setEnableDiscount(!!template.discount);
    setStatus(template.status || "draft");
    setIsFeatured(template.isFeatured || false);
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSaveBasic = async () => {
    await updateTemplate.mutateAsync({
      id: templateId,
      data: {
        name,
        description,
        author,
        categoryIds: selectedCategoryIds,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      },
    });
  };

  const handleSavePricing = async () => {
    await updateTemplate.mutateAsync({
      id: templateId,
      data: {
        price: parseFloat(price),
        discount: enableDiscount && discount ? parseFloat(discount) : undefined,
      },
    });
  };

  const handleUpdateFiles = async (files: File[]) => {
    const result = await uploadFilesMutation.mutateAsync({
      type: "design",
      files,
    });
    await updateFiles.mutateAsync({
      id: templateId,
      fileUrls: result.data.files,
    });
  };

  const handleUpdatePreviews = async (files: File[]) => {
    const result = await uploadFilesMutation.mutateAsync({
      type: "preview",
      files,
    });
    await updatePreviews.mutateAsync({
      id: templateId,
      previewUrls: result.data.files.map((f: any) => f.url),
    });
  };

  const handleDelete = async () => {
    if (confirm("确定要删除这个模板吗？此操作不可恢复。")) {
      await deleteTemplate.mutateAsync(templateId);
      router.push("/admin/templates");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex">
        <div className="flex-1 w-full md:ml-60">
          <div className="p-8">
            <Skeleton className="h-8 w-64 mb-6" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Card className="bg-[#12121a] border-white/5 p-8 text-center">
          <p className="text-white/60 mb-4">模板不存在</p>
          <Button asChild variant="outline" className="border-white/10">
            <Link href="/admin/templates">返回列表</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="flex-1 w-full md:ml-60">
        <div className="p-8 space-y-6">
          {/* 头部 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-white/60 hover:text-white"
              >
                <Link href="/admin/templates" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  返回列表
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">{template.name}</h1>
                <p className="text-white/60 mt-1">编辑模板信息</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-red-500/30 text-red-400 hover:bg-red-500/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：预览 */}
            <div className="lg:col-span-1">
              <Card className="bg-[#12121a] border-white/5 p-4 space-y-4">
                <div className="aspect-[4/3] bg-[#0a0a0f] rounded overflow-hidden relative">
                  {template.preview && template.preview.length > 0 ? (
                    <>
                      <Image
                        src={template.preview[previewIndex] || "/placeholder.png"}
                        alt={template.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {template.preview.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {template.preview.map((_: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setPreviewIndex(idx)}
                              className={cn(
                                "w-2 h-2 rounded-full transition-all",
                                idx === previewIndex ? "bg-white w-6" : "bg-white/40"
                              )}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      暂无预览图
                    </div>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">名称</span>
                    <span className="text-white">{template.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">分类</span>
                    <div className="flex gap-1">
                      {template.categories?.slice(0, 2).map((cat: any) => (
                        <Badge key={cat.id} variant="outline" className="text-xs border-white/10">
                          {cat.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">价格</span>
                    <span className="text-white font-semibold">¥{template.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">下载</span>
                    <span className="text-white">{template.downloads}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">评分</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-white">{template.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/10 text-white/60 hover:text-white"
                    asChild
                  >
                    <Link href={`/templates/${templateId}`} target="_blank">
                      <Eye className="w-4 h-4 mr-2" />
                      预览详情
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-white/10 text-white/60 hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载
                  </Button>
                </div>
              </Card>
            </div>

            {/* 右侧：编辑表单 */}
            <div className="lg:col-span-2">
              <Card className="bg-[#12121a] border-white/5">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start bg-[#0a0a0f] border-b border-white/10 rounded-none">
                    <TabsTrigger value="basic" className="text-white/60 data-[state=active]:text-white">
                      <FileText className="w-4 h-4 mr-2" />
                      基本信息
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="text-white/60 data-[state=active]:text-white">
                      <Tag className="w-4 h-4 mr-2" />
                      分类和标签
                    </TabsTrigger>
                    <TabsTrigger value="files" className="text-white/60 data-[state=active]:text-white">
                      <File className="w-4 h-4 mr-2" />
                      文件管理
                    </TabsTrigger>
                    <TabsTrigger value="previews" className="text-white/60 data-[state=active]:text-white">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      预览图
                    </TabsTrigger>
                    <TabsTrigger value="pricing" className="text-white/60 data-[state=active]:text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      定价
                    </TabsTrigger>
                    <TabsTrigger value="publish" className="text-white/60 data-[state=active]:text-white">
                      <Settings className="w-4 h-4 mr-2" />
                      审核和发布
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="text-white/60 data-[state=active]:text-white">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      统计数据
                    </TabsTrigger>
                  </TabsList>

                  <div className="p-6">
                    {/* Tab1: 基本信息 */}
                    <TabsContent value="basic" className="space-y-4 mt-0">
                      <div>
                        <Label className="text-white/80">模板名称</Label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-white/80">描述</Label>
                        <Textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label className="text-white/80">作者</Label>
                        <Input
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <span>创建时间：{new Date(template.createdAt).toLocaleString()}</span>
                        <span>•</span>
                        <span>最后修改：{new Date(template.updatedAt).toLocaleString()}</span>
                      </div>
                      <Button onClick={handleSaveBasic} className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Save className="w-4 h-4 mr-2" />
                        保存
                      </Button>
                    </TabsContent>

                    {/* Tab2: 分类和标签 */}
                    <TabsContent value="categories" className="space-y-4 mt-0">
                      <div>
                        <Label className="text-white/80 mb-2 block">分类选择</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {categories.map((cat: any) => (
                            <div
                              key={cat.id}
                              className="flex items-center space-x-2 p-2 rounded border border-white/10 hover:bg-white/5 cursor-pointer"
                              onClick={() => handleCategoryToggle(cat.id)}
                            >
                              <Checkbox
                                checked={selectedCategoryIds.includes(cat.id)}
                                onCheckedChange={() => handleCategoryToggle(cat.id)}
                                className="border-white/20"
                              />
                              <Label className="text-sm text-white/80 cursor-pointer">
                                {cat.name}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-white/80">标签</Label>
                        <Input
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="逗号分隔"
                          className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                        />
                      </div>
                      <Button onClick={handleSaveBasic} className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Save className="w-4 h-4 mr-2" />
                        保存
                      </Button>
                    </TabsContent>

                    {/* Tab3: 文件管理 */}
                    <TabsContent value="files" className="space-y-4 mt-0">
                      <div>
                        <Label className="text-white/80 mb-2 block">设计文件</Label>
                        {template.files && (template.files as any[]).length > 0 ? (
                          <div className="space-y-2">
                            {(template.files as any[]).map((file: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-[#0a0a0f] rounded border border-white/10"
                              >
                                <div className="flex items-center gap-2">
                                  <File className="w-4 h-4 text-white/40" />
                                  <span className="text-sm text-white/80">
                                    {file.format} - {(file.size / 1024 / 1024).toFixed(2)}MB
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" className="border-white/10">
                                    更换
                                  </Button>
                                  <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                                    删除
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-white/40">暂无文件</p>
                        )}
                        <input
                          type="file"
                          multiple
                          accept=".ai,.psd,.sketch,.figma,.pdf,.eps"
                          onChange={(e) => {
                            if (e.target.files) {
                              handleUpdateFiles(Array.from(e.target.files));
                            }
                          }}
                          className="hidden"
                          id="file-upload"
                        />
                        <Button
                          variant="outline"
                          className="mt-2 border-white/10"
                          onClick={() => document.getElementById("file-upload")?.click()}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          添加文件
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Tab4: 预览图 */}
                    <TabsContent value="previews" className="space-y-4 mt-0">
                      <div>
                        <Label className="text-white/80 mb-2 block">预览图</Label>
                        {template.preview && template.preview.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2">
                            {template.preview.map((url: string, idx: number) => (
                              <div key={idx} className="relative aspect-square bg-[#0a0a0f] rounded overflow-hidden">
                                <Image
                                  src={url}
                                  alt={`预览 ${idx + 1}`}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="absolute top-1 right-1"
                                  onClick={() => {
                                    // TODO: 删除预览图
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-white/40">暂无预览图</p>
                        )}
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files) {
                              handleUpdatePreviews(Array.from(e.target.files));
                            }
                          }}
                          className="hidden"
                          id="preview-upload"
                        />
                        <Button
                          variant="outline"
                          className="mt-2 border-white/10"
                          onClick={() => document.getElementById("preview-upload")?.click()}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          添加预览图
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Tab5: 定价 */}
                    <TabsContent value="pricing" className="space-y-4 mt-0">
                      <div>
                        <Label className="text-white/80">原价（元）</Label>
                        <Input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            id="enableDiscount"
                            checked={enableDiscount}
                            onCheckedChange={(checked) => setEnableDiscount(checked === true)}
                            className="border-white/20"
                          />
                          <Label htmlFor="enableDiscount" className="text-white/80 cursor-pointer">
                            启用折扣
                          </Label>
                        </div>
                        {enableDiscount && (
                          <Input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            placeholder="折扣率（0-1）"
                            min="0"
                            max="1"
                            step="0.1"
                            className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                          />
                        )}
                      </div>
                      <Button onClick={handleSavePricing} className="bg-gradient-to-r from-purple-500 to-pink-500">
                        <Save className="w-4 h-4 mr-2" />
                        保存
                      </Button>
                    </TabsContent>

                    {/* Tab6: 审核和发布 */}
                    <TabsContent value="publish" className="space-y-4 mt-0">
                      <div>
                        <Label className="text-white/80 mb-2 block">状态</Label>
                        <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                          <SelectTrigger className="bg-[#0a0a0f] border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#12121a] border-white/10">
                            <SelectItem value="draft">草稿</SelectItem>
                            <SelectItem value="published">已发布</SelectItem>
                            <SelectItem value="archived">已下架</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-sm text-white/60">
                        发布时间：{template.publishedAt ? new Date(template.publishedAt).toLocaleString() : "未发布"}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isFeatured"
                          checked={isFeatured}
                          onCheckedChange={(checked) => setIsFeatured(checked === true)}
                          className="border-white/20"
                        />
                        <Label htmlFor="isFeatured" className="text-white/80 cursor-pointer">
                          设置为精选模板
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => updateStatus.mutateAsync({ id: templateId, status: "published" })}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          发布
                        </Button>
                        <Button
                          onClick={() => updateStatus.mutateAsync({ id: templateId, status: "archived" })}
                          variant="outline"
                          className="border-orange-500/30 text-orange-400"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          下架
                        </Button>
                        <Button
                          onClick={() => setFeatured.mutateAsync({ id: templateId, isFeatured: !isFeatured })}
                          variant="outline"
                          className="border-yellow-500/30 text-yellow-400"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {isFeatured ? "取消精选" : "设置精选"}
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Tab7: 统计数据 */}
                    <TabsContent value="stats" className="space-y-4 mt-0">
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-[#0a0a0f] border-white/10 p-4">
                          <div className="text-sm text-white/60">总查看次数</div>
                          <div className="text-2xl font-bold text-white mt-1">{template.views}</div>
                        </Card>
                        <Card className="bg-[#0a0a0f] border-white/10 p-4">
                          <div className="text-sm text-white/60">总下载次数</div>
                          <div className="text-2xl font-bold text-white mt-1">{template.downloads}</div>
                        </Card>
                        <Card className="bg-[#0a0a0f] border-white/10 p-4">
                          <div className="text-sm text-white/60">平均评分</div>
                          <div className="text-2xl font-bold text-white mt-1 flex items-center gap-1">
                            {template.rating.toFixed(1)}
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          </div>
                        </Card>
                        <Card className="bg-[#0a0a0f] border-white/10 p-4">
                          <div className="text-sm text-white/60">评价数</div>
                          <div className="text-2xl font-bold text-white mt-1">{template.stats?.totalReviews || 0}</div>
                        </Card>
                      </div>
                      <div>
                        <Label className="text-white/80 mb-2 block">最近评价</Label>
                        {template.reviews && template.reviews.length > 0 ? (
                          <div className="space-y-2">
                            {template.reviews.slice(0, 5).map((review: any) => (
                              <Card key={review.id} className="bg-[#0a0a0f] border-white/10 p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm text-white/80">{review.user?.name || "匿名"}</span>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_: any, i: number) => (
                                      <Star
                                        key={i}
                                        className={cn(
                                          "w-3 h-3",
                                          i < review.rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-white/20"
                                        )}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-white/60">{review.comment}</p>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-white/40">暂无评价</p>
                        )}
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
