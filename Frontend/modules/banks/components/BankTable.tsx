// modules/banks/components/BankTable.tsx
"use client";

import { useMemo, useState } from "react";
import { Search, MoreHorizontal, Pencil } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

import { usePermission } from "@/lib/hooks/usePermission";
import { MODULES, ACTIONS } from "@/lib/constants/permissions";
import type { Bank } from "../types";

export function BankTable({
  data,
  loading,
  onEdit,
}: {
  data: Bank[] | undefined;
  loading?: boolean;
  onEdit: (bank: Bank) => void;
}) {
  const [search, setSearch] = useState("");
  const { can, isAdmin } = usePermission();
  const canEdit = isAdmin || can(MODULES.CUSTOMERS, ACTIONS.UPDATE); // Admin only in practice

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (b) =>
        b.bank_name.toLowerCase().includes(q) ||
        (b.short_code ?? "").toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by name or code..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-lg border bg-card">
        {loading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No banks found"
            description={
              search
                ? "Try adjusting your search."
                : "Add your first partner bank to begin."
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bank Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Short Code
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((b) => (
                  <TableRow key={b.bank_id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{b.bank_name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {b.short_code || "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={b.is_active ? "Active" : "Inactive"}
                        variant={b.is_active ? "success" : "neutral"}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            disabled={!canEdit}
                            onClick={() => onEdit(b)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {data?.length ?? 0} banks
        </p>
      )}
    </div>
  );
}
