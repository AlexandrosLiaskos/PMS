"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardStats() {
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
      <Card className="w-full max-w-2xl mb-8">
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
      <Card className="w-full max-w-2xl mb-8">
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
    <Card className="w-full mb-6 border border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="py-2 px-4">
        <dl className="grid gap-1">
          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-gray-700 dark:text-gray-300">Workspaces:</dt>
            <dd className="text-base font-bold">{stats.workspaceCount}</dd>
          </div>

          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-gray-700 dark:text-gray-300">Projects:</dt>
            <dd className="text-base font-bold">{stats.projectCount}</dd>
          </div>

          <div className="flex items-baseline justify-between">
            <dt className="text-sm text-gray-700 dark:text-gray-300">Members:</dt>
            <dd className="text-base font-bold">{stats.memberCount}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
