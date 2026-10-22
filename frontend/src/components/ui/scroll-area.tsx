"use client";

import * as React from "react";
import { ScrollArea as Sa } from "radix-ui";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof Sa.Root>,
  React.ComponentPropsWithoutRef<typeof Sa.Root>
>(({ className, children, ...props }, ref) => (
  <Sa.Root ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
    <Sa.Viewport className="h-full w-full">{children}</Sa.Viewport>
    <Sa.Scrollbar orientation="vertical" className="w-1.5 pr-px">
      <Sa.Thumb className="w-full rounded-full bg-primary/30" />
    </Sa.Scrollbar>
  </Sa.Root>
));
ScrollArea.displayName = Sa.Root.displayName;

export { ScrollArea };
