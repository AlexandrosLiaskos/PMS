"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProjectForm } from "@/components/EditProjectForm";
import { DeleteProjectDialog } from "@/components/DeleteProjectDialog";

interface Project {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
}

interface ProjectListProps {
  projects: Project[]; // Changed to receive projects as prop
}

export function ProjectList({ projects }: ProjectListProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  // No longer fetching projects here, they are passed as a prop
  // No longer managing new project state here, that's handled by CreateProjectForm

  // No longer handling create/delete project directly here, actions are used

  return (
    <div className="w-full">
      {/* Create Project Dialog is now handled in page.tsx */}

      {!projects || projects.length === 0 ? (
        <p>No projects found in this workspace. Create one above!</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="flex items-center justify-between border-primary shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
              <CardHeader className="p-4">
                <CardTitle className="text-xl">{project.name}</CardTitle>
                {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
              </CardHeader>
              <CardContent className="p-4 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert(`Navigating to project: ${project.name}`)} // Placeholder for navigation
                >
                  View Details
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingProject(project)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeletingProject(project)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingProject && (
        <EditProjectForm
          workspaceId={editingProject.workspaceId}
          project={editingProject}
          onOpenChange={(open) => {
            if (!open) setEditingProject(null);
          }}
        />
      )}

      {deletingProject && (
        <DeleteProjectDialog
          workspaceId={deletingProject.workspaceId}
          projectId={deletingProject.id}
          projectName={deletingProject.name}
          onOpenChange={(open) => {
            if (!open) setDeletingProject(null);
          }}
        />
      )}
    </div>
  );
}
