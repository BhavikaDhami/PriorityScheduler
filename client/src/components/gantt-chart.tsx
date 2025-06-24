import type { Task, Algorithm } from "@shared/schema";
import { getScheduleByAlgorithm } from "@/lib/scheduling-algorithms";
import { formatDuration, getPriorityColor } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GanttChartProps {
  tasks: Task[];
  selectedAlgorithm: Algorithm;
}

export default function GanttChart({ tasks, selectedAlgorithm }: GanttChartProps) {
  const result = getScheduleByAlgorithm(tasks, selectedAlgorithm);
  const { scheduledTasks, totalTime } = result;

  const getAlgorithmName = (algorithm: Algorithm): string => {
    switch (algorithm) {
      case "priority": return "Priority-based";
      case "fcfs": return "First Come First Serve";
      case "sjf": return "Shortest Job First";
      case "rr": return "Round Robin";
      default: return "Priority-based";
    }
  };

  const getAlgorithmDescription = (algorithm: Algorithm): string => {
    switch (algorithm) {
      case "priority":
        return "Tasks are executed in order of their priority level. High-priority tasks are completed first, followed by medium-priority, then low-priority tasks. This ensures critical work is never overlooked.";
      case "fcfs":
        return "Tasks are executed in the order they were created (first come, first serve). Simple and fair, but may not be optimal for varying task priorities.";
      case "sjf":
        return "Tasks are executed in order of their duration, with shortest tasks first. This minimizes average wait time but may delay longer tasks.";
      case "rr":
        return "Tasks are executed in time slices, cycling through all tasks. Provides fair time sharing but may increase total completion time.";
      default:
        return "";
    }
  };

  // Generate time scale marks
  const timeMarks = [];
  const maxHours = Math.ceil(totalTime);
  for (let i = 0; i <= maxHours; i++) {
    timeMarks.push(i);
  }

  if (scheduledTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Execution Timeline - {getAlgorithmName(selectedAlgorithm)}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks to schedule. Add some tasks to see the Gantt chart.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Execution Timeline - {getAlgorithmName(selectedAlgorithm)}</CardTitle>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-orange-500"></div>
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Low Priority</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Time Scale */}
        <div className="mb-4">
          <div className="flex text-xs text-muted-foreground mb-2">
            <div className="w-32"></div>
            <div className="flex-1 flex justify-between">
              {timeMarks.map(hour => (
                <span key={hour}>{hour}h</span>
              ))}
            </div>
          </div>
          <div className="flex">
            <div className="w-32"></div>
            <div className="flex-1 h-px bg-border relative">
              <div className="absolute inset-0 flex">
                {timeMarks.slice(0, -1).map(hour => (
                  <div key={hour} className="flex-1 border-r border-border"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gantt Bars */}
        <div className="space-y-3">
          {scheduledTasks.map((task) => {
            const startPercentage = (task.startTime / totalTime) * 100;
            const widthPercentage = (task.duration / totalTime) * 100;
            
            return (
              <div key={`${task.id}-${task.startTime}`} className="flex items-center">
                <div className="w-32 text-sm font-medium text-gray-900 pr-4 truncate">
                  {task.name}
                </div>
                <div className="flex-1 relative h-8">
                  <div
                    className={`absolute top-1 h-6 ${getPriorityColor(task.priority)} rounded flex items-center px-2 text-white text-xs font-medium`}
                    style={{
                      left: `${startPercentage}%`,
                      width: `${widthPercentage}%`,
                      minWidth: '60px'
                    }}
                  >
                    {formatDuration(task.duration)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Algorithm Explanation */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">{getAlgorithmName(selectedAlgorithm)} Algorithm</h3>
          <p className="text-sm text-blue-800">
            {getAlgorithmDescription(selectedAlgorithm)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
