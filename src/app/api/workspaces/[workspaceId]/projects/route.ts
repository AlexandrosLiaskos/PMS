import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { projects, workspaces, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  const workspaceProjects = await db.select().from(projects).where(eq(projects.workspaceId, workspaceId));

  return NextResponse.json(workspaceProjects);
}

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId } = await params;

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

  if (!workspace) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  const { name, description } = await request.json();

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  try {
    const [newProject] = await db.insert(projects).values({
      name,
      description,
      workspaceId,
    }).returning();

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json({ message: "Error creating project" }, { status: 500 });
  }
}
