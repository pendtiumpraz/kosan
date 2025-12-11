"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface RightPanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    width?: "sm" | "md" | "lg" | "xl";
}

const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
};

export function RightPanel({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    width = "md",
}: RightPanelProps) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when panel is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen && !isAnimating) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`
          fixed inset-0 z-40 bg-black/50 transition-opacity duration-300
          ${isOpen ? "opacity-100" : "opacity-0"}
        `}
                onClick={onClose}
                onTransitionEnd={() => !isOpen && setIsAnimating(false)}
            />

            {/* Panel */}
            <aside
                className={`
          fixed right-0 top-0 z-50 h-full w-full bg-white shadow-2xl
          transition-transform duration-300 ease-out
          ${widthClasses[width]}
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
            >
                {/* Header */}
                <div className="flex h-16 items-center justify-between border-b px-6">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="h-[calc(100%-4rem)] overflow-y-auto p-6">
                    {children}
                </div>
            </aside>
        </>
    );
}

// CRUD Panel wrapper dengan action buttons
interface CrudPanelProps extends Omit<RightPanelProps, "children"> {
    mode: "create" | "edit" | "view";
    children: React.ReactNode;
    onSave?: () => void;
    onDelete?: () => void;
    isSaving?: boolean;
    isDeleting?: boolean;
    showDelete?: boolean;
}

export function CrudPanel({
    mode,
    children,
    onSave,
    onDelete,
    isSaving,
    isDeleting,
    showDelete = false,
    ...props
}: CrudPanelProps) {
    return (
        <RightPanel {...props}>
            <div className="flex h-full flex-col">
                {/* Form Content */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>

                {/* Action Buttons */}
                {mode !== "view" && (
                    <div className="border-t pt-4 mt-4 space-y-3">
                        {/* Save Button */}
                        <button
                            onClick={onSave}
                            disabled={isSaving}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white 
                hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors duration-200"
                        >
                            {isSaving ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Menyimpan...
                                </span>
                            ) : (
                                mode === "create" ? "Simpan" : "Update"
                            )}
                        </button>

                        {/* Delete Button */}
                        {showDelete && mode === "edit" && onDelete && (
                            <button
                                onClick={onDelete}
                                disabled={isDeleting}
                                className="w-full rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 
                  hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200"
                            >
                                {isDeleting ? "Menghapus..." : "Hapus"}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </RightPanel>
    );
}
