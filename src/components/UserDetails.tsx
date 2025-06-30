"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import { cn } from "@/lib/utils";
import { User, Crown } from "lucide-react";

export default function UserDetails() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="relative">
      <Card className="w-full mb-8 bg-gradient-to-br from-background via-background to-muted/20 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 rounded-none relative">
        <BorderBeam colorFrom="#3B82F6" colorTo="#8B5CF6" borderWidth={2} size={100} duration={5} style={{ zIndex: 1000 }} />
        <CardHeader className="relative">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-primary/20 transition-all duration-300 hover:ring-primary/40">
                <AvatarImage src={session.user.image ?? ""} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-bold">
                  {session.user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full">
                <Crown className="h-3 w-3 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <AnimatedShinyText className={cn(
                "text-xl font-bold transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400"
              )}>
                {session.user.name || "User"}
              </AnimatedShinyText>

            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Admin</span>
            </div>
            <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              Online
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
