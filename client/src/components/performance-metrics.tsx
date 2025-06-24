import type { Task, Algorithm } from "@shared/schema";
import { getScheduleByAlgorithm } from "@/lib/scheduling-algorithms";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, TrendingUp, Zap } from "lucide-react";

interface PerformanceMetricsProps {
  tasks: Task[];
  selectedAlgorithm: Algorithm;
}

export default function PerformanceMetrics({ tasks, selectedAlgorithm }: PerformanceMetricsProps) {
  const result = getScheduleByAlgorithm(tasks, selectedAlgorithm);

  const metrics = [
    {
      label: "Total Time",
      value: formatDuration(result.totalTime),
      icon: Clock,
      color: "text-blue-600",
    },
    {
      label: "Avg Wait Time",
      value: formatDuration(result.avgWaitTime),
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Efficiency",
      value: `${Math.round(result.efficiency)}%`,
      icon: Zap,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`${metric.color} text-xl`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
