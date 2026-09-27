// modules/loans/LoanCreate.tsx
"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { LoanForm } from "./components/LoanForm";

export default function LoanCreate() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Loan Application"
        description="Only KYC-approved customers can be selected."
      />
      <LoanForm />
    </div>
  );
}
