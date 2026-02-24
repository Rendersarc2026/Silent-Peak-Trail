"use client";
import { AlertCircle, X } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "warning" | "danger" | "info";
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Continue",
    cancelText = "Stay",
    variant = "warning",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    const variants = {
        warning: {
            icon: <AlertCircle size={20} />,
            iconBg: "bg-amber-50",
            iconText: "text-amber-600",
            buttonBg: "bg-amber-600 hover:bg-amber-700",
        },
        danger: {
            icon: <AlertCircle size={20} />,
            iconBg: "bg-red-50",
            iconText: "text-red-600",
            buttonBg: "bg-red-600 hover:bg-red-700",
        },
        info: {
            icon: <AlertCircle size={20} />,
            iconBg: "bg-blue-50",
            iconText: "text-blue-600",
            buttonBg: "bg-blue-600 hover:bg-blue-700",
        },
    };

    const style = variants[variant];

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div
                className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${style.iconBg} ${style.iconText}`}>
                            {style.icon}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-sm leading-relaxed text-slate-600">
                        {message}
                    </p>
                </div>

                <div className="flex items-center justify-end gap-3 border-t bg-slate-50/50 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex items-center justify-center gap-2 min-w-[100px] rounded-xl px-6 py-2 text-sm font-semibold text-white transition-all shadow-sm active:scale-[0.98] ${style.buttonBg}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
