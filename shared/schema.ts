import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  priority: text("priority").notNull(), // "high", "medium", "low"
  duration: real("duration").notNull(), // in hours
  createdAt: text("created_at").notNull().default(""),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
}).extend({
  priority: z.enum(["high", "medium", "low"]),
  duration: z.number().min(0.1).max(24),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// Algorithm types
export type Algorithm = "priority" | "fcfs" | "sjf" | "rr";

export interface ScheduledTask extends Task {
  startTime: number;
  endTime: number;
  waitTime: number;
}

export interface AlgorithmResult {
  scheduledTasks: ScheduledTask[];
  totalTime: number;
  avgWaitTime: number;
  efficiency: number;
}
