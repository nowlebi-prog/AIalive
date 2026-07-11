import { cn } from "@/lib/utils";

export function CloverMascot({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-24 h-24", className)}
      aria-hidden="true"
    >
      {/* four leaves */}
      <g opacity="0.95">
        <ellipse cx="62" cy="92" rx="30" ry="34" fill="#A9D9BA" transform="rotate(-18 62 92)" />
        <ellipse cx="138" cy="92" rx="30" ry="34" fill="#A9D9BA" transform="rotate(18 138 92)" />
        <ellipse cx="70" cy="150" rx="30" ry="34" fill="#B8E0C6" transform="rotate(18 70 150)" />
        <ellipse cx="130" cy="150" rx="30" ry="34" fill="#B8E0C6" transform="rotate(-18 130 150)" />
      </g>
      {/* sprout */}
      <path
        d="M112 58c6-10 18-14 26-10-2 9-12 18-22 18"
        stroke="#8FCB9F"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* body */}
      <path
        d="M100 44c18 0 30 22 30 44 0 24-14 42-30 42s-30-18-30-42c0-22 12-44 30-44Z"
        fill="#FBF9EE"
      />
      {/* face */}
      <circle cx="88" cy="98" r="4" fill="#3A3A32" />
      <circle cx="112" cy="98" r="4" fill="#3A3A32" />
      <path
        d="M92 110c3 4 13 4 16 0"
        stroke="#3A3A32"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="76" cy="106" r="6" fill="#F6C9C9" opacity="0.7" />
      <circle cx="124" cy="106" r="6" fill="#F6C9C9" opacity="0.7" />
      {/* arms holding heart */}
      <path
        d="M78 124c-6 4-8 12-4 18M122 124c6 4 8 12 4 18"
        stroke="#FBF9EE"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M100 128c-3-4-9-4-11 0-2 4 1 8 11 14 10-6 13-10 11-14-2-4-8-4-11 0Z"
        fill="#8FCB9F"
      />
    </svg>
  );
}
