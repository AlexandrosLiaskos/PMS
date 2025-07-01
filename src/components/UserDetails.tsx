"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function UserDetails() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <Card className="w-full mb-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        {/* User Info Section */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={session.user.image ?? ""} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground truncate">
              {session.user.name || "User"}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {session.user.email}
            </p>
          </div>
        </div>

        {/* Status Badge and Action Buttons */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">
            <User className="w-3 h-3 mr-1 text-black dark:text-white" />
            Admin
          </Badge>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild className="h-7 w-7 p-0 flex items-center justify-center">
              <Link href="/profile">
                <Settings className="w-3.5 h-3.5" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 w-7 p-0 flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
