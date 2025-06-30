"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkspaceSidePanelProps {
  workspaceId: string;
  workspaceName: string;
}

export function WorkspaceSidePanel({ workspaceId, workspaceName }: WorkspaceSidePanelProps) {
  const { data: session } = useSession();
  const [projectCount, setProjectCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProjectCount() {
      if (workspaceId) {
        try {
          const response = await fetch(`/api/workspaces/${workspaceId}/projects`);
          if (response.ok) {
            const projects = await response.json();
            setProjectCount(projects.length);
          } else {
            console.error("Failed to fetch project count");
            setProjectCount(0);
          }
        } catch (error) {
          console.error("Error fetching project count:", error);
          setProjectCount(0);
        }
      }
    }
    fetchProjectCount();
  }, [workspaceId]);

  return (
    <div className="w-56 p-4 border-r border-gray-200 dark:border-gray-800">
      <div className="mb-6 flex flex-row items-center space-x-4 pb-2">
        <Avatar className="h-16 w-16">
          <AvatarImage src={session?.user?.image || "/avatars/default-avatar.png"} alt={session?.user?.name || "User Avatar"} />
          <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-xl">{session?.user?.name || "Guest"}</CardTitle>
          
        </div>
      </div>

      <Card className="mb-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 dark:text-gray-300">{workspaceName}</p>
        </CardContent>
      </Card>

      <Card className="mb-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">Projects:</p>
            <p className="text-base font-bold">{projectCount !== null ? projectCount : "Loading..."}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
