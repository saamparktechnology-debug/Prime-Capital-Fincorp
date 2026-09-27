// modules/banks/BankList.tsx
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { BankTable } from "./components/BankTable";
import { BankFormModal } from "./modals/BankFormModal";
import { useBanksList } from "./hooks/useBanks";
import { usePermission } from "@/lib/hooks/usePermission";
import { MODULES, ACTIONS } from "@/lib/constants/permissions";
import type { Bank } from "./types";

export default function BankList() {
  const { data, isLoading } = useBanksList();
  const { isAdmin, can } = usePermission();
  const canCreate = isAdmin || can(MODULES.CUSTOMERS, ACTIONS.CREATE);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bank | null>(null);

  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (bank: Bank) => {
    setEditing(bank);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Partner Banks"
        description="Manage partner banks for loan disbursements"
        action={
          canCreate && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Bank
            </Button>
          )
        }
      />

      <BankTable data={data} loading={isLoading} onEdit={handleEdit} />

      <BankFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        bank={editing}
      />
    </div>
  );
}
