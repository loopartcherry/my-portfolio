"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Image as ImageIcon,
  File,
  Trash2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useUploadTemplate, useTemplateCategories, useUploadFiles } from "@/hooks/use-templates";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UploadTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadTemplateDialog({
  open,
  onOpenChange,
}: UploadTemplateDialogProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileUrls, setFileUrls] = useState<Array<{ format: string; url: string; size: number }>>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { data: categoriesData } = useTemplateCategories();
  const uploadTemplate = useUploadTemplate();
  const uploadFilesMutation = useUploadFiles();

  const categories = categoriesData?.data || [];

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim() || !description.trim() || !author.trim()) {
        toast.error("请填写所有必填字段");
        return;
      }
    } else if (step === 2) {
      if (categoryIds.length === 0 || !tags.trim() || !price.trim()) {
        toast.error("请填写所有必填字段");
        return;
      }
    } else if (step === 3) {
      if (designFiles.length === 0 || previewImages.length < 3) {
        toast.error("请至少上传1个设计文件和3张预览图");
        return;
      }
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const handlePrev = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleFileSelect = (type: "design" | "preview", files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    if (type === "design") {
      setDesignFiles((prev) => [...prev, ...fileArray]);
    } else {
      setPreviewImages((prev) => [...prev, ...fileArray]);
    }
  };

  const handleRemoveFile = (type: "design" | "preview", index: number) => {
    if (type === "design") {
      setDesignFiles((prev) => prev.filter((_, i) => i !== index));
      setFileUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleMovePreview = (index: number, direction: "up" | "down") => {
    const newImages = [...previewImages];
    const newUrls = [...previewUrls];
    if (direction === "up" && index > 0) {
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      [newUrls[index], newUrls[index - 1]] = [newUrls[index - 1], newUrls[index]];
    } else if (direction === "down" && index < newImages.length - 1) {
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      [newUrls[index], newUrls[index + 1]] = [newUrls[index + 1], newUrls[index]];
    }
    setPreviewImages(newImages);
    setPreviewUrls(newUrls);
  };

  const handleUploadFiles = async () => {
    try {
      setUploadProgress(0);

      // 上传设计文件
      if (designFiles.length > 0) {
        const designResult = await uploadFilesMutation.mutateAsync({
          type: "design",
          files: designFiles,
        });
        setFileUrls(designResult.data.files);
        setUploadProgress(50);
      }

      // 上传预览图
      if (previewImages.length > 0) {
        const previewResult = await uploadFilesMutation.mutateAsync({
          type: "preview",
          files: previewImages,
        });
        setPreviewUrls(previewResult.data.files.map((f: any) => f.url));
        setUploadProgress(100);
      }
    } catch (error) {
      toast.error("文件上传失败");
    }
  };

  const handleSubmit = async () => {
    try {
      // 先上传文件
      await handleUploadFiles();

      // 创建模板
      await uploadTemplate.mutateAsync({
        name,
        description,
        author,
        categoryIds,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        price: parseFloat(price),
        discount: enableDiscount && discount ? parseFloat(discount) : undefined,
        status: "draft",
        previewUrls,
        fileUrls,
      });

      // 重置表单
      setName("");
      setDescription("");
      setAuthor("");
      setCategoryIds([]);
      setTags("");
      setPrice("");
      setDiscount("");
      setEnableDiscount(false);
      setDesignFiles([]);
      setPreviewImages([]);
      setPreviewUrls([]);
      setFileUrls([]);
      setStep(1);
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#12121a] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            上传新模板 - 第 {step}/3 步
          </DialogTitle>
        </DialogHeader>

        {/* 步骤1: 基本信息 */}
        {step === 1 && (
          <div className="space-y-6 py-4">
            <div>
              <Label htmlFor="name" className="text-white/80">
                模板名称 <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：Logo 设计 001"
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white/80">
                简短描述 <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="最多 100 字"
                maxLength={100}
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                rows={3}
              />
              <p className="text-xs text-white/40 mt-1">
                {description.length}/100
              </p>
            </div>

            <div>
              <Label htmlFor="author" className="text-white/80">
                设计师/作者 <span className="text-red-400">*</span>
              </Label>
              <Input
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="例如：张三"
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
            </div>
          </div>
        )}

        {/* 步骤2: 分类和标签 */}
        {step === 2 && (
          <div className="space-y-6 py-4">
            <div>
              <Label className="text-white/80 mb-2 block">
                分类选择 <span className="text-red-400">*</span>
              </Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {categories.map((cat: any) => (
                  <div
                    key={cat.id}
                    className="flex items-center space-x-2 p-2 rounded border border-white/10 hover:bg-white/5 cursor-pointer"
                    onClick={() => handleCategoryToggle(cat.id)}
                  >
                    <Checkbox
                      checked={categoryIds.includes(cat.id)}
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
              <Label htmlFor="tags" className="text-white/80">
                标签 <span className="text-red-400">*</span>
              </Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="逗号分隔，例如：现代,简洁,科技"
                className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
              />
              <p className="text-xs text-white/40 mt-1">
                建议标签：现代、简洁、科技、风格
              </p>
            </div>

            <div>
              <Label htmlFor="price" className="text-white/80">
                价格（元） <span className="text-red-400">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="99"
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
                  placeholder="折扣率（0-1，如 0.8 表示 8 折）"
                  min="0"
                  max="1"
                  step="0.1"
                  className="mt-1 bg-[#0a0a0f] border-white/10 text-white"
                />
              )}
            </div>
          </div>
        )}

        {/* 步骤3: 文件和预览 */}
        {step === 3 && (
          <div className="space-y-6 py-4">
            <div>
              <Label className="text-white/80 mb-2 block">
                设计文件 <span className="text-red-400">*</span>
                <span className="text-xs text-white/40 ml-2">
                  (支持 AI, PSD, SKETCH, FIGMA, 最多 50MB)
                </span>
              </Label>
              <div className="mt-2 border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".ai,.psd,.sketch,.figma,.pdf,.eps"
                  onChange={(e) => handleFileSelect("design", e.target.files)}
                  className="hidden"
                  id="design-upload"
                />
                <label
                  htmlFor="design-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <File className="w-12 h-12 text-white/40" />
                  <span className="text-white/60">
                    点击上传或拖拽文件到此
                  </span>
                  <span className="text-xs text-white/40">最多 50MB</span>
                </label>
              </div>
              {designFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {designFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-[#0a0a0f] rounded border border-white/10"
                    >
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/80">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveFile("design", index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="text-white/80 mb-2 block">
                预览图 <span className="text-red-400">*</span>
                <span className="text-xs text-white/40 ml-2">
                  (至少3张，支持 JPG, PNG, 每张最多 5MB)
                </span>
              </Label>
              <div className="mt-2 border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileSelect("preview", e.target.files)}
                  className="hidden"
                  id="preview-upload"
                />
                <label
                  htmlFor="preview-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <ImageIcon className="w-12 h-12 text-white/40" />
                  <span className="text-white/60">
                    点击上传或拖拽图片到此
                  </span>
                  <span className="text-xs text-white/40">
                    每张最多 5MB，建议 1920×1080
                  </span>
                </label>
              </div>
              {previewImages.length > 0 && (
                <div className="mt-4 space-y-2">
                  {previewImages.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-[#0a0a0f] rounded border border-white/10"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`预览 ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <span className="text-sm text-white/80 flex-1">
                          {file.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMovePreview(index, "up")}
                          disabled={index === 0}
                          className="text-white/60 hover:text-white"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMovePreview(index, "down")}
                          disabled={index === previewImages.length - 1}
                          className="text-white/60 hover:text-white"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveFile("preview", index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-white/60 mt-1">上传中... {uploadProgress}%</p>
              </div>
            )}
          </div>
        )}

        {/* 底部按钮 */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
            className="border-white/10 text-white/60 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一步
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/10 text-white/60 hover:text-white"
            >
              取消
            </Button>
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                下一步
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={uploadTemplate.isPending || uploadFilesMutation.isPending}
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                {uploadTemplate.isPending || uploadFilesMutation.isPending
                  ? "上传中..."
                  : "完成上传"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
