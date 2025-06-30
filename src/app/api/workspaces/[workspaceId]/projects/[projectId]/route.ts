import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { projects, workspaces, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ workspaceId: string; projectId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId, projectId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  const [project] = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)));

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ workspaceId: string, projectId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId, projectId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  try {
    const [deletedProject] = await db.delete(projects)
      .where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)))
      .returning();

    if (!deletedProject) {
      return NextResponse.json({ message: "Project not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ message: "Error deleting project" }, { status: 500 });
  }
}
