import { cn } from "@/lib/utils";

export function FinderStepper({ activeStep }: { activeStep: number }) {
  const steps = ["업종/분야 선택", "막막한 일", "AI 사용 경험", "원하는 결과"];

  return (
    <div className="hidden sm:flex items-center gap-2">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < activeStep;
        const active = step === activeStep;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                  active
                    ? "bg-primary text-white"
                    : done
                    ? "bg-soft-green text-primary-deep"
                    : "bg-pale-green text-text-gray"
                )}
              >
                {step}
              </span>
              <span
                className={cn(
                  "text-[12.5px] font-medium whitespace-nowrap",
                  active ? "text-text-dark" : "text-text-gray"
                )}
              >
                {label}
              </span>
            </div>
            {step < steps.length && <span className="w-6 h-px bg-border-soft" />}
          </div>
        );
      })}
    </div>
  );
}
