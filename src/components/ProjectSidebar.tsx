import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedCircularProgressBar } from "@/components/magicui/animated-circular-progress-bar";
import { format } from "date-fns";

interface ProjectSidebarProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    createdAt: string;
    progress?: number;
  };
  members: Array<{
    id: string;
    name: string | null;
    image: string | null;
  }>;
  tasksCount: number;
  eventsCount: number;
}

export function ProjectSidebar({
  project,
  members,
  tasksCount,
  eventsCount,
}: ProjectSidebarProps) {
  const progressValue = project.progress || 0;
  const formattedDate = format(new Date(project.createdAt), "MMM d, yyyy");

  return (
    <div className="flex flex-col gap-6 w-full max-w-[300px] h-full">
      {/* Project Metadata */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{project.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-sm text-gray-600">{project.description || "No description provided."}</p>
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <div className="grid grid-cols-2 text-sm">
              <div className="flex justify-between items-center p-2 border-b border-r border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Created:</span>
                <span className="text-gray-600 dark:text-gray-400">{formattedDate}</span>
              </div>
              <div className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Members:</span>
                <span className="text-gray-600 dark:text-gray-400">{members.length}</span>
              </div>
              <div className="flex justify-between items-center p-2 border-r border-gray-200 dark:border-gray-700">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Tasks:</span>
                <span className="text-gray-600 dark:text-gray-400">{tasksCount}</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Events:</span>
                <span className="text-gray-600 dark:text-gray-400">{eventsCount}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold mb-2">Progress:</span>
            <AnimatedCircularProgressBar
              max={100}
              min={0}
              value={progressValue}
              gaugePrimaryColor="rgb(var(--primary-rgb))"
              gaugeSecondaryColor="rgba(var(--primary-rgb), 0.2)"
              className="w-24 h-24"
            />
            <span className="mt-2 text-sm">{progressValue}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col items-center">
                <Avatar className="w-12 h-12">
                  {member.image ? (
                    <AvatarImage src={member.image} alt={member.name || "Member"} />
                  ) : (
                    <AvatarFallback>{member.name?.charAt(0) || "M"}</AvatarFallback>
                  )}
                </Avatar>
                <span className="text-xs mt-1 text-center truncate w-16">{member.name || "Unknown"}</span>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-sm text-gray-500">No members assigned.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
