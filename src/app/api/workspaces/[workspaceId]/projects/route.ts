import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { projects, workspaces, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { projectSchema, validateId, sanitizeString } from "@/lib/validation";

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
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { workspaceId } = await params;

    if (!validateId(workspaceId)) {
      return NextResponse.json({ message: "Invalid workspace ID" }, { status: 400 });
    }

    const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));

    if (!workspace) {
      return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
    }

    const body = await request.json();
    const validation = projectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

    const [newProject] = await db.insert(projects).values({
      name: sanitizeString(validation.data.name),
      description: validation.data.description ? sanitizeString(validation.data.description) : null,
      workspaceId,
    }).returning();

    return NextResponse.json(newProject, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
