"use client";

import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading2,
  Heading3,
  Image,
  Link,
  Eye,
  FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  /** 'html' | 'markdown' */
  format?: string;
}

/** Simple markdown-style preview: bold, italic, headers, lists, code, links */
function simpleMarkdownToHtml(md: string): string {
  let html = md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/\n/g, "<br />");
  return html;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "撰写内容，支持 Markdown…",
  className,
  minHeight = "320px",
  format = "markdown",
}: RichTextEditorProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);

  const insert = useCallback(
    (before: string, after = "") => {
      const el = textRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = value.slice(start, end);
      const newText = value.slice(0, start) + before + selected + after + value.slice(end);
      onChange(newText);
      setTimeout(() => {
        el.focus();
        const pos = start + before.length + selected.length + after.length;
        el.setSelectionRange(pos, pos);
      }, 0);
    },
    [value, onChange]
  );

  const tools = (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-[#0a0a0f]">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("**", "**")}
        title="粗体"
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("*", "*")}
        title="斜体"
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("\n## ", "")}
        title="二级标题"
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("\n### ", "")}
        title="三级标题"
      >
        <Heading3 className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("\n- ", "")}
        title="无序列表"
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("\n1. ", "")}
        title="有序列表"
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("\n> ", "")}
        title="引用"
      >
        <Quote className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("`", "`")}
        title="行内代码"
      >
        <Code className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("[链接文字](https://)", "")}
        title="链接"
      >
        <Link className="w-4 h-4" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 text-white/60 hover:text-white"
        onClick={() => insert("![图片](图片URL)", "")}
        title="图片"
      >
        <Image className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className={cn("rounded-lg border border-white/10 bg-[#0a0a0f] overflow-hidden", className)}>
      {tools}
      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-white/10 bg-transparent px-2 h-9">
          <TabsTrigger value="edit" className="text-white/60 data-[state=active]:text-white">
            <FileCode className="w-4 h-4 mr-1" />
            编辑
          </TabsTrigger>
          <TabsTrigger value="preview" className="text-white/60 data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-1" />
            预览
          </TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-0">
          <Textarea
            ref={textRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[280px] resize-y border-0 rounded-none bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0"
            style={{ minHeight }}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-0 p-4">
          <div
            className="prose prose-invert prose-sm max-w-none min-h-[280px] text-white/80"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{
              __html: format === "markdown" ? simpleMarkdownToHtml(value) : value,
            }}
          />
        </TabsContent>
      </Tabs>
      <div className="px-3 py-2 border-t border-white/10 text-xs text-white/40">
        字数：{value.length}
      </div>
    </div>
  );
}
