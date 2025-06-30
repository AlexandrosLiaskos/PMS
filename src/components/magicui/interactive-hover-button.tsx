import React from "react";
import { cn } from "@/lib/utils";

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative min-w-[220px] h-10 cursor-pointer overflow-hidden rounded-full border bg-background p-2 px-6 text-center font-semibold",
        className,
      )}
      {...props}
    >
      <span className="absolute inset-0 flex items-center justify-center text-sm px-4 py-2 transition-all duration-300 group-hover:translate-x-full group-hover:opacity-0">
        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
        {children}
      </span>

      <div className="absolute inset-0 flex items-center justify-center text-sm px-4 py-2 translate-x-[-100%] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 bg-black text-white">
        <span>{children}</span>
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
