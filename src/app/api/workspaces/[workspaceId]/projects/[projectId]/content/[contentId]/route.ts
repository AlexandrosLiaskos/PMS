import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { projectContent, projects, workspaces, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ workspaceId: string; projectId: string; contentId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId, projectId, contentId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  const [project] = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)));

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const [content] = await db.select().from(projectContent).where(and(eq(projectContent.id, contentId), eq(projectContent.projectId, projectId)));

  if (!content) {
    return NextResponse.json({ message: "Content not found" }, { status: 404 });
  }

  return NextResponse.json(content);
}

export async function PUT(request: Request, { params }: { params: Promise<{ workspaceId: string; projectId: string; contentId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId, projectId, contentId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  const [project] = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)));

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const [content] = await db.select().from(projectContent).where(and(eq(projectContent.id, contentId), eq(projectContent.projectId, projectId)));

  if (!content) {
    return NextResponse.json({ message: "Content not found" }, { status: 404 });
  }

  const { type, title, content: newContent, path } = await request.json();

  try {
    const [updatedContent] = await db.update(projectContent)
      .set({
        type: type || content.type,
        title: title !== undefined ? title : content.title,
        content: newContent !== undefined ? newContent : content.content,
        path: path !== undefined ? path : content.path,
      })
      .where(eq(projectContent.id, contentId))
      .returning();

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json({ message: "Error updating content" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ workspaceId: string; projectId: string; contentId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId, projectId, contentId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  const [project] = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)));

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  try {
    const [deletedContent] = await db.delete(projectContent)
      .where(and(eq(projectContent.id, contentId), eq(projectContent.projectId, projectId)))
      .returning();

    if (!deletedContent) {
      return NextResponse.json({ message: "Content not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    return NextResponse.json({ message: "Error deleting content" }, { status: 500 });
  }
}
