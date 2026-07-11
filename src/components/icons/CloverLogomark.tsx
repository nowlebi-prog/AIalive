export function CloverLogomark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="9" fill="#DFF4E8" />
      <circle cx="13" cy="13" r="4.6" fill="#2F9B67" />
      <circle cx="19" cy="13" r="4.6" fill="#7FC79B" />
      <circle cx="13" cy="19" r="4.6" fill="#7FC79B" />
      <circle cx="19" cy="19" r="4.6" fill="#176B45" />
    </svg>
  );
}
