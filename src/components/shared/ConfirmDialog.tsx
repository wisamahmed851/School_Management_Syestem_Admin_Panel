"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  /** The element that opens the dialog (e.g. a Delete button) */
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Called when the user clicks the confirm button */
  onConfirm: () => void;
  /** Show destructive styling on the confirm button */
  destructive?: boolean;
  /** Show loading state on confirm button */
  isLoading?: boolean;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  destructive = false,
  isLoading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger render={<span className="contents" />}>
        {trigger}
      </DialogTrigger>

      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" />
            }
          >
            {cancelLabel}
          </DialogClose>

          <Button
            variant={destructive ? "destructive" : "default"}
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? "Please wait…" : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDialog;
