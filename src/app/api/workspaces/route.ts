import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { workspaces, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const { name } = await request.json();

  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  try {
    const [newWorkspace] = await db.insert(workspaces).values({
      name,
      userId: user.id,
    }).returning();

    return NextResponse.json(newWorkspace, { status: 201 });
  } catch (error) {
    console.error("Error creating workspace:", error);
    return NextResponse.json({ message: "Error creating workspace" }, { status: 500 });
  }
}
