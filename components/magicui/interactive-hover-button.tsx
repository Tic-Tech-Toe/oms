import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full border bg-background px-6 py-2 font-semibold text-center overflow-hidden transition-all duration-300 ease-in-out",
        "hover:pr-12", // this makes room for arrow when hovered
        className
      )}
      {...props}
    >
      {/* Initial dot + text */}
      <div className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-[-100%] group-hover:opacity-0">
        <div className="h-2 w-2 rounded-full bg-primary transition-all duration-300 group-hover:scale-[100.8]" />
        <span>{children}</span>
      </div>

      {/* Hover text + arrow */}
      <div className="absolute left-6 flex items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-6">
        <span>{children}</span>
        <ArrowRight size={18} />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
