"use client";

import { useState } from "react";
import {
    ChevronDown,
    ChevronUp,
    ChevronsUpDown,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye
} from "lucide-react";

// =============================================================================
// TYPES
// =============================================================================

export interface Column<T> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    width?: string;
    render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    isLoading?: boolean;
    page?: number;
    limit?: number;
    total?: number;
    onPageChange?: (page: number) => void;
    onSort?: (key: string, order: "asc" | "desc") => void;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onView?: (item: T) => void;
    getId?: (item: T) => string;
    emptyMessage?: string;
}

// =============================================================================
// DATA TABLE COMPONENT
// =============================================================================

export function DataTable<T extends { id: string }>({
    data,
    columns,
    isLoading,
    page = 1,
    limit = 10,
    total = 0,
    onPageChange,
    onSort,
    sortBy,
    sortOrder = "desc",
    onEdit,
    onDelete,
    onView,
    getId = (item) => (item as any).id,
    emptyMessage = "Tidak ada data",
}: DataTableProps<T>) {
    const totalPages = Math.ceil(total / limit);

    const handleSort = (key: string) => {
        if (!onSort) return;
        const newOrder = sortBy === key && sortOrder === "asc" ? "desc" : "asc";
        onSort(key, newOrder);
    };

    const getSortIcon = (key: string) => {
        if (sortBy !== key) return <ChevronsUpDown className="h-4 w-4 text-slate-400" />;
        return sortOrder === "asc"
            ? <ChevronUp className="h-4 w-4 text-blue-600" />
            : <ChevronDown className="h-4 w-4 text-blue-600" />;
    };

    const getValue = (row: T, key: string): unknown => {
        const keys = key.split(".");
        let value: unknown = row;
        for (const k of keys) {
            value = (value as Record<string, unknown>)?.[k];
        }
        return value;
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600
                    ${col.sortable ? "cursor-pointer select-none hover:bg-slate-100" : ""}
                  `}
                                    style={{ width: col.width }}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                >
                                    <div className="flex items-center gap-1.5">
                                        {col.header}
                                        {col.sortable && getSortIcon(String(col.key))}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete || onView) && (
                                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 w-20">
                                    Aksi
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {isLoading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {columns.map((col, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || onView) && (
                                        <td className="px-4 py-3">
                                            <div className="h-4 w-8 animate-pulse rounded bg-slate-200 ml-auto" />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            // Empty state
                            <tr>
                                <td
                                    colSpan={columns.length + (onEdit || onDelete || onView ? 1 : 0)}
                                    className="px-4 py-12 text-center text-slate-500"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            // Data rows
                            data.map((row, index) => (
                                <tr
                                    key={getId(row)}
                                    className="hover:bg-slate-50 transition-colors"
                                >
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-4 py-3 text-sm text-slate-700">
                                            {col.render
                                                ? col.render(row, index)
                                                : String(getValue(row, String(col.key)) ?? "-")
                                            }
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || onView) && (
                                        <td className="px-4 py-3">
                                            <ActionMenu
                                                onView={onView ? () => onView(row) : undefined}
                                                onEdit={onEdit ? () => onEdit(row) : undefined}
                                                onDelete={onDelete ? () => onDelete(row) : undefined}
                                            />
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {total > limit && (
                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
                    <p className="text-sm text-slate-500">
                        Menampilkan {(page - 1) * limit + 1} - {Math.min(page * limit, total)} dari {total}
                    </p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => onPageChange?.(page - 1)}
                            disabled={page <= 1}
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (page <= 3) {
                                pageNum = i + 1;
                            } else if (page >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = page - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => onPageChange?.(pageNum)}
                                    className={`
                    min-w-[32px] rounded-lg px-2.5 py-1.5 text-sm font-medium
                    ${page === pageNum
                                            ? "bg-blue-600 text-white"
                                            : "text-slate-600 hover:bg-slate-100"
                                        }
                  `}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => onPageChange?.(page + 1)}
                            disabled={page >= totalPages}
                            className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// =============================================================================
// ACTION MENU
// =============================================================================

interface ActionMenuProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

function ActionMenu({ onView, onEdit, onDelete }: ActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex justify-end">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
                <MoreHorizontal className="h-5 w-5" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                        {onView && (
                            <button
                                onClick={() => { onView(); setIsOpen(false); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                                <Eye className="h-4 w-4" /> Lihat
                            </button>
                        )}
                        {onEdit && (
                            <button
                                onClick={() => { onEdit(); setIsOpen(false); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                            >
                                <Pencil className="h-4 w-4" /> Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => { onDelete(); setIsOpen(false); }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4" /> Hapus
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
