// modules/loans/LoanList.tsx
"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoanTable } from "./components/LoanTable";
import { useLoansList } from "./hooks/useLoans";

export default function LoanList() {
  const { data, isLoading } = useLoansList();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Loans"
        description="Manage loan applications and their lifecycle"
        action={
          <Link href="/loans/new" className={buttonVariants()}>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Link>
        }
      />
      <LoanTable data={data} loading={isLoading} />
    </div>
  );
}
