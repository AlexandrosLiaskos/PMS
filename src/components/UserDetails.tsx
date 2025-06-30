"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserDetails() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null; // Or a loading/error state if preferred
  }

  return (
    <Card className="w-full max-w-2xl mb-8 border border-gray-200 dark:border-gray-800 shadow-sm"> {/* More subtle card */}
      <CardHeader className="flex flex-row items-center justify-start space-x-4 pb-2"> {/* Align items to start, add space-x */}
        <Avatar className="h-10 w-10">
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>{session.user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        <CardTitle className="text-xl font-semibold"> {/* Simpler, slightly smaller title */}
          {session.user.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        
      </CardContent>
    </Card>
  );
}
