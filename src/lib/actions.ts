"use server";

import { db } from "@/db/turso";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

export async function register(prevState: { error: string, success: boolean }, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required.", success: false };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });
    redirect("/login"); // Redirect after successful registration
    return { error: "", success: true }; // This return is technically unreachable due to redirect, but good for type consistency
  } catch (error) {
    console.error(error);
    return { error: "User already exists.", success: false };
  }
}

export async function createProject(prevState: { error: string, success: boolean }, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const workspaceId = formData.get("workspaceId") as string;

  if (!name || !workspaceId) {
    return { error: "Project name and workspace ID are required.", success: false };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/${workspaceId}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to create project.", success: false };
    }

    revalidatePath(`/workspaces/${workspaceId}/projects`);
    return { success: true, error: "" };
  } catch (error) {
    console.error("Error creating project:", error);
    return { error: "An unexpected error occurred.", success: false };
  }
}

export async function updateProject(prevState: { error: string, success: boolean }, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const workspaceId = formData.get("workspaceId") as string;
  const projectId = formData.get("projectId") as string;

  if (!name || !workspaceId || !projectId) {
    return { error: "Project name, workspace ID, and project ID are required.", success: false };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/${workspaceId}/projects/${projectId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, description }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to update project.", success: false };
    }

    revalidatePath(`/workspaces/${workspaceId}/projects`);
    return { success: true, error: "" };
  } catch (error) {
    console.error("Error updating project:", error);
    return { error: "An unexpected error occurred.", success: false };
  }
}

export async function deleteProject(prevState: { error: string, success: boolean }, formData: FormData) {
  const workspaceId = formData.get("workspaceId") as string;
  const projectId = formData.get("projectId") as string;

  if (!workspaceId || !projectId) {
    return { error: "Workspace ID and project ID are required.", success: false };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/workspaces/${workspaceId}/projects/${projectId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.message || "Failed to delete project.", success: false };
    }

    revalidatePath(`/workspaces/${workspaceId}/projects`);
    return { success: true, error: "" };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { error: "An unexpected error occurred.", success: false };
  }
}
