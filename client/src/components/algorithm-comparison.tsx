import type { Task } from "@shared/schema";
import { getScheduleByAlgorithm } from "@/lib/scheduling-algorithms";
import { formatDuration } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AlgorithmComparisonProps {
  tasks: Task[];
}

export default function AlgorithmComparison({ tasks }: AlgorithmComparisonProps) {
  const algorithms = [
    { id: "priority", name: "Priority-based", bestFor: "Critical tasks first" },
    { id: "fcfs", name: "FCFS", bestFor: "Simple scheduling" },
    { id: "sjf", name: "SJF", bestFor: "Minimize wait time" },
    { id: "rr", name: "Round Robin", bestFor: "Fair time sharing" },
  ] as const;

  const results = algorithms.map(algorithm => ({
    ...algorithm,
    result: getScheduleByAlgorithm(tasks, algorithm.id),
  }));

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Algorithm Comparison</CardTitle>
          <p className="text-sm text-muted-foreground">
            Performance metrics across different scheduling algorithms
          </p>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Add tasks to see algorithm comparison.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Algorithm Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          Performance metrics across different scheduling algorithms
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Algorithm</TableHead>
                <TableHead>Total Time</TableHead>
                <TableHead>Avg Wait Time</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead>Best For</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{formatDuration(row.result.totalTime)}</TableCell>
                  <TableCell>{formatDuration(row.result.avgWaitTime)}</TableCell>
                  <TableCell>{Math.round(row.result.efficiency)}%</TableCell>
                  <TableCell className="text-muted-foreground">{row.bestFor}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
