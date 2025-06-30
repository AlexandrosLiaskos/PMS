"use client";

import { SessionProvider } from "next-auth/react";
import HomePageContent from "@/components/HomePageContent";

export default function HomePage() {
  return (
    <SessionProvider>
      <HomePageContent />
    </SessionProvider>
  );
}
