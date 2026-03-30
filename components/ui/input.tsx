import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, id: idProp, ...props }, ref) => {
    const reactId = React.useId();
    const id = idProp ?? reactId;
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            "w-full rounded-xl border bg-transparent px-4 py-3 text-base transition-colors",
            "placeholder:text-zinc-400 dark:placeholder:text-zinc-500",
            "focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground",
            error
              ? "border-red-500 dark:border-red-500"
              : "border-zinc-300 dark:border-zinc-600",
            "dark:text-zinc-100",
            className,
          ].join(" ")}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
