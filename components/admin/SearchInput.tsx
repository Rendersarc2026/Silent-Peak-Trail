"use client";
import React from "react";
import { Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    loading?: boolean;
    className?: string;
}

export default function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    loading = false,
    className = "",
}: SearchInputProps) {
    return (
        <div className={cn("relative flex-1", className)}>
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search size={18} />
            </div>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="block w-full rounded-xl border-slate-200 bg-white pl-10 pr-10 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 shadow-sm"
            />
            {loading && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                    <Loader2 size={16} className="animate-spin text-blue-600" />
                </div>
            )}
        </div>
    );
}
