"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";

export default function DashboardStats() {
  useSession();
  const [stats, setStats] = useState({
    workspaceCount: 0,
    projectCount: 0,
    memberCount: 0, // Placeholder for future implementation
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch workspaces to get count
        const workspacesResponse = await fetch("/api/workspaces");
        if (!workspacesResponse.ok) {
          throw new Error(`Error fetching workspaces: ${workspacesResponse.status} ${workspacesResponse.statusText}`);
        }
        const workspacesData = await workspacesResponse.json();
        const workspaceCount = workspacesData.length;

        // Fetch projects for each workspace to get total project count
        let totalProjectCount = 0;
        for (const workspace of workspacesData) {
          const projectsResponse = await fetch(`/api/workspaces/${workspace.id}/projects`);
          if (!projectsResponse.ok) {
            console.warn(`Could not fetch projects for workspace ${workspace.id}: ${projectsResponse.status} ${projectsResponse.statusText}`);
            continue; // Skip this workspace if projects can't be fetched
          }
          const projectsData = await projectsResponse.json();
          totalProjectCount += projectsData.length;
        }

        setStats({
          workspaceCount,
          projectCount: totalProjectCount,
          memberCount: 0, // Still a placeholder
        });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Card className="w-full mb-8 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 rounded-none relative">
        <BorderBeam colorFrom="#3B82F6" colorTo="#8B5CF6" borderWidth={2} size={100} duration={5} style={{ zIndex: 1000 }} />
        <CardHeader>
          <CardTitle>Loading Dashboard Stats...</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fetching your personal and workspace statistics.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full mb-8 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm border-2 border-border/50 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 hover:border-primary/50">
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

    return (
      <Card className="w-full mb-6 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 rounded-none relative">
        <BorderBeam colorFrom="#3B82F6" colorTo="#8B5CF6" borderWidth={2} size={100} duration={5} style={{ zIndex: 1000 }} />
        <CardHeader className="pb-2">
        <CardTitle className="text-lg">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <dl className="grid gap-1">
          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-gray-700 dark:text-gray-300">Workspaces:</dt>
            <dd className="text-base font-bold">
              <AnimatedShinyText className={cn(
                "text-base font-bold transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
              )}>
                {stats.workspaceCount}
              </AnimatedShinyText>
            </dd>
          </div>

          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-gray-700 dark:text-gray-300">Projects:</dt>
            <dd className="text-base font-bold">
              <AnimatedShinyText className={cn(
                "text-base font-bold transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
              )}>
                {stats.projectCount}
              </AnimatedShinyText>
            </dd>
          </div>

          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-gray-700 dark:text-gray-300">Members:</dt>
            <dd className="text-base font-bold">
              <AnimatedShinyText className={cn(
                "text-base font-bold transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
              )}>
                {stats.memberCount}
              </AnimatedShinyText>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
