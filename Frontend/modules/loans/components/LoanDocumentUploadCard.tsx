"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Upload,
  Trash2,
  Eye,
  CheckCircle2,
  Loader2,
  Lock,
  KeyRound,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { documentUrl } from "@/lib/format";
import type { DocumentChecklistItem } from "../services/loanDocumentService";
import { useSetBankStatementPassword } from "../hooks/useLoanDocuments";

const MAX_SIZE_MB = 5;
const ACCEPTED = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

export function LoanDocumentUploadCard({
  item,
  index,
  onUpload,
  onRemove,
  uploading,
  removing,
  disabled,
  loanId,
}: {
  item: DocumentChecklistItem;
  index: number;
  onUpload: (file: File) => void;
  onRemove: () => void;
  uploading?: boolean;
  removing?: boolean;
  disabled?: boolean;
  /** Optional — required only for bank_statement to enable the password field */
  loanId?: number | string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const isBankStatement = item.doc_type === "bank_statement";
  const setPasswordM = useSetBankStatementPassword(
    isBankStatement ? loanId : undefined,
  );

  const [password, setPassword] = useState(item.password ?? "");
  const [passwordDirty, setPasswordDirty] = useState(false);

  // Reset local state if the checklist refreshes from the server
  useEffect(() => {
    setPassword(item.password ?? "");
    setPasswordDirty(false);
  }, [item.password]);

  const handleFile = (f: File | null) => {
    if (!f) return;
    if (!ACCEPTED.includes(f.type)) {
      alert("Only PDF, JPG, JPEG, PNG allowed.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Max ${MAX_SIZE_MB}MB.`);
      return;
    }
    onUpload(f);
  };

  const handleSavePassword = () => {
    const value = password.trim();
    setPasswordM.mutate(value.length ? value : null, {
      onSuccess: () => setPasswordDirty(false),
    });
  };

  const url = documentUrl(item.path);

  return (
    <Card
      className={cn(
        "transition-colors",
        disabled && !item.uploaded
          ? "border-slate-500/30 bg-muted/30 opacity-70"
          : item.uploaded
            ? "border-emerald-500/30 bg-emerald-500/5"
            : "border-amber-500/30 bg-amber-500/5",
      )}
    >
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                item.uploaded
                  ? "bg-emerald-500/10 text-emerald-600"
                  : disabled
                    ? "bg-slate-500/10 text-slate-500"
                    : "bg-amber-500/10 text-amber-600",
              )}
            >
              {item.uploaded ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <FileText className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium">
                {index + 1}. {item.label}
              </p>
              <div className="mt-1 flex items-center gap-2">
                {item.uploaded ? (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  >
                    UPLOADED
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  >
                    PENDING
                  </Badge>
                )}
                {item.path && (
                  <span className="truncate text-xs text-muted-foreground">
                    {item.path.split("/").pop()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 self-end sm:self-auto">
            {item.uploaded && url && (
              <>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  title="View"
                >
                  <Eye className="h-4 w-4" />
                </a>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={onRemove}
                  disabled={disabled || removing}
                  title="Remove"
                >
                  {removing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}

            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              disabled={disabled}
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <Button
              variant={item.uploaded ? "outline" : "default"}
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-3.5 w-3.5" />
                  {item.uploaded ? "Replace" : "Upload"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Bank statement password sub-row */}
        {isBankStatement && (
          <div className="ml-0 border-t pt-3 sm:ml-[52px]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <KeyRound className="h-3.5 w-3.5" />
                <span>PDF password (optional)</span>
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Input
                  type="text"
                  placeholder="e.g., DOB in DDMMYYYY or PAN"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordDirty(true);
                  }}
                  disabled={disabled}
                  className="h-8 max-w-xs text-xs"
                />

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8"
                  onClick={handleSavePassword}
                  disabled={
                    !passwordDirty || setPasswordM.isPending || disabled
                  }
                >
                  {setPasswordM.isPending ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>

                {item.password && !passwordDirty && (
                  <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                    <Lock className="h-3 w-3" />
                    Saved
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
