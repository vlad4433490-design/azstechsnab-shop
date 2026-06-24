import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return <button className={`${buttonClassName(variant)} ${className}`} {...props} />;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = ""
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
}) {
  return (
    <Link href={href} className={`${buttonClassName(variant)} ${className}`}>
      {children}
    </Link>
  );
}

function buttonClassName(variant: "primary" | "secondary" | "danger" | "ghost") {
  const base =
    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-extrabold transition";
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-brand-blueDark",
    secondary: "border border-brand-line bg-white text-[#172033] hover:border-brand-blue",
    danger: "border border-red-200 bg-white text-red-600 hover:bg-red-50",
    ghost: "text-[#172033] hover:text-brand-blue"
  };
  return `${base} ${variants[variant]}`;
}
