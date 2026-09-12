"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "cn";

// ─── Root ─────────────────────────────────────────────────────────────────────
const Select = SelectPrimitive.Root;

// ─── Trigger ──────────────────────────────────────────────────────────────────
function SelectTrigger({
  className,
  children,
  placeholder,
  ...props
}: SelectPrimitive.Trigger.Props & { placeholder?: string }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(
        "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Value placeholder={placeholder} />
      {/* Chevron */}
      <span aria-hidden className="ml-auto shrink-0 text-muted-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
      {children}
    </SelectPrimitive.Trigger>
  );
}

// ─── Positioner ───────────────────────────────────────────────────────────────
function SelectPositioner({ className, ...props }: SelectPrimitive.Positioner.Props) {
  return (
    <SelectPrimitive.Positioner
      className={cn("z-50 outline-none", className)}
      {...props}
    />
  );
}

// ─── Popup ────────────────────────────────────────────────────────────────────
function SelectContent({ className, ...props }: SelectPrimitive.Popup.Props) {
  return (
    <SelectPrimitive.Popup
      data-slot="select-content"
      className={cn(
        "min-w-[var(--anchor-width)] overflow-hidden rounded-lg border border-border bg-card p-1 text-card-foreground shadow-md",
        "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        "transition-opacity duration-100",
        className
      )}
      {...props}
    />
  );
}

// ─── Item ─────────────────────────────────────────────────────────────────────
function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[selected]:font-medium",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

// ─── Portal ───────────────────────────────────────────────────────────────────
const SelectPortal = SelectPrimitive.Portal;

// ─── Convenience compound component ──────────────────────────────────────────
export interface SelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
}

/**
 * SimpleSelect — the component pages actually use.
 * Wraps Root + Trigger + Portal + Positioner + Content + Items into one call.
 */
function SimpleSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  disabled,
  className,
  "aria-invalid": ariaInvalid,
}: SimpleSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger
        placeholder={placeholder}
        className={className}
        aria-invalid={ariaInvalid}
      />
      <SelectPortal>
        <SelectPositioner sideOffset={4}>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectPositioner>
      </SelectPortal>
    </Select>
  );
}

export {
  Select,
  SelectTrigger,
  SelectPortal,
  SelectPositioner,
  SelectContent,
  SelectItem,
  SimpleSelect,
};
