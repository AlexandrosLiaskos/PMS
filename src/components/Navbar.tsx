"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <Link href="/">
        <h1 className="text-2xl font-bold">PMS</h1>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/home">
          <Button variant="ghost">Workspaces</Button>
        </Link>
        <Link href="/tasks">
          <Button variant="ghost">Tasks</Button>
        </Link>
        {session?.user ? (
          <Link href="/profile">
            <Avatar>
              <AvatarImage src={session.user.image ?? ""} />
              <AvatarFallback>
                {session.user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : (
          <>
            <Link href="/login">
              <Button>Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
