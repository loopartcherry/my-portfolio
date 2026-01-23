"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDesignerWorkload } from "@/hooks/use-designers";
import { cn } from "@/lib/utils";

export function DesignerWorkloadChart() {
  const { data: workload = [], isLoading } = useDesignerWorkload();

  if (isLoading) {
    return (
      <Card className="p-6 bg-[#12121a] border-white/5">
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  const maxLoad = Math.max(...workload.map((w: any) => w.currentLoad), 1);

  return (
    <Card className="p-6 bg-[#12121a] border-white/5">
      <h3 className="text-lg font-medium text-white mb-6">设计师工作负载</h3>
      <div className="space-y-4">
        {workload.length === 0 ? (
          <p className="text-white/40 text-center py-8">暂无数据</p>
        ) : (
          workload.map((item: any) => {
            const barWidth = maxLoad > 0 ? (item.currentLoad / maxLoad) * 100 : 0;
            const utilization = item.maxCapacity > 0
              ? Math.round((item.currentLoad / item.maxCapacity) * 100)
              : 0;
            const isOverloaded = utilization >= 100;

            return (
              <div key={item.designerId} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/80">{item.name || item.email}</span>
                  <span className={cn("text-white/60", isOverloaded && "text-red-400")}>
                    {item.currentLoad} / {item.maxCapacity}
                  </span>
                </div>
                <div className="relative h-6 bg-white/5 rounded overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      isOverloaded
                        ? "bg-red-500/50"
                        : utilization >= 80
                          ? "bg-yellow-500/50"
                          : "bg-primary/50"
                    )}
                    style={{ width: `${barWidth}%` }}
                  />
                  {isOverloaded && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-red-400 font-medium">
                      已满载
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
