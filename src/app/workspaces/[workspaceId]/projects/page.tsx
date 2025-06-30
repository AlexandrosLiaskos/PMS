import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/db/turso";
import { projects, workspaces, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ProjectList } from "@/components/ProjectList";
import { CreateProjectForm } from "@/components/CreateProjectForm"; // We will create this component
import { notFound } from "next/navigation";

interface ProjectsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const session = await getServerSession(authOptions);

  console.log("ProjectsPage: session", session);

  if (!session || !session.user || !session.user.email) {
    console.log("ProjectsPage: Unauthorized - No session or user email");
    return <p>Unauthorized</p>;
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  console.log("ProjectsPage: user", user);

  if (!user) {
    console.log("ProjectsPage: User not found in DB");
    notFound();
  }

  const { workspaceId } = await params;
  console.log("ProjectsPage: workspaceId", workspaceId);

  const [workspace] = await db.select().from(workspaces).where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, user.id)));
  console.log("ProjectsPage: workspace", workspace);

  if (!workspace) {
    console.log("ProjectsPage: Workspace not found or not owned by user");
    notFound();
  }

  const workspaceProjects = await db.select().from(projects).where(eq(projects.workspaceId, workspaceId));
  console.log("ProjectsPage: workspaceProjects", workspaceProjects);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Projects for {workspace.name}</h1>
      {workspaceProjects.length === 0 ? (
        <p className="text-center text-lg">No projects found for this workspace. Create one below!</p>
      ) : (
        <ProjectList projects={workspaceProjects} />
      )}
      <div className="flex flex-col items-center mt-8">
        <CreateProjectForm workspaceId={workspaceId} />
      </div>
    </div>
  );
}
