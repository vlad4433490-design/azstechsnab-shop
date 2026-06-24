import { getStockLabel, getStockTone } from "@/lib/format";

export function StockBadge({ value }: { value: string }) {
  const tone = getStockTone(value);
  const classes =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-slate-200 bg-slate-100 text-slate-700";
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${classes}`}>
      {getStockLabel(value)}
    </span>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-[#eef4ff] px-3 py-2 text-sm font-semibold text-[#29415f]">
      {children}
    </span>
  );
}
