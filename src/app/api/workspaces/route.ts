import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { workspaces, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { workspaceSchema, sanitizeString } from "@/lib/validation";
import { logger } from "@/lib/logger";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const userWorkspaces = await db.select().from(workspaces).where(eq(workspaces.userId, user.id));

  return NextResponse.json(userWorkspaces);
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const validation = workspaceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: validation.error.errors[0].message }, { status: 400 });
    }

    const [newWorkspace] = await db.insert(workspaces).values({
      name: sanitizeString(validation.data.name),
      userId: user.id,
    }).returning();

    logger.info("Workspace created successfully", {
      workspaceId: newWorkspace.id,
      userId: user.id,
      workspaceName: newWorkspace.name,
    });

    return NextResponse.json(newWorkspace, { status: 201 });
  } catch (error) {
    logger.error("Error creating workspace", {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
