import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { uploadRateLimit, withRateLimit } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";

const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function validateFile(file: File): { isValid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { isValid: false, error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: "File size too large. Maximum size is 5MB." };
  }

  const extension = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return { isValid: false, error: "Invalid file extension." };
  }

  return { isValid: true };
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
}

async function deleteOldAvatar(imagePath: string): Promise<void> {
  if (imagePath && imagePath.startsWith('/avatars/')) {
    const filePath = path.join(process.cwd(), "public", imagePath);
    if (existsSync(filePath)) {
      try {
        await unlink(filePath);
      } catch {
        // Log but don't fail the request if old file deletion fails
      }
    }
  }
}

export async function POST(request: Request) {
  return withRateLimit(request, uploadRateLimit, async () => {
    try {
      const startTime = Date.now();
      const session = await getServerSession(authOptions);

      if (!session || !session.user || !session.user.email) {
        logger.authFailure("Unauthorized avatar upload attempt", {
          userAgent: request.headers.get('user-agent'),
          ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        });
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

      if (!user) {
        logger.error("User not found during avatar upload", {
          email: session.user.email,
          userId: session.user.id,
        });
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      const formData = await request.formData();
      const file = formData.get("avatar") as File | null;

      if (!file) {
        logger.warn("Avatar upload attempt without file", { userId: user.id });
        return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
      }

      const validation = validateFile(file);
      if (!validation.isValid) {
        logger.securityAlert("Invalid file upload attempt", {
          userId: user.id,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          error: validation.error,
        });
        return NextResponse.json({ message: validation.error }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Additional security check: verify file signature
      const fileSignature = buffer.subarray(0, 4);
      const isValidImage = 
        (fileSignature[0] === 0xFF && fileSignature[1] === 0xD8) || // JPEG
        (fileSignature[0] === 0x89 && fileSignature[1] === 0x50 && fileSignature[2] === 0x4E && fileSignature[3] === 0x47) || // PNG
        (buffer.subarray(8, 12).toString() === 'WEBP'); // WebP

      if (!isValidImage) {
        logger.securityAlert("File signature validation failed", {
          userId: user.id,
          fileName: file.name,
          fileType: file.type,
          signature: Array.from(fileSignature).map(b => b.toString(16)).join(' '),
        });
        return NextResponse.json({ message: "Invalid image file format" }, { status: 400 });
      }

      const uploadDir = path.join(process.cwd(), "public", "avatars");
      const sanitizedFilename = sanitizeFilename(file.name);
      const extension = path.extname(sanitizedFilename).toLowerCase();
      const filename = `${user.id}-${Date.now()}${extension}`;
      const filePath = path.join(uploadDir, filename);
      const publicPath = `/avatars/${filename}`;

      // Ensure the directory exists
      await mkdir(uploadDir, { recursive: true });

      // Delete old avatar if exists
      if (user.image) {
        await deleteOldAvatar(user.image);
      }

      await writeFile(filePath, buffer);

      // Update user's image in the database
      await db.update(users).set({ image: publicPath }).where(eq(users.id, user.id));

      const duration = Date.now() - startTime;
      logger.info("Avatar uploaded successfully", {
        userId: user.id,
        fileName: filename,
        fileSize: file.size,
        duration,
      });

      return NextResponse.json({ message: "Avatar uploaded successfully", imageUrl: publicPath });
    } catch (error) {
      logger.error("Avatar upload failed", {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
  });
}
