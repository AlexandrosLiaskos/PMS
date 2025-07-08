import { z } from "zod";

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password too long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Workspace validation schemas
export const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(100, "Workspace name too long"),
});

// Project validation schemas
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100, "Project name too long"),
  description: z.string().max(500, "Description too long").optional(),
});

// Task validation schemas
export const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(200, "Task title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  deadline: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
  assignedTo: z.string().optional(),
});

// Event validation schemas
export const eventSchema = z.object({
  title: z.string().min(1, "Event title is required").max(200, "Event title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  status: z.enum(["upcoming", "ongoing", "completed", "cancelled"]).default("upcoming"),
});

// Reminder validation schemas
export const reminderSchema = z.object({
  title: z.string().min(1, "Reminder title is required").max(200, "Reminder title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
  status: z.enum(["active", "completed", "dismissed"]).default("active"),
});

// Content validation schemas
export const contentSchema = z.object({
  title: z.string().min(1, "Content title is required").max(200, "Content title too long"),
  content: z.string().max(50000, "Content too long"),
  path: z.string().optional(),
  type: z.enum(["README", "knowledge_base"]).default("README"),
});

// Common validation functions
export function validateId(id: string): boolean {
  return /^[a-zA-Z0-9-_]{1,50}$/.test(id);
}

export function sanitizeString(str: string): string {
  return str.trim().replace(/[<>]/g, "");
}

export function validateAndSanitizeInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: string;
} {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "Invalid input data" };
  }
}