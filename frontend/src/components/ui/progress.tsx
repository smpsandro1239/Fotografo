"use client";

import * as React from "react";
import { Progress as Pg } from "radix-ui";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof Pg.Root>,
  React.ComponentPropsWithoutRef<typeof Pg.Root>
>(({ className, value, ...props }, ref) => (
  <Pg.Root ref={ref} className={cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className)} {...props}>
    <Pg.Indicator className="h-full bg-primary transition-all" style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }} />
  </Pg.Root>
));
Progress.displayName = Pg.Root.displayName;

export { Progress };
