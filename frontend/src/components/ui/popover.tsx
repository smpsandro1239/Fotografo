"use client";

import * as React from "react";
import { Popover as P } from "radix-ui";
import { cn } from "@/lib/utils";

const Popover = P.Root;
const PopoverTrigger = P.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof P.Content>,
  React.ComponentPropsWithoutRef<typeof P.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <P.Portal>
    <P.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none", className)}
      {...props}
    />
  </P.Portal>
));
PopoverContent.displayName = P.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
