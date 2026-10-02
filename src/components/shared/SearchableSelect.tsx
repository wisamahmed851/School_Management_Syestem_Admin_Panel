"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";

export interface SearchableSelectOption {
  id: number;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  value: number | null;
  onChange: (id: number | null) => void;
  /** Called (debounced ~300 ms) when the user types in the search box */
  onSearch: (query: string) => void;
  options: SearchableSelectOption[];
  isLoading: boolean;
  placeholder?: string;
  emptyMessage?: string;
  /** Allow clearing the selection (renders a "— None —" option at the top) */
  clearable?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
}

export function SearchableSelect({
  value,
  onChange,
  onSearch,
  options,
  isLoading,
  placeholder = "Select…",
  emptyMessage = "No results found.",
  clearable = false,
  className,
  "aria-invalid": ariaInvalid,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedOption = options.find((o) => o.id === value) ?? null;

  const handleInputChange = useCallback(
    (val: string) => {
      setInputValue(val);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(val);
      }, 300);
    },
    [onSearch]
  );

  // Reset search when popover closes
  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setInputValue("");
      if (debounceRef.current) clearTimeout(debounceRef.current);
    }
  };

  const handleSelect = (id: number | null) => {
    onChange(id);
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        aria-invalid={ariaInvalid}
        className={cn(
          "flex h-8 w-full items-center justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none",
          "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          !selectedOption && "text-muted-foreground",
          className
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
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
          className="ml-2 shrink-0 text-muted-foreground"
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--anchor-width)] min-w-[220px] p-0"
        side="bottom"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search…"
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandList>
            {isLoading ? (
              <div className="p-2 space-y-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-7 w-full rounded-sm" />
                ))}
              </div>
            ) : (
              <>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {clearable && (
                    <CommandItem
                      value="__clear__"
                      onSelect={() => handleSelect(null)}
                      className="text-muted-foreground"
                    >
                      — None —
                    </CommandItem>
                  )}
                  {options.map((opt) => (
                    <CommandItem
                      key={opt.id}
                      value={String(opt.id)}
                      data-checked={value === opt.id}
                      onSelect={() => handleSelect(opt.id)}
                    >
                      <div className="flex flex-col">
                        <span>{opt.label}</span>
                        {opt.sublabel && (
                          <span className="text-xs text-muted-foreground">
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SearchableSelect;
