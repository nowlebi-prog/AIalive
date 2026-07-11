import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export function FocusAreaTile({
  emoji,
  label,
  description,
  selected,
  onClick,
}: {
  emoji: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-start gap-1 p-4 rounded-2xl border text-left transition-colors",
        selected
          ? "border-primary bg-soft-green"
          : "border-border-soft bg-white hover:bg-pale-green"
      )}
    >
      {selected && (
        <CheckCircle2 size={18} className="absolute top-3 right-3 text-primary" fill="white" />
      )}
      <span className="text-[22px]">{emoji}</span>
      <span className="text-[13.5px] font-semibold text-text-dark">{label}</span>
      <span className="text-[11.5px] text-text-gray">{description}</span>
    </button>
  );
}
