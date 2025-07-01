"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
/* Removed unused import of BorderBeam to fix eslint error */
// import { BorderBeam } from "@/components/magicui/border-beam";
/* Replaced MagicCard with standard Card to remove animation */
// import { MagicCard } from "@/components/magicui/magic-card";
import { Card } from "@/components/ui/card";
/* Removed unused imports to fix eslint errors */
// import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
// import { cn } from "@/lib/utils";
import { User, Crown } from "lucide-react";

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
      <Card className="w-full mb-8 border-0 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 rounded-none">
        {/* Replaced MagicCard with standard Card to remove animation, added z-axis zoom effect on hover */}
        <CardHeader className="relative">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-primary/20 transition-all duration-300 hover:ring-primary/40">
                <AvatarImage src={session?.user?.image || "/avatars/default-avatar.png"} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-bold">
                  {session?.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full">
                <Crown className="h-3 w-3 text-black dark:text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold">
                {session?.user?.name || "User"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3 text-black dark:text-white" />
              <span>Admin</span>
            </div>
            <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              Online
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 border-0 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 rounded-none">
        {/* Replaced MagicCard with standard Card to remove animation, added z-axis zoom effect on hover */}
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 dark:text-gray-300">{workspaceName}</p>
        </CardContent>
      </Card>

      <Card className="mb-6 border-0 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 rounded-none">
        {/* Replaced MagicCard with standard Card to remove animation, added z-axis zoom effect on hover */}
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
