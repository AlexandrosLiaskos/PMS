"use server";

import { db } from "@/db/turso";
import { users, projects, workspaces } from "@/db/schema";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { eq, and } from "drizzle-orm";
import { registerSchema, projectSchema, validateId, sanitizeString } from "@/lib/validation";

export async function register(prevState: { error: string, success: boolean }, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate input data
  const validation = registerSchema.safeParse({ name, email, password });
  if (!validation.success) {
    return { error: validation.error.errors[0].message, success: false };
  }

  // Sanitize input
  const sanitizedName = sanitizeString(validation.data.name);
  const sanitizedEmail = validation.data.email.toLowerCase();

  const hashedPassword = await bcrypt.hash(validation.data.password, 12);

  try {
    await db.insert(users).values({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
    });
    redirect("/login");
    return { error: "", success: true };
  } catch {
    return { error: "User already exists.", success: false };
  }
}

export async function createProject(prevState: { error: string, success: boolean }, formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return { error: "Unauthorized", success: false };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const workspaceId = formData.get("workspaceId") as string;

  // Validate input
  const validation = projectSchema.safeParse({ name, description });
  if (!validation.success) {
    return { error: validation.error.errors[0].message, success: false };
  }

  if (!workspaceId || !validateId(workspaceId)) {
    return { error: "Invalid workspace ID", success: false };
  }

  try {
    // Get user
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
    if (!user) {
      return { error: "User not found", success: false };
    }

    // Verify workspace ownership
    const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));
    if (!workspace) {
      return { error: "Workspace not found or unauthorized", success: false };
    }

    // Create project directly
    await db.insert(projects).values({
      name: sanitizeString(validation.data.name),
      description: validation.data.description ? sanitizeString(validation.data.description) : null,
      workspaceId,
    });

    revalidatePath(`/workspaces/${workspaceId}/projects`);
    return { success: true, error: "" };
  } catch {
    return { error: "An unexpected error occurred.", success: false };
  }
}

export async function updateProject(prevState: { error: string, success: boolean }, formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return { error: "Unauthorized", success: false };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const workspaceId = formData.get("workspaceId") as string;
  const projectId = formData.get("projectId") as string;

  // Validate input
  const validation = projectSchema.safeParse({ name, description });
  if (!validation.success) {
    return { error: validation.error.errors[0].message, success: false };
  }

  if (!workspaceId || !validateId(workspaceId) || !projectId || !validateId(projectId)) {
    return { error: "Invalid workspace ID or project ID", success: false };
  }

  try {
    // Get user
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
    if (!user) {
      return { error: "User not found", success: false };
    }

    // Verify workspace ownership
    const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));
    if (!workspace) {
      return { error: "Workspace not found or unauthorized", success: false };
    }

    // Update project directly
    const [updatedProject] = await db.update(projects)
      .set({
        name: sanitizeString(validation.data.name),
        description: validation.data.description ? sanitizeString(validation.data.description) : null,
      })
      .where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)))
      .returning();

    if (!updatedProject) {
      return { error: "Project not found", success: false };
    }

    revalidatePath(`/workspaces/${workspaceId}/projects`);
    return { success: true, error: "" };
  } catch {
    return { error: "An unexpected error occurred.", success: false };
  }
}

export async function deleteProject(prevState: { error: string, success: boolean }, formData: FormData) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user || !session.user.email) {
    return { error: "Unauthorized", success: false };
  }

  const workspaceId = formData.get("workspaceId") as string;
  const projectId = formData.get("projectId") as string;

  if (!workspaceId || !validateId(workspaceId) || !projectId || !validateId(projectId)) {
    return { error: "Invalid workspace ID or project ID", success: false };
  }

  try {
    // Get user
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
    if (!user) {
      return { error: "User not found", success: false };
    }

    // Verify workspace ownership
    const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));
    if (!workspace) {
      return { error: "Workspace not found or unauthorized", success: false };
    }

    // Delete project directly
    const [deletedProject] = await db.delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)))
      .returning();

    if (!deletedProject) {
      return { error: "Project not found", success: false };
    }

    revalidatePath(`/workspaces/${workspaceId}/projects`);
    return { success: true, error: "" };
  } catch {
    return { error: "An unexpected error occurred.", success: false };
  }
}
