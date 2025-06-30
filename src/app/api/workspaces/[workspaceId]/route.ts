import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { workspaces, users } from "@/db/schema";
import { eq } from "drizzle-orm";
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

  const [workspace] = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));

  if (!workspace || workspace.userId !== user.id) {
    return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
  }

  return NextResponse.json(workspace);
}


export async function PUT(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId } = await params;
  const { name } = await request.json();

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  try {
    const [updatedWorkspace] = await db.update(workspaces)
      .set({ name })
      .where(eq(workspaces.id, workspaceId))
      .where(eq(workspaces.userId, user.id))
      .returning();

    if (!updatedWorkspace) {
      return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json(updatedWorkspace);
  } catch (error) {
    console.error("Error updating workspace:", error);
    return NextResponse.json({ message: "Error updating workspace" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { workspaceId } = await params;

  try {
    const [deletedWorkspace] = await db.delete(workspaces)
      .where(eq(workspaces.id, workspaceId))
      .where(eq(workspaces.userId, user.id))
      .returning();

    if (!deletedWorkspace) {
      return NextResponse.json({ message: "Workspace not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    return NextResponse.json({ message: "Error deleting workspace" }, { status: 500 });
  }
}
