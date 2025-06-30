"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { CreateProjectForm } from "@/components/CreateProjectForm";
import { EditProjectForm } from "@/components/EditProjectForm";
import { DeleteProjectDialog } from "@/components/DeleteProjectDialog";
import { MoreHorizontal } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  workspaceId: string;
}

interface ProjectListProps {
  projects: Project[]; // Changed to receive projects as prop
  workspaceId: string; // Added to pass workspace ID for project creation
}

export function ProjectList({ projects, workspaceId }: ProjectListProps) {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // No longer fetching projects here, they are passed as a prop
  // No longer managing new project state here, that's handled by CreateProjectForm

  // No longer handling create/delete project directly here, actions are used

  return (
    <div className="w-full">
      {/* Create Project Dialog */}
      <CreateProjectForm workspaceId={workspaceId} />

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
              <CardContent className="p-4 flex items-center gap-2 overflow-visible">
                <InteractiveHoverButton
                  onClick={() => alert(`Navigating to project: ${project.name}`)} // Placeholder for navigation
                  className="z-[1]"
                >
                  View Details
                </InteractiveHoverButton>
                <div className="relative inline-block">
                  <Dialog open={activeMenu === project.id} onOpenChange={() => setActiveMenu(activeMenu === project.id ? null : project.id)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 border border-muted-foreground/30 shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Project Actions</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <Button
                          variant="outline"
                          className="border border-muted-foreground/30 shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md"
                          onClick={() => {
                            setEditingProject(project);
                            setActiveMenu(null);
                          }}
                        >
                          Edit Project
                        </Button>
                        <Button
                          variant="destructive"
                          className="border border-destructive/30 shadow-sm transition-transform duration-200 hover:scale-105 hover:shadow-md bg-black text-white"
                          onClick={() => {
                            setDeletingProject(project);
                            setActiveMenu(null);
                          }}
                        >
                          Delete Project
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
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
