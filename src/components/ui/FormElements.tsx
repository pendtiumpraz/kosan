"use client";

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from "react";

// =============================================================================
// INPUT
// =============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-slate-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900
            placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-slate-100 disabled:cursor-not-allowed
            ${error
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-slate-300 hover:border-slate-400"
                        }
            ${className}
          `}
                    {...props}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                {helperText && !error && <p className="text-sm text-slate-500">{helperText}</p>}
            </div>
        );
    }
);
Input.displayName = "Input";

// =============================================================================
// TEXTAREA
// =============================================================================

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, helperText, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-slate-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={`
            w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900
            placeholder:text-slate-400 resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-slate-100 disabled:cursor-not-allowed
            ${error
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-slate-300 hover:border-slate-400"
                        }
            ${className}
          `}
                    rows={4}
                    {...props}
                />
                {error && <p className="text-sm text-red-500">{error}</p>}
                {helperText && !error && <p className="text-sm text-slate-500">{helperText}</p>}
            </div>
        );
    }
);
Textarea.displayName = "Textarea";

// =============================================================================
// SELECT
// =============================================================================

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, helperText, options, placeholder, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-slate-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-0.5">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    className={`
            w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-slate-100 disabled:cursor-not-allowed
            ${error
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                            : "border-slate-300 hover:border-slate-400"
                        }
            ${className}
          `}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {helperText && !error && <p className="text-sm text-slate-500">{helperText}</p>}
            </div>
        );
    }
);
Select.displayName = "Select";

// =============================================================================
// BUTTON
// =============================================================================

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const buttonVariants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500",
    ghost: "text-slate-600 hover:bg-slate-100 focus:ring-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
};

const buttonSizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
};

export function Button({
    variant = "primary",
    size = "md",
    isLoading,
    leftIcon,
    rightIcon,
    disabled,
    className = "",
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className}
      `}
            {...props}
        >
            {isLoading ? (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : (
                leftIcon
            )}
            {children}
            {!isLoading && rightIcon}
        </button>
    );
}

// =============================================================================
// BADGE
// =============================================================================

interface BadgeProps {
    variant?: "default" | "success" | "warning" | "danger" | "info";
    children: React.ReactNode;
    className?: string;
}

const badgeVariants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
        ${badgeVariants[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}

// =============================================================================
// STAT CARD
// =============================================================================

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    change?: {
        value: number;
        type: "increase" | "decrease";
    };
    className?: string;
}

export function StatCard({ title, value, icon, change, className = "" }: StatCardProps) {
    return (
        <div className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
                    {change && (
                        <p className={`mt-1 text-xs font-medium ${change.type === "increase" ? "text-emerald-600" : "text-red-600"
                            }`}>
                            {change.type === "increase" ? "+" : "-"}{Math.abs(change.value)}%
                            <span className="ml-1 text-slate-500">vs bulan lalu</span>
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
