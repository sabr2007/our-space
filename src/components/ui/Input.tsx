import { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    return (
      <div>
        {label && (
          <label
            htmlFor={inputId}
            className="font-ui text-[13px] text-text-muted-light mb-1.5 block"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-bg-elevated border border-border-dark rounded-[12px] px-4 py-3 text-text-cream placeholder:text-text-muted-light placeholder:italic font-body text-base focus:border-accent-gold focus:outline-none transition-colors duration-200 ${className ?? ""}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
