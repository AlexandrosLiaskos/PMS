import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { reminders, projects, workspaces, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ workspaceId: string; projectId: string; reminderId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId, projectId, reminderId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  const [project] = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)));

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const [reminder] = await db.select().from(reminders).where(and(eq(reminders.id, reminderId), eq(reminders.projectId, projectId)));

  if (!reminder) {
    return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
  }

  return NextResponse.json(reminder);
}

export async function PUT(request: Request, { params }: { params: Promise<{ workspaceId: string; projectId: string; reminderId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId, projectId, reminderId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  const [project] = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)));

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const [reminder] = await db.select().from(reminders).where(and(eq(reminders.id, reminderId), eq(reminders.projectId, projectId)));

  if (!reminder) {
    return NextResponse.json({ message: "Reminder not found" }, { status: 404 });
  }

  const { title, description, dueDate, status } = await request.json();

  try {
    const [updatedReminder] = await db.update(reminders)
      .set({
        title: title || reminder.title,
        description: description !== undefined ? description : reminder.description,
        dueDate: dueDate || reminder.dueDate,
        status: status || reminder.status,
      })
      .where(eq(reminders.id, reminderId))
      .returning();

    return NextResponse.json(updatedReminder);
  } catch (error) {
    console.error("Error updating reminder:", error);
    return NextResponse.json({ message: "Error updating reminder" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ workspaceId: string; projectId: string; reminderId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId, projectId, reminderId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  const [project] = await db.select().from(projects).where(and(eq(projects.id, projectId), eq(projects.workspaceId, workspaceId)));

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  try {
    const [deletedReminder] = await db.delete(reminders)
      .where(and(eq(reminders.id, reminderId), eq(reminders.projectId, projectId)))
      .returning();

    if (!deletedReminder) {
      return NextResponse.json({ message: "Reminder not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Reminder deleted successfully" });
  } catch (error) {
    console.error("Error deleting reminder:", error);
    return NextResponse.json({ message: "Error deleting reminder" }, { status: 500 });
  }
}
