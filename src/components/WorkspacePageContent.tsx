"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ProjectList from "@/components/ProjectList";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { WorkspaceSidePanel } from "@/components/WorkspaceSidePanel";

interface Project {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
}

interface WorkspaceDetails {
  id: string;
  name: string;
  userId: string;
}

import React from "react";

export default function WorkspacePageContent({ params }: { params: { workspaceId: string | Promise<string> } }) {
  const resolvedParams = React.use(params);
  const { workspaceId } = resolvedParams;
  const { status } = useSession();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<WorkspaceDetails | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      if (status === "authenticated" && workspaceId) {
        try {
          // Fetch workspace details
          const workspaceResponse = await fetch(`/api/workspaces/${workspaceId}`);
          if (!workspaceResponse.ok) {
            throw new Error(`Error fetching workspace: ${workspaceResponse.status} ${workspaceResponse.statusText}`);
          }
          const workspaceData = await workspaceResponse.json();
          setWorkspace(workspaceData);

          // Fetch projects for the workspace
          const projectsResponse = await fetch(`/api/workspaces/${workspaceId}/projects`);
          if (!projectsResponse.ok) {
            throw new Error(`Error fetching projects: ${projectsResponse.status} ${projectsResponse.statusText}`);
          }
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);

        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          }
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [workspaceId, status]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Loading workspace details...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold text-red-500">Error: {error}</h1>
      </main>
    );
  }

  if (!workspace) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Workspace not found.</h1>
      </main>
    );
  }

  return (
    <div className="flex">
      <WorkspaceSidePanel workspaceId={workspaceId} workspaceName={workspace.name} />
      <main className="flex-1 flex flex-col pt-8 px-24">
        <div className="flex justify-start mb-8 pl-4">
          <InteractiveHoverButton onClick={() => router.push("/home")}>Back to Workspaces</InteractiveHoverButton>
        </div>
        <div className="w-full max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <ProjectList projects={projects} />
        </div>
      </main>
    </div>
  );
}
