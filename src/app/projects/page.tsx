import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { users, workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Unauthorized</h1>
        <p className="text-lg mt-4">Please log in to view your projects.</p>
      </main>
    );
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">User Not Found</h1>
        <p className="text-lg mt-4">Your user profile could not be found.</p>
      </main>
    );
  }

  const userWorkspaces = await db.select().from(workspaces).where(eq(workspaces.userId, user.id));

  if (userWorkspaces.length > 0) {
    redirect(`/workspaces/${userWorkspaces[0].id}/projects`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <h1 className="text-4xl font-bold mb-4">No Workspaces Found</h1>
      <p className="text-lg mb-8">
        It looks like you don't have any workspaces yet. Projects belong to workspaces.
      </p>
      <Link href="/">
        <Button size="lg">Create Your First Workspace</Button>
      </Link>
    </main>
  );
}