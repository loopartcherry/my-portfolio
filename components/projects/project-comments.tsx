"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { zhCN } from "date-fns/locale";
import {
  MessageSquare,
  Send,
  Reply,
  ThumbsUp,
  Paperclip,
  Smile,
  AtSign,
  MoreVertical,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProjectCommentsProps {
  projectId: string;
  currentUserId?: string;
}

export function ProjectComments({ projectId, currentUserId }: ProjectCommentsProps) {
  const [messageInput, setMessageInput] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const queryClient = useQueryClient();

  // 获取评论列表
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ["project-comments", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("获取评论失败");
      return res.json();
    },
  });

  const comments = commentsData?.data || [];

  // 创建评论
  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/projects/${projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content,
          parentId: replyingTo || undefined,
        }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "发布评论失败");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("评论已发布");
      setMessageInput("");
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ["project-comments", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // 更新评论
  const updateCommentMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const res = await fetch(`/api/projects/${projectId}/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "更新评论失败");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("评论已更新");
      setEditingId(null);
      setEditContent("");
      queryClient.invalidateQueries({ queryKey: ["project-comments", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // 删除评论
  const deleteCommentMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${projectId}/comments/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "删除评论失败");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("评论已删除");
      queryClient.invalidateQueries({ queryKey: ["project-comments", projectId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = () => {
    if (!messageInput.trim()) return;
    createCommentMutation.mutate(messageInput);
  };

  const handleEdit = (comment: any) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdate = () => {
    if (!editContent.trim() || !editingId) return;
    updateCommentMutation.mutate({ id: editingId, content: editContent });
  };

  const handleDelete = (id: string) => {
    if (confirm("确定删除此评论？")) {
      deleteCommentMutation.mutate(id);
    }
  };

  const renderComment = (comment: any, level = 0) => {
    const isOwner = comment.user.id === currentUserId;
    const isEditing = editingId === comment.id;

    return (
      <div key={comment.id} className={cn("space-y-3", level > 0 && "ml-8 mt-3")}>
        <div className="flex gap-3 sm:gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-sm text-white shrink-0">
            {comment.user.name?.[0] || comment.user.email?.[0] || "U"}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
              <span className="text-sm font-medium text-white/80">
                {comment.user.name || comment.user.email}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 text-[10px] rounded",
                  comment.user.role === "designer"
                    ? "bg-green-500/20 text-green-400"
                    : comment.user.role === "admin"
                    ? "bg-purple-500/20 text-purple-400"
                    : "bg-blue-500/20 text-blue-400"
                )}
              >
                {comment.user.role === "designer"
                  ? "设计师"
                  : comment.user.role === "admin"
                  ? "管理员"
                  : "客户"}
              </span>
              <span className="text-xs text-white/30">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: zhCN,
                })}
              </span>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white/40">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#12121a] border-white/10">
                    <DropdownMenuItem
                      onClick={() => handleEdit(comment)}
                      className="text-white hover:bg-white/10"
                    >
                      <Pencil className="w-3 h-3 mr-2" />
                      编辑
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="bg-[#0a0a0f] border-white/10 text-white"
                  rows={3}
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={handleUpdate}
                    disabled={!editContent.trim() || updateCommentMutation.isPending}
                    className="bg-primary text-primary-foreground"
                  >
                    保存
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(null);
                      setEditContent("");
                    }}
                    className="border-white/10 text-white/60"
                  >
                    取消
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-3 sm:p-4 rounded-xl bg-[#12121a] border border-white/5">
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="flex items-center gap-1 text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    <Reply className="w-3 h-3" />
                    回复
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 回复 */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-8 space-y-3">
            {comment.replies.map((reply: any) => renderComment(reply, level + 1))}
          </div>
        )}

        {/* 回复输入框 */}
        {replyingTo === comment.id && (
          <div className="ml-8 mt-3 p-3 rounded-xl bg-[#12121a] border border-white/5">
            <Textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="输入回复..."
              className="bg-[#0a0a0f] border-white/10 text-white mb-2"
              rows={2}
            />
            <div className="flex items-center justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setReplyingTo(null)}
                className="border-white/10 text-white/60"
              >
                取消
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!messageInput.trim() || createCommentMutation.isPending}
                className="bg-primary text-primary-foreground"
              >
                回复
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/40">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <MessageSquare className="w-16 h-16 text-white/20 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">暂无评论</h3>
            <p className="text-white/60">成为第一个评论的人</p>
          </div>
        ) : (
          comments.map((comment: any) => renderComment(comment))
        )}
      </div>

      {/* 评论输入框 */}
      <div className="sticky bottom-0 pt-4 border-t border-white/5 bg-[#0a0a0f]">
        <div className="rounded-xl bg-[#12121a] border border-white/10 p-3 sm:p-4">
          <Textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="输入评论... 支持 Markdown 格式"
            className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/30 resize-none focus:outline-none min-h-[80px] border-white/10"
            rows={4}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="ghost" size="sm" className="text-white/40 hover:text-white/70">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/40 hover:text-white/70">
                <Smile className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white/40 hover:text-white/70">
                <AtSign className="w-4 h-4" />
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!messageInput.trim() || createCommentMutation.isPending}
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
