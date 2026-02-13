"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    "bg-accent-gold text-bg-deep font-ui font-semibold text-[15px] px-6 py-3 rounded-[12px] hover:bg-accent-gold-light hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-all duration-200",
  secondary:
    "bg-transparent text-text-muted-light border border-border-dark font-ui font-medium text-[15px] px-6 py-3 rounded-[12px] hover:border-accent-gold hover:text-text-cream transition-all duration-200",
  ghost:
    "bg-transparent text-accent-gold font-ui font-medium text-[15px] px-4 py-2.5 hover:text-accent-gold-light hover:underline transition-all duration-200",
} as const;

export function Button({
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`${variantStyles[variant]} ${fullWidth ? "w-full" : ""} ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className ?? ""}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-1">
          <span className="animate-pulse">...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
