import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ROWS_PER_PAGE_OPTIONS = [10, 20, 30, 40, 50];

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

    const renderPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 4) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage <= 4) {
                for (let i = 2; i <= 5; i++) pages.push(i);
            } else if (currentPage >= totalPages - 3) {
                for (let i = totalPages - 4; i <= totalPages - 1; i++) pages.push(i);
            } else {
                for (let i = start; i <= end; i++) pages.push(i);
            }

            if (currentPage < totalPages - 3) {
                pages.push("...");
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages.map((page, idx) => {
            if (page === "...") {
                return (
                    <span key={`dots-${idx}`} className="px-3 py-2 text-slate-400 font-bold">
                        ...
                    </span>
                );
            }

            const isActive = page === currentPage;
            return (
                <button
                    key={page}
                    onClick={() => onPageChange(Number(page))}
                    disabled={isLoading}
                    className={`
                        min-w-[44px] px-2 py-3 text-sm font-bold transition-all relative
                        ${isActive
                            ? 'text-slate-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-slate-900'
                            : 'text-slate-400 hover:text-slate-600'
                        }
                        disabled:opacity-50
                    `}
                >
                    {page}
                </button>
            );
        });
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-slate-100">
            {showRowsDropdown ? (
                <div className="flex items-center gap-3 order-2 sm:order-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Show Rows</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                        disabled={isLoading}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer hover:bg-slate-100 transition-all outline-none"
                    >
                        {ROWS_PER_PAGE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                </div>
            ) : <div className="order-2 sm:order-1" />}

            <div className="flex items-center order-1 sm:order-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="p-3 text-slate-400 hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={18} strokeWidth={3} />
                </button>

                <div className="flex items-center">
                    {renderPageNumbers()}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    className="p-3 text-slate-400 hover:text-slate-900 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight size={18} strokeWidth={3} />
                </button>
            </div>

            <div className="hidden sm:block w-32 order-3" />
        </div>
    );
};

export default Pagination;
