// modules/banks/modals/BankFormModal.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useCreateBank, useUpdateBank } from "../hooks/useBanks";
import type { Bank } from "../types";

const schema = z.object({
  bank_name: z.string().min(1, "Bank name is required"),
  short_code: z.string().optional(),
  is_active: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function BankFormModal({
  open,
  onOpenChange,
  bank,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bank?: Bank | null;
}) {
  const isEdit = Boolean(bank);
  const createM = useCreateBank();
  const updateM = useUpdateBank(bank?.bank_id);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      bank_name: "",
      short_code: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        bank_name: bank?.bank_name ?? "",
        short_code: bank?.short_code ?? "",
        is_active: bank?.is_active ?? true,
      });
    }
  }, [open, bank, form]);

  const onSubmit = form.handleSubmit((values) => {
    const done = () => {
      onOpenChange(false);
      form.reset();
    };

    if (isEdit && bank) {
      updateM.mutate(
        {
          bank_name: values.bank_name,
          short_code: values.short_code,
          is_active: values.is_active,
        },
        { onSuccess: done },
      );
    } else {
      createM.mutate(
        {
          bank_name: values.bank_name,
          short_code: values.short_code,
        },
        { onSuccess: done },
      );
    }
  });

  const isPending = createM.isPending || updateM.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Bank" : "Add Bank"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the partner bank details."
              : "Register a new partner bank for loan disbursements."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bank_name">
              Bank Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="bank_name"
              placeholder="e.g., State Bank of India"
              {...form.register("bank_name")}
            />
            {form.formState.errors.bank_name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.bank_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="short_code">Short Code</Label>
            <Input
              id="short_code"
              placeholder="e.g., SBI"
              {...form.register("short_code")}
            />
          </div>

          {isEdit && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="is_active" className="text-sm">
                  Active
                </Label>
                <p className="text-xs text-muted-foreground">
                  Inactive banks won't appear in new loan applications.
                </p>
              </div>
              <Switch
                id="is_active"
                checked={form.watch("is_active") ?? true}
                onCheckedChange={(v: any) => form.setValue("is_active", v)}
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Add Bank"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
