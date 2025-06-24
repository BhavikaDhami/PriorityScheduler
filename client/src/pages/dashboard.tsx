import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Task, Algorithm } from "@shared/schema";
import TaskForm from "@/components/task-form";
import TaskList from "@/components/task-list";
import AlgorithmSelector from "@/components/algorithm-selector";
import GanttChart from "@/components/gantt-chart";
import PerformanceMetrics from "@/components/performance-metrics";
import AlgorithmComparison from "@/components/algorithm-comparison";
import { Button } from "@/components/ui/button";
import { Download, ListTodo } from "lucide-react";

export default function Dashboard() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("priority");

  const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const handleExport = () => {
    // Simple CSV export functionality
    if (tasks.length === 0) return;
    
    const csvContent = [
      ["Name", "Description", "Priority", "Duration", "Created"],
      ...tasks.map(task => [
        task.name,
        task.description,
        task.priority,
        task.duration.toString(),
        new Date(task.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading ListTodo</h2>
          <p className="text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ListTodo className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-medium text-gray-900">Priority Task Scheduler</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Management Panel */}
          <div className="lg:col-span-1 space-y-6">
            <TaskForm />
            <TaskList tasks={tasks} isLoading={isLoading} selectedAlgorithm={selectedAlgorithm} />
          </div>

          {/* Visualization Panel */}
          <div className="lg:col-span-2 space-y-6">
            <AlgorithmSelector 
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
            />
            
            <PerformanceMetrics tasks={tasks} selectedAlgorithm={selectedAlgorithm} />
            
            <GanttChart tasks={tasks} selectedAlgorithm={selectedAlgorithm} />
            
            <AlgorithmComparison tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
}
