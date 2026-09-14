"use client";

import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { cn } from "cn";

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

/**
 * Checkbox built on @base-ui/react/checkbox.
 * Supports the native indeterminate state via the indeterminate prop.
 */
const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      id,
      checked,
      indeterminate = false,
      onCheckedChange,
      disabled,
      className,
      "aria-label": ariaLabel,
    },
    ref
  ) => {
    const innerRef = React.useRef<HTMLButtonElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLButtonElement>) ?? innerRef;

    // Drive the native indeterminate property on the underlying input
    React.useEffect(() => {
      const el = resolvedRef.current;
      if (el) {
        if (indeterminate) {
          el.setAttribute("data-indeterminate", "");
        } else {
          el.removeAttribute("data-indeterminate");
        }
      }
    }, [indeterminate, resolvedRef]);

    return (
      <CheckboxPrimitive.Root
        ref={resolvedRef}
        id={id}
        checked={indeterminate ? "mixed" : checked}
        onCheckedChange={(val) => onCheckedChange?.(val === true)}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded border border-input bg-background",
          "outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "data-[checked]:bg-primary data-[checked]:border-primary",
          "data-[indeterminate]:bg-primary data-[indeterminate]:border-primary",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-primary-foreground">
          {indeterminate ? (
            <svg
              width="10"
              height="2"
              viewBox="0 0 10 2"
              fill="currentColor"
              aria-hidden
            >
              <rect width="10" height="2" rx="1" />
            </svg>
          ) : (
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="1 4 4 7 9 1" />
            </svg>
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
