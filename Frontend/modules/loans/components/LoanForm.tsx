// modules/loans/components/LoanForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertTriangle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBanksList } from "@/modules/banks/hooks/useBanks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useCreateLoan } from "../hooks/useLoans";
import { useCustomersList } from "@/modules/customers/hooks/useCustomers";
import { useAuthStore } from "@/store/authStore";
import { ROLE, LOAN_TYPES, KYC_STATUS } from "@/lib/constants/statuses";
import { type SelectOption, optionTag } from "@/lib/format";

// ---- Static options ----
const LOAN_TYPE_OPTIONS: SelectOption[] = LOAN_TYPES.map((t) => ({
  value: t,
  tag: t,
}));

const INTEREST_TYPE_OPTIONS: SelectOption[] = [
  { value: "flat", tag: "Flat" },
  { value: "reducing", tag: "Reducing Balance" },
];

const schema = z.object({
  customer_id: z.number({ message: "Select a customer" }),
  loan_type: z.string().min(1, "Select loan type"),
  bank_id: z.number().optional(),
  requested_amount: z
    .number({ message: "Enter amount" })
    .positive("Must be positive"),
  tenure_months: z
    .number({ message: "Enter tenure" })
    .int()
    .positive("Must be positive"),
  interest_rate: z
    .number({ message: "Enter rate" })
    .min(0, "Must be 0 or more")
    .max(100, "Cannot exceed 100%"),
  interest_type: z.enum(["flat", "reducing"]),
  purpose: z.string().min(3, "Describe the purpose"),
});

type FormValues = z.infer<typeof schema>;

export function LoanForm() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === ROLE.ADMIN;

  const { data: customers, isLoading: loadingCustomers } = useCustomersList();
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );
  const { data: banks, isLoading: loadingBanks } = useBanksList();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      loan_type: "Personal",
      requested_amount: 0,
      tenure_months: 12,
      interest_rate: 12,
      interest_type: "flat",
      purpose: "",
    },
  });

  const createM = useCreateLoan();

  const selectedCustomer = useMemo(
    () => customers?.find((c) => c.customer_id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId],
  );

  const eligibleCustomers = useMemo(() => {
    if (!customers) return [];
    const q = customerSearch.trim().toLowerCase();
    return customers.filter((c) => {
      if (c.kyc_status !== KYC_STATUS.APPROVED) return false;
      if (!q) return true;
      return (
        c.first_name.toLowerCase().includes(q) ||
        c.last_name.toLowerCase().includes(q) ||
        c.primary_phone.includes(q)
      );
    });
  }, [customers, customerSearch]);

  // ---- Dynamic bank options ----
  const bankOptions = useMemo<SelectOption[]>(
    () =>
      (banks ?? [])
        .filter((b) => b.is_active)
        .map((b) => ({
          value: String(b.bank_id),
          tag: `${b.bank_name}${b.short_code ? ` (${b.short_code})` : ""}`,
        })),
    [banks],
  );

  // ---- Watch form values ONCE ----
  const loanType = form.watch("loan_type");
  const interestType = form.watch("interest_type");
  const selectedBankId = form.watch("bank_id");

  // ---- Derive tags ----
  const loanTypeTag = optionTag(LOAN_TYPE_OPTIONS, loanType) ?? "Select type";
  const interestTypeTag =
    optionTag(INTEREST_TYPE_OPTIONS, interestType) ?? "Select type";
  const selectedBankTag =
    optionTag(bankOptions, selectedBankId) ?? "Select bank for submission";

  const onSubmit = form.handleSubmit((values) => {
    createM.mutate(values, {
      onSuccess: (res) => router.push(`/loans/${res.loan_id}`),
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Customer Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingCustomers ? (
            <p className="text-sm text-muted-foreground">
              Loading customers...
            </p>
          ) : (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or phone (only KYC-approved shown)"
                  className="pl-9"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>

              {!customerSearch && !selectedCustomerId && (
                <p className="text-xs text-muted-foreground">
                  Start typing to find a KYC-approved customer.
                </p>
              )}

              {customerSearch && eligibleCustomers.length === 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    No KYC-approved customer matches "{customerSearch}". Approve
                    their KYC first.
                  </AlertDescription>
                </Alert>
              )}

              {customerSearch && eligibleCustomers.length > 0 && (
                <ul className="max-h-60 divide-y overflow-y-auto rounded-lg border">
                  {eligibleCustomers.slice(0, 20).map((c) => (
                    <li key={c.customer_id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCustomerId(c.customer_id);
                          form.setValue("customer_id", c.customer_id, {
                            shouldValidate: true,
                          });
                          setCustomerSearch("");
                        }}
                        className="flex w-full items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-muted/50"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {c.first_name} {c.last_name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {c.primary_phone}
                          </p>
                        </div>
                        <span className="text-xs text-emerald-600">
                          KYC approved
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {selectedCustomer && (
                <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                  <div>
                    <p className="text-sm font-medium">
                      {selectedCustomer.first_name} {selectedCustomer.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {selectedCustomer.primary_phone} •{" "}
                      {selectedCustomer.national_id_number}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCustomerId(null);
                      form.setValue("customer_id", undefined as any);
                    }}
                  >
                    Change
                  </Button>
                </div>
              )}

              {form.formState.errors.customer_id && !selectedCustomer && (
                <p className="text-xs text-destructive">
                  Please select a customer.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Loan Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Loan Type</Label>
            <Select
              value={loanType}
              onValueChange={(v) => form.setValue("loan_type", v ?? "")}
            >
              <SelectTrigger>
                <span>{loanTypeTag}</span>
              </SelectTrigger>
              <SelectContent>
                {LOAN_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Requested Amount</Label>
            <Input
              type="number"
              placeholder="50000"
              {...form.register("requested_amount", {
                setValueAs: (v) => (v === "" ? 0 : Number(v)),
              })}
            />
            {form.formState.errors.requested_amount && (
              <p className="text-xs text-destructive">
                {form.formState.errors.requested_amount.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tenure (months)</Label>
            <Input
              type="number"
              placeholder="12"
              {...form.register("tenure_months", {
                setValueAs: (v) => (v === "" ? 0 : Number(v)),
              })}
            />
            {form.formState.errors.tenure_months && (
              <p className="text-xs text-destructive">
                {form.formState.errors.tenure_months.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Interest Rate (% p.a.)</Label>
            <Input
              type="number"
              step="0.1"
              placeholder="12"
              {...form.register("interest_rate", {
                setValueAs: (v) => (v === "" ? 0 : Number(v)),
              })}
            />
            {form.formState.errors.interest_rate && (
              <p className="text-xs text-destructive">
                {form.formState.errors.interest_rate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Interest Type</Label>
            <Select
              value={interestType}
              onValueChange={(v) =>
                form.setValue(
                  "interest_type",
                  (v ?? "flat") as "flat" | "reducing",
                )
              }
            >
              <SelectTrigger>
                <span>{interestTypeTag}</span>
              </SelectTrigger>
              <SelectContent>
                {INTEREST_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {interestType === "flat"
                ? "Interest on original principal for the full tenure."
                : "Interest on outstanding balance (standard amortized)."}
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Purpose</Label>
            <Textarea
              rows={3}
              placeholder="e.g., Small shop expansion"
              {...form.register("purpose")}
            />
            {form.formState.errors.purpose && (
              <p className="text-xs text-destructive">
                {form.formState.errors.purpose.message}
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Partner Bank (optional)</Label>
            <Select
              value={selectedBankId ? String(selectedBankId) : ""}
              onValueChange={(v) =>
                form.setValue("bank_id", v ? Number(v) : undefined)
              }
              disabled={loadingBanks}
            >
              <SelectTrigger>
                <span
                  className={!selectedBankId ? "text-muted-foreground" : ""}
                >
                  {selectedBankTag}
                </span>
              </SelectTrigger>
              <SelectContent>
                {bankOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Select the partner bank where this loan will be submitted.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={createM.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createM.isPending || !selectedCustomer}>
          {createM.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </Button>
      </div>
    </form>
  );
}
