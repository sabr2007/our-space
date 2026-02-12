interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    heading: "text-xl",
    dividerText: "text-[10px]",
    gap: "gap-0.5",
  },
  md: {
    heading: "text-[28px]",
    dividerText: "text-xs",
    gap: "gap-1",
  },
  lg: {
    heading: "text-[40px]",
    dividerText: "text-sm",
    gap: "gap-1.5",
  },
} as const;

export function Logo({ size = "md" }: LogoProps) {
  const config = sizeConfig[size];

  return (
    <div className={`flex flex-col items-center ${config.gap}`}>
      <h1
        className={`font-display font-bold text-text-cream ${config.heading}`}
      >
        Our Space
      </h1>
      <div
        className={`flex items-center gap-2 ${config.dividerText}`}
      >
        <span className="text-accent-gold/60">───</span>
        <span className="text-accent-rose">&#9825;</span>
        <span className="text-accent-gold/60">───</span>
      </div>
    </div>
  );
}
