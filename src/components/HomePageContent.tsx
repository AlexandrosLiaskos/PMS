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
    // Only redirect if we're sure the user is unauthenticated
    // Don't redirect during loading state to prevent premature redirects
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Show loading state while session is being determined
  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Loading...</h1>
      </main>
    );
  }

  // Only redirect if explicitly unauthenticated
  if (status === "unauthenticated") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold">Redirecting to login...</h1>
      </main>
    );
  }

  // Show content only when authenticated
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

  // Fallback loading state
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Loading...</h1>
    </main>
  );
}
