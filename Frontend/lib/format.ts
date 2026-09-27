// lib/format.ts

export const formatCurrency = (
  value: number | string | null | undefined,
  currency = "INR",
): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num === null || num === undefined || Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumber = (
  value: number | string | null | undefined,
): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num === null || num === undefined || Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-IN").format(num);
};

export const formatDate = (value: string | Date | null | undefined): string => {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

export const formatDateTime = (
  value: string | Date | null | undefined,
): string => {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

export const getInitials = (name?: string): string => {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export interface SelectOption {
  value: string;
  tag: string;
}

export const optionTag = (
  options: SelectOption[],
  value: string | number | null | undefined,
): string | undefined => {
  if (value === null || value === undefined) return undefined;
  return options.find((o) => o.value === String(value))?.tag;
};
