import type { Algorithm } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowRight, Clock, RotateCcw } from "lucide-react";

interface AlgorithmSelectorProps {
  selectedAlgorithm: Algorithm;
  onAlgorithmChange: (algorithm: Algorithm) => void;
}

export default function AlgorithmSelector({ selectedAlgorithm, onAlgorithmChange }: AlgorithmSelectorProps) {
  const algorithms = [
    {
      id: "priority" as Algorithm,
      name: "Priority-based",
      icon: ArrowDown,
      description: "Execute tasks by priority level",
    },
    {
      id: "fcfs" as Algorithm,
      name: "FCFS",
      icon: ArrowRight,
      description: "First Come First Serve",
    },
    {
      id: "sjf" as Algorithm,
      name: "SJF",
      icon: Clock,
      description: "Shortest Job First",
    },
    {
      id: "rr" as Algorithm,
      name: "Round Robin",
      icon: RotateCcw,
      description: "Time-slice based scheduling",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduling Algorithm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {algorithms.map((algorithm) => {
            const Icon = algorithm.icon;
            const isSelected = selectedAlgorithm === algorithm.id;
            
            return (
              <Button
                key={algorithm.id}
                variant={isSelected ? "default" : "outline"}
                className={`p-3 h-auto flex flex-col items-center space-y-2 ${
                  isSelected ? "border-2 border-primary" : ""
                }`}
                onClick={() => onAlgorithmChange(algorithm.id)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{algorithm.name}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
