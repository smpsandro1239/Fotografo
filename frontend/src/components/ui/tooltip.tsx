"use client";

import * as React from "react";
import { Tooltip as T } from "radix-ui";
import { cn } from "@/lib/utils";

const TooltipProvider = T.Provider;
const Tooltip = T.Root;

const TooltipTrigger = T.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof T.Content>,
  React.ComponentPropsWithoutRef<typeof T.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <T.Portal>
    <T.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground", className)}
      {...props}
    />
  </T.Portal>
));
TooltipContent.displayName = T.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
