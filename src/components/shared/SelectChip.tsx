import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function SelectChip({
  label,
  selected,
  onClick,
  emoji,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  emoji?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "px-4 py-2.5 rounded-full text-[13.5px] font-medium border transition-colors inline-flex items-center gap-1.5",
        selected
          ? "bg-soft-green border-primary text-primary-deep"
          : "bg-white border-border-soft text-text-dark hover:bg-pale-green"
      )}
    >
      {emoji && <span>{emoji}</span>}
      {label}
      {selected && <Check size={13} className="text-primary-deep" />}
    </button>
  );
}
