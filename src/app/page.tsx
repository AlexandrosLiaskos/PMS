"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/home");
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
    return null; // Redirecting
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Welcome to PMS!</h1>
      <div className="flex space-x-4">
        <Link href="/login" passHref>
          <Button>Login</Button>
        </Link>
        <Link href="/register" passHref>
          <Button>Register</Button>
        </Link>
      </div>
    </main>
  );
}
