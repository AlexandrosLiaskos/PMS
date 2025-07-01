"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FolderOpen, Users, TrendingUp } from "lucide-react";
import { NumberTicker } from "@/components/magicui/number-ticker";

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
      <Card className="w-full mb-6 border border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full mb-6 border border-red-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-red-600">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      label: "Workspaces",
      value: stats.workspaceCount,
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Projects", 
      value: stats.projectCount,
      icon: FolderOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Members",
      value: stats.memberCount,
      icon: Users,
      color: "text-primary", 
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <Card className="w-full mb-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {statItems.map((item, index) => (
            <div key={item.label} className="flex items-center justify-between px-4 py-2 hover:bg-muted/30 transition-colors">
              <div className="flex items-center space-x-2">
                <div className={`p-1 rounded-md ${item.bgColor}`}>
                  <item.icon className={`w-3 h-3 ${item.color}`} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </div>
              <div className="text-sm font-bold text-foreground">
                <NumberTicker value={item.value} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
