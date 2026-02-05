import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";

interface GamingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function GamingInput({ className, label, ...props }: GamingInputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-gaming tracking-widest text-muted-foreground uppercase">
          {label}
        </label>
      )}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg opacity-30 group-focus-within:opacity-100 transition duration-300 blur-sm" />
        <Input
          className={cn(
            "relative bg-background border-border text-foreground placeholder:text-muted-foreground/50",
            "font-gaming tracking-wider h-12 px-4 text-lg",
            "focus-visible:ring-0 focus-visible:border-transparent",
            "transition-all duration-300",
            className
          )}
          {...props}
        />
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-primary group-focus-within:w-full transition-all duration-300 ease-out" />
      </div>
    </div>
  );
}
