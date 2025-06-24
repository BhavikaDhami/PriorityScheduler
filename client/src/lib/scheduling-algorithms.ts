import type { Task, ScheduledTask, AlgorithmResult, Algorithm } from "@shared/schema";

export function scheduleTasksByPriority(tasks: Task[]): AlgorithmResult {
  if (tasks.length === 0) {
    return {
      scheduledTasks: [],
      totalTime: 0,
      avgWaitTime: 0,
      efficiency: 100,
    };
  }

  // Sort by priority (high -> medium -> low), then by creation time
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - 
                        priorityOrder[a.priority as keyof typeof priorityOrder];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return calculateSchedule(sortedTasks);
}

export function scheduleTasksByFCFS(tasks: Task[]): AlgorithmResult {
  if (tasks.length === 0) {
    return {
      scheduledTasks: [],
      totalTime: 0,
      avgWaitTime: 0,
      efficiency: 100,
    };
  }

  // Sort by creation time (first come, first serve)
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return calculateSchedule(sortedTasks);
}

export function scheduleTasksBySJF(tasks: Task[]): AlgorithmResult {
  if (tasks.length === 0) {
    return {
      scheduledTasks: [],
      totalTime: 0,
      avgWaitTime: 0,
      efficiency: 100,
    };
  }

  // Sort by duration (shortest job first)
  const sortedTasks = [...tasks].sort((a, b) => {
    const durationDiff = a.duration - b.duration;
    if (durationDiff !== 0) return durationDiff;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return calculateSchedule(sortedTasks);
}

export function scheduleTasksByRoundRobin(tasks: Task[], timeQuantum: number = 1): AlgorithmResult {
  if (tasks.length === 0) {
    return {
      scheduledTasks: [],
      totalTime: 0,
      avgWaitTime: 0,
      efficiency: 100,
    };
  }

  // Round Robin scheduling with time quantum
  const taskQueue = [...tasks].map(task => ({ ...task, remainingTime: task.duration }));
  const scheduledTasks: ScheduledTask[] = [];
  let currentTime = 0;
  
  // Track wait times for each task
  const waitTimes = new Map<number, number>();
  const startTimes = new Map<number, number>();
  
  taskQueue.forEach(task => {
    waitTimes.set(task.id, 0);
    startTimes.set(task.id, currentTime);
  });

  while (taskQueue.some(task => task.remainingTime > 0)) {
    for (let i = 0; i < taskQueue.length; i++) {
      const task = taskQueue[i];
      if (task.remainingTime <= 0) continue;

      const executionTime = Math.min(timeQuantum, task.remainingTime);
      const startTime = currentTime;
      const endTime = currentTime + executionTime;
      
      task.remainingTime -= executionTime;
      currentTime = endTime;

      // Find existing scheduled task or create new one
      let existingTask = scheduledTasks.find(st => st.id === task.id && st.endTime === startTime);
      if (existingTask) {
        existingTask.endTime = endTime;
      } else {
        const waitTime = startTime - (startTimes.get(task.id) || 0);
        scheduledTasks.push({
          ...task,
          startTime,
          endTime,
          waitTime,
        });
      }

      // Update wait times for other tasks
      taskQueue.forEach(otherTask => {
        if (otherTask.id !== task.id && otherTask.remainingTime > 0) {
          waitTimes.set(otherTask.id, (waitTimes.get(otherTask.id) || 0) + executionTime);
        }
      });
    }
  }

  const totalTime = currentTime;
  const avgWaitTime = Array.from(waitTimes.values()).reduce((sum, wait) => sum + wait, 0) / tasks.length;
  const efficiency = (tasks.reduce((sum, task) => sum + task.duration, 0) / totalTime) * 100;

  return {
    scheduledTasks,
    totalTime,
    avgWaitTime,
    efficiency,
  };
}

function calculateSchedule(sortedTasks: Task[]): AlgorithmResult {
  let currentTime = 0;
  const scheduledTasks: ScheduledTask[] = [];

  sortedTasks.forEach((task, index) => {
    const startTime = currentTime;
    const endTime = currentTime + task.duration;
    const waitTime = startTime;

    scheduledTasks.push({
      ...task,
      startTime,
      endTime,
      waitTime,
    });

    currentTime = endTime;
  });

  const totalTime = currentTime;
  const avgWaitTime = scheduledTasks.reduce((sum, task) => sum + task.waitTime, 0) / scheduledTasks.length;
  const efficiency = (sortedTasks.reduce((sum, task) => sum + task.duration, 0) / totalTime) * 100;

  return {
    scheduledTasks,
    totalTime,
    avgWaitTime,
    efficiency,
  };
}

export function getScheduleByAlgorithm(tasks: Task[], algorithm: Algorithm): AlgorithmResult {
  switch (algorithm) {
    case "priority":
      return scheduleTasksByPriority(tasks);
    case "fcfs":
      return scheduleTasksByFCFS(tasks);
    case "sjf":
      return scheduleTasksBySJF(tasks);
    case "rr":
      return scheduleTasksByRoundRobin(tasks);
    default:
      return scheduleTasksByPriority(tasks);
  }
}
