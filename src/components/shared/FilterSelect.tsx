import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

export function FilterSelect({
  icon: Icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative inline-flex items-center gap-1.5 border border-border-soft rounded-full pl-3 pr-7 py-2 bg-white text-[12.5px] font-medium text-text-dark">
      <Icon size={14} className="text-text-gray shrink-0" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent outline-none pr-1 cursor-pointer max-w-[110px] truncate"
      >
        <option value="">{label} 전체</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown size={13} className="text-text-gray absolute right-2.5 pointer-events-none" />
    </div>
  );
}
