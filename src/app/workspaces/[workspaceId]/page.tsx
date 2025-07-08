"use client";

import { SessionProvider } from "next-auth/react";
import WorkspacePageContent from "@/components/WorkspacePageContent";

export default function WorkspaceDetailPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  return (
    <SessionProvider>
      <WorkspacePageContent params={params} />
    </SessionProvider>
  );
}
