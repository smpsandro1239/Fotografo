"use client";

import * as React from "react";
import { DropdownMenu as DMP } from "radix-ui";
import { cn } from "@/lib/utils";

const DropdownMenu = DMP.Root;
const DropdownMenuTrigger = DMP.Trigger;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DMP.Content>,
  React.ComponentPropsWithoutRef<typeof DMP.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DMP.Portal>
    <DMP.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn("z-50 min-w-[10rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)}
      {...props}
    />
  </DMP.Portal>
));
DropdownMenuContent.displayName = DMP.Content.displayName;

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DMP.Item>,
  React.ComponentPropsWithoutRef<typeof DMP.Item>
>(({ className, ...props }, ref) => (
  <DMP.Item ref={ref} className={cn("relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none", className)} {...props} />
));
DropdownMenuItem.displayName = DMP.Item.displayName;

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DMP.Label>,
  React.ComponentPropsWithoutRef<typeof DMP.Label>
>(({ className, ...props }, ref) => (
  <DMP.Label ref={ref} className={cn("px-2 py-1.5 text-sm font-semibold", className)} {...props} />
));
DropdownMenuLabel.displayName = DMP.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DMP.Separator>,
  React.ComponentPropsWithoutRef<typeof DMP.Separator>
>(({ className, ...props }, ref) => (
  <DMP.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
));
DropdownMenuSeparator.displayName = DMP.Separator.displayName;

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator };
