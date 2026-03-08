import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ROWS_PER_PAGE_OPTIONS = [1, 10, 20, 30, 40, 50];

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
    rowsPerPage?: number;
    onRowsPerPageChange?: (value: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    isLoading,
    rowsPerPage,
    onRowsPerPageChange
}) => {
    const showRowsDropdown = !!onRowsPerPageChange;

    if (totalPages <= 1 && !showRowsDropdown) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (end === totalPages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8">
            {showRowsDropdown && (
                <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">
                        Rows
                    </label>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        disabled={isLoading}
                        className="appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-8 text-sm font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isLoading}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[var(--navy)] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-200/60 backdrop-blur-sm">
                        {getPageNumbers().map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                disabled={isLoading}
                                className={`
                  min-w-[40px] h-10 px-3 rounded-xl text-sm font-bold transition-all active:scale-95
                  ${page === currentPage
                                        ? 'bg-[var(--navy)] text-white shadow-lg shadow-navy/20'
                                        : 'text-slate-600 hover:bg-white hover:text-[var(--navy)] hover:shadow-sm'
                                    }
                `}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isLoading}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[var(--navy)] disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pagination;
