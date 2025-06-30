"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ProjectPage } from "@/components/ProjectPage";

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  progress: number;
  members: Array<{
    id: string;
    name: string;
    avatar: string | null;
  }>;
  events: Array<{
    id: string;
    title: string;
    description: string | null;
    date: string;
    status: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    deadline: string | null;
    status: string;
    assignedTo: string | null;
  }>;
  reminders: Array<{
    id: string;
    title: string;
    description: string | null;
    dueDate: string;
    status: string;
  }>;
  contents: Array<{
    id: string;
    title: string;
    content: string;
    path: string | null;
    type: string;
  }>;
}

export default function ProjectDetailPage() {
  const pathname = usePathname();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ workspaceId: string; projectId: string } | null>(null);

  // Access route parameters using usePathname to avoid synchronous access warnings
  useEffect(() => {
    // Note: Using usePathname to derive route parameters dynamically from the URL path,
    // which should be compatible with Next.js dev mode checks.
    if (pathname) {
      const pathSegments = pathname.split('/').filter(segment => segment);
      // Assuming path structure is /workspaces/[workspaceId]/projects/[projectId]
      if (pathSegments.length >= 4 && pathSegments[0] === 'workspaces' && pathSegments[2] === 'projects') {
        const workspaceId = pathSegments[1];
        const projectId = pathSegments[3];
        setResolvedParams({ workspaceId, projectId });
      } else {
        setError("Invalid route structure or missing parameters");
        setLoading(false);
      }
    }
  }, [pathname]);

  useEffect(() => {
    if (!resolvedParams) return;

    const { workspaceId, projectId } = resolvedParams;
    // Initialize project state with params after component mount
    setProject({
      id: projectId,
      name: "Loading Project...",
      description: "Loading project data...",
      createdAt: new Date().toISOString(),
      progress: 0,
      members: [],
      events: [],
      tasks: [],
      reminders: [],
      contents: [
        { id: "c1", title: "README", content: "# Project README\n\nLoading...", path: "", type: "readme" }
      ],
    });

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/workspaces/${workspaceId}/projects/${projectId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch project data: ${response.status}`);
        }
        const data = await response.json();
        // Merge fetched data with fallback values for missing fields
        setProject({
          id: data.id || projectId,
          name: data.name || "Unnamed Project",
          description: data.description || "No description available.",
          createdAt: data.createdAt || new Date().toISOString(),
          progress: data.progress || 0,
          members: data.members || [],
          events: data.events || [],
          tasks: data.tasks || [],
          reminders: data.reminders || [],
          contents: data.contents || [
            { id: "c1", title: "README", content: "# Project README\n\nThis is a default README.", path: "", type: "readme" }
          ],
        });
        setLoading(false);
      } catch {
        // Suppress detailed error logging to console to avoid clutter
        setError("Failed to fetch project data");
        // Fallback to dummy data if fetch fails
        setProject({
          id: projectId,
          name: "Fallback Project",
          description: "This is a fallback project due to data fetch failure.",
          createdAt: new Date().toISOString(),
          progress: 0,
          members: [],
          events: [],
          tasks: [],
          reminders: [],
          contents: [
            { id: "c1", title: "README", content: "# Project README\n\nThis is a fallback README.", path: "", type: "readme" }
          ],
        });
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [resolvedParams]);

  // Placeholder function for handling content creation
  const handleCreateContent = (title: string, content: string, path: string) => {
    // Implement logic to save new content to the database
    console.log(`New content created: ${title} at ${path}`);
  };

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">Loading project data...</div>;
  }

  if (!project) {
    return <div className="h-screen w-full flex items-center justify-center">No project data found.</div>;
  }

  // Only show error message if there was an error fetching data but fallback data is still provided
  if (error) {
    // Silently handle error without displaying it to avoid console clutter
    return (
      <div className="h-screen w-full">
        <div className="flex items-center justify-center text-yellow-500">Unable to load project data, using fallback.</div>
        <ProjectPage
          project={project}
          onCreateContent={handleCreateContent}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <ProjectPage
        project={project}
        onCreateContent={handleCreateContent}
      />
    </div>
  );
}
