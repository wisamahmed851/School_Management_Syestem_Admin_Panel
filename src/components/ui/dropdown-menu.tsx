"use client";

import * as React from "react";
import { Menu } from "@base-ui/react/menu";
import { cn } from "cn";

// ─── Root ─────────────────────────────────────────────────────────────────────
const DropdownMenu = Menu.Root;

// ─── Trigger ──────────────────────────────────────────────────────────────────
const DropdownMenuTrigger = Menu.Trigger;

// ─── Portal ───────────────────────────────────────────────────────────────────
const DropdownMenuPortal = Menu.Portal;

// ─── Positioner ───────────────────────────────────────────────────────────────
function DropdownMenuPositioner({
  className,
  ...props
}: Menu.Positioner.Props) {
  return (
    <Menu.Positioner
      className={cn("z-50 outline-none", className)}
      {...props}
    />
  );
}

// ─── Content ──────────────────────────────────────────────────────────────────
function DropdownMenuContent({
  className,
  ...props
}: Menu.Popup.Props) {
  return (
    <Menu.Popup
      data-slot="dropdown-menu-content"
      className={cn(
        "min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card p-1 text-card-foreground shadow-md",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "data-[starting-style]:scale-95 data-[ending-style]:scale-95",
        "transition-[opacity,transform] duration-100 ease-out",
        className
      )}
      {...props}
    />
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────
function DropdownMenuItem({
  className,
  ...props
}: Menu.Item.Props) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  );
}

// ─── Separator ────────────────────────────────────────────────────────────────
function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

// ─── Label ────────────────────────────────────────────────────────────────────
function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
};
