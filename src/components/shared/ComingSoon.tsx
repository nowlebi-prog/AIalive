import { CloverMascot } from "@/components/icons/CloverMascot";

export function ComingSoon({
  title,
  description,
  sprintLabel,
}: {
  title: string;
  description: string;
  sprintLabel: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-24 max-w-md mx-auto">
      <CloverMascot className="w-24 h-24 mb-6" />
      <span className="text-[12px] font-semibold text-primary-deep bg-soft-green px-3 py-1 rounded-full mb-4">
        {sprintLabel}
      </span>
      <h1 className="text-[20px] font-bold text-text-dark">{title}</h1>
      <p className="text-[14px] text-text-gray mt-2 leading-relaxed">{description}</p>
    </div>
  );
}
