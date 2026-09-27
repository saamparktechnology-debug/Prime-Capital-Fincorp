// modules/kyc/modals/UploadDocumentModal.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { useUploadDocument } from "../hooks/useKyc";
import { type SelectOption, optionTag } from "@/lib/format";

const DOCUMENT_TYPES = [
  "Aadhaar Card",
  "PAN Card",
  "Voter ID",
  "Driving License",
  "Passport",
  "Bank Passbook",
  "Salary Slip",
  "Photograph",
  "Address Proof",
  "Other",
];

const DOC_TYPE_OPTIONS: SelectOption[] = DOCUMENT_TYPES.map((t) => ({
  value: t,
  tag: t,
}));

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export function UploadDocumentModal({
  customerId,
  open,
  onOpenChange,
  onSuccess,
}: {
  customerId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadM = useUploadDocument(customerId);

  const reset = () => {
    setDocType("");
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = (f: File | null) => {
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Only PDF, JPG, JPEG, PNG allowed.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Max file size is ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(f);
  };

  const handleSubmit = () => {
    setError(null);
    if (!docType) {
      setError("Please select a document type.");
      return;
    }
    if (!file) {
      setError("Please choose a file.");
      return;
    }

    uploadM.mutate(
      { document_type: docType, file },
      {
        onSuccess: () => {
          onSuccess?.();
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload KYC Document</DialogTitle>
          <DialogDescription>
            PDF, JPG, JPEG, or PNG. Max {MAX_SIZE_MB}MB.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>
              Document Type <span className="text-destructive">*</span>
            </Label>
            <Select value={docType} onValueChange={(v) => setDocType(v ?? "")}>
              <SelectTrigger>
                <span className={!docType ? "text-muted-foreground" : ""}>
                  {optionTag(DOC_TYPE_OPTIONS, docType) ??
                    "Select document type"}
                </span>
              </SelectTrigger>
              <SelectContent>
                {DOC_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>File</Label>
            <div
              className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/30"
              onClick={() => inputRef.current?.click()}
            >
              {file ? (
                <>
                  <FileText className="h-8 w-8 text-blue-500" />
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFile(null);
                    }}
                  >
                    <X className="mr-1 h-3 w-3" />
                    Remove
                  </Button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to choose file</p>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG up to {MAX_SIZE_MB}MB
                  </p>
                </>
              )}
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={uploadM.isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={uploadM.isPending}>
            {uploadM.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
