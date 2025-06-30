import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Define the path to save the image
  const uploadDir = path.join(process.cwd(), "public", "avatars");
  const filename = `${user.id}-${Date.now()}${path.extname(file.name)}`;
  const filePath = path.join(uploadDir, filename);
  const publicPath = `/avatars/${filename}`;

  try {
    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });

    await writeFile(filePath, buffer);

    // Update user's image in the database
    await db.update(users).set({ image: publicPath }).where(eq(users.id, user.id));

    return NextResponse.json({ message: "Avatar uploaded successfully", imageUrl: publicPath });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return NextResponse.json({ message: "Error uploading avatar" }, { status: 500 });
  }
}
