import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "kakao" | "naver" | "ghost";
type Size = "md" | "lg" | "sm";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-deep shadow-[0_4px_14px_rgba(47,155,103,0.25)]",
  secondary:
    "bg-white text-text-dark border border-border-soft hover:bg-pale-green",
  kakao: "bg-[#FEE500] text-[#3A2929] hover:brightness-95",
  naver: "bg-white text-text-dark border border-border-soft hover:bg-pale-green",
  ghost: "bg-transparent text-primary-deep hover:bg-pale-green",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-4 py-2 text-sm rounded-full",
  md: "px-5 py-3 text-[15px] rounded-full",
  lg: "px-6 py-4 text-base rounded-full",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = BaseProps & { href: string; target?: string };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", children, className, icon } = props;
  const classes = cn(
    "inline-flex items-center justify-center gap-2 font-semibold transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} target={props.target} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  const { href: _href, ...buttonProps } = props as ButtonProps;
  void _href;
  return (
    <button className={classes} {...buttonProps}>
      {icon}
      {children}
    </button>
  );
}
