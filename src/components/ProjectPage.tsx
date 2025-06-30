"use client";

import React from "react";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import { ProjectRightPanel } from "@/components/ProjectRightPanel";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import MarkdownEditor from "@/components/MarkdownEditor";

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

interface ProjectPageProps {
  project: Project;
  onCreateContent: (title: string, content: string, path: string) => void;
}

export function ProjectPage({ project, onCreateContent }: ProjectPageProps) {
  const readmeContent = project.contents.find((c) => c.type === "readme")?.content || "# Project README\n\nThis is the project README content.";

  return (
    <div className="flex flex-row h-full w-full gap-6 p-6 bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0">
        <ProjectSidebar
          project={{
            id: project.id,
            name: project.name,
            description: project.description,
            createdAt: project.createdAt,
            progress: project.progress
          }}
          members={project.members.map(member => ({
            id: member.id,
            name: member.name,
            image: member.avatar
          }))}
          tasksCount={project.tasks.filter((t) => t.status !== "completed").length}
          eventsCount={project.events.filter((e) => new Date(e.date) >= new Date() && e.status === "upcoming").length}
        />
      </div>

      {/* Central Panel - README */}
      <div className="flex-grow flex flex-col h-full">
        <div className="flex-grow bg-white shadow-md rounded-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">README</h2>
          <MarkdownEditor initialContent={readmeContent} />
        </div>
        {/* Knowledge Base */}
        <KnowledgeBase contents={project.contents.filter((c) => c.type !== "readme")} onCreate={onCreateContent} />
      </div>

      {/* Right Panel - Calendar, Events, Tasks, Reminders */}
      <div className="w-64 flex-shrink-0">
        <ProjectRightPanel
          events={project.events}
          tasks={project.tasks}
          reminders={project.reminders}
        />
      </div>
    </div>
  );
}
