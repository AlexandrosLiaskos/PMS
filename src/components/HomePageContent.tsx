"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import WorkspaceList from "@/components/WorkspaceList";
import UserDetails from "@/components/UserDetails";
import DashboardStats from "@/components/DashboardStats";

export default function HomePageContent() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </main>
    );
  }

  if (status === "authenticated") {
    return (
      <main className="flex min-h-screen p-8">
        <div className="w-56 p-4">
          {/* Left Side Panel */}
          <UserDetails />
          <DashboardStats />
        </div>
        <div className="w-3/4 pl-8 border-l">
          {/* Right Main Content */}
          
          <WorkspaceList />
        </div>
      </main>
    );
  }

  return null; // Should not reach here
}
