"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Pagination from "@/components/admin/Pagination";
import {
    Plus,
    Trash2,
    X,
    Check,
    Loader2,
    Edit2,
    AlertCircle,
    Info,
    Wind,
    WifiOff,
    FileText,
    Stethoscope,
    ShieldAlert,
    Mountain,
    Star,
    Droplets,
    Sun,
    Camera,
    Heart,
    Compass
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import SearchInput from "@/components/admin/SearchInput";
import { hasError, getErrorMessage, validateWithYup } from "@/lib/utils";
import { lehTipSchema } from "@/lib/validation";

// Map of available lucide icon names to components
const ICON_MAP: Record<string, React.ElementType> = {
    Wind, WifiOff, FileText, Stethoscope, ShieldAlert, Mountain,
    Star, Droplets, Sun, Camera, Heart, Compass, Info, AlertCircle,
};

const COLOR_OPTIONS = [
    { label: "Blue", color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { label: "Amber", color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
    { label: "Red", color: "bg-red-50 text-red-600", border: "border-red-100" },
    { label: "Green", color: "bg-green-50 text-green-600", border: "border-green-100" },
    { label: "Slate", color: "bg-slate-50 text-slate-600", border: "border-slate-100" },
    { label: "Purple", color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
    { label: "Rose", color: "bg-rose-50 text-rose-600", border: "border-rose-100" },
];

interface LehTip {
    id: string;
    icon: string;
    title: string;
    desc: string;
    color: string;
    border: string;
    order: number;
}

const EMPTY = { icon: "Wind", title: "", desc: "", color: "bg-blue-50 text-blue-600", border: "border-blue-100", order: 0 };

export default function LehTipsPage() {
    const [items, setItems] = useState<LehTip[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<LehTip | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

    const clearFieldError = (field: string) => {
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: "" });
    const [deleting, setDeleting] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false);

    const isDirty = () => {
        if (editing) {
            return (
                form.icon !== editing.icon ||
                form.title !== editing.title ||
                form.desc !== editing.desc ||
                form.color !== editing.color ||
                form.border !== editing.border ||
                form.order !== editing.order
            );
        }
        return JSON.stringify(form) !== JSON.stringify(EMPTY);
    };

    const handleCloseAttempt = () => {
        if (isDirty()) setConfirmClose(true);
        else closeModal();
    };

    const closeModal = () => {
        setModal(false);
        setEditing(null);
        setForm(EMPTY);
        setError("");
        setFieldErrors({});
        setConfirmClose(false);
        setSaving(false);
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const fetchItems = async (page = 1, s = search, lim = rowsPerPage) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                search: s,
                limit: lim.toString()
            });
            const res = await fetch(`/api/leh-tips?${params}`);
            const data = await res.json();
            // Map _id from MongoDB to id for the frontend
            const mappedData = (data.data || []).map((item: any) => ({
                ...item,
                id: item._id
            }));
            setItems(mappedData);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.currentPage || 1);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchItems(1, search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const openAdd = () => {
        setEditing(null);
        setForm(EMPTY);
        setError("");
        setFieldErrors({});
        setModal(true);
    };

    const openEdit = (item: LehTip) => {
        setEditing(item);
        setForm({ icon: item.icon, title: item.title, desc: item.desc, color: item.color, border: item.border, order: item.order });
        setError("");
        setFieldErrors({});
        setModal(true);
    };

    const handleSave = async () => {
        setError("");
        setFieldErrors({});

        // Client-side validation using Yup
        const { success, error: validationError } = await validateWithYup(lehTipSchema, form);
        if (!success) {
            setFieldErrors(validationError?.fieldErrors as any);
            setError("Please fill all required fields.");
            return;
        }

        setSaving(true);
        try {
            const url = editing ? `/api/leh-tips/${editing.id}` : "/api/leh-tips";
            const method = editing ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.details) {
                    setFieldErrors(data.details);
                    setError("Please fill all required fields.");
                } else {
                    setError(data.error || "Something went wrong.");
                }
                setSaving(false);
                return;
            }
            showToast(editing ? "Tip updated!" : "Tip added!");
            closeModal();
            fetchItems(currentPage);
        } catch {
            setError("Network error. Please try again.");
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await fetch(`/api/leh-tips/${deleteModal.id}`, { method: "DELETE" });
            showToast("Tip removed.");
            setDeleteModal({ isOpen: false, id: "" });
            fetchItems();
        } finally {
            setDeleting(false);
        }
    };

    const handleColorSelect = (opt: typeof COLOR_OPTIONS[0]) => {
        setForm(f => ({ ...f, color: opt.color, border: opt.border }));
        clearFieldError('color');
        clearFieldError('border');
    };

    return (
        <AdminShell title="Leh Tips">
            <div className="mx-auto max-w-5xl px-4 py-10">
                {/* Header */}
                <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 max-w-lg">
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">Know Before You Go</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage the tips shown in the Leh preparation section.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        {/* Search */}
                        <SearchInput
                            value={search}
                            onChange={(val) => {
                                setSearch(val);
                                setCurrentPage(1);
                            }}
                            placeholder="Search tips..."
                            loading={loading && !!search}
                            className="sm:w-64"
                        />

                        <button
                            onClick={openAdd}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[var(--blue)] active:scale-95 shadow-sm"
                        >
                            <Plus size={16} /> Add Tip
                        </button>
                    </div>
                </div>

                {/* Toast */}
                {toast && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 px-5 py-3 text-sm font-bold text-green-700 shadow-sm ring-1 ring-green-200">
                        <Check size={16} /> {toast}
                    </div>
                )}

                {/* Tips Grid */}
                {loading ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4 opacity-80" />
                        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading tips...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 py-20 text-center">
                        <Info size={32} className="mb-3 text-slate-300" />
                        <p className="text-sm font-bold text-slate-400">No tips yet. Add your first one!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {items.map((item) => {
                            const IconComp = ICON_MAP[item.icon] || Info;
                            return (
                                <div
                                    key={item.id}
                                    className={`group relative overflow-hidden rounded-2xl border p-6 transition-all hover:shadow-md ${item.border} ${item.color}`}
                                >
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
                                        <IconComp size={20} />
                                    </div>
                                    <p className="mb-1 text-[9px] font-black uppercase tracking-widest opacity-50">#{item.order}</p>
                                    <h3 className="mb-1 text-base font-black text-slate-900 leading-tight">{item.title}</h3>
                                    <p className="text-xs font-medium leading-relaxed opacity-70 line-clamp-2">{item.desc}</p>

                                    {/* Actions */}
                                    <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-slate-100"
                                        >
                                            <Edit2 size={14} className="text-slate-600" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ isOpen: true, id: item.id })}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm hover:bg-red-50"
                                        >
                                            <Trash2 size={14} className="text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!loading && items.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(val) => {
                                setRowsPerPage(val);
                                setCurrentPage(1);
                                fetchItems(1, search, val);
                            }}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                fetchItems(page, search);
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={handleCloseAttempt}>
                    <div
                        className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-8 py-6">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{editing ? "Edit Tip" : "Add New Tip"}</h2>
                            <button
                                onClick={handleCloseAttempt}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto flex-1 p-8 space-y-7">
                            {error && (
                                <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100 animate-in slide-in-from-top-2">
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <div className="space-y-6">
                                {/* Icon */}
                                <div>
                                    <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-500">Icon</label>
                                    <select
                                        value={form.icon}
                                        onChange={e => { setForm(f => ({ ...f, icon: e.target.value })); clearFieldError('icon'); }}
                                        className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:border-[var(--navy)] focus:outline-none ${hasError(fieldErrors, 'icon') ? 'border-red-300 bg-red-50/30' : ''}`}
                                    >
                                        {Object.keys(ICON_MAP).map(name => (
                                            <option key={name} value={name}>{name}</option>
                                        ))}
                                    </select>
                                    {hasError(fieldErrors, 'icon') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'icon')}</p>}
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-500">Title</label>
                                    <input
                                        value={form.title}
                                        onChange={e => { setForm(f => ({ ...f, title: e.target.value })); clearFieldError('title'); }}
                                        placeholder="e.g. Mandatory Acclimatization"
                                        className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-[var(--navy)] focus:outline-none ${hasError(fieldErrors, 'title') ? 'border-red-300 bg-red-50/30' : ''}`}
                                    />
                                    {hasError(fieldErrors, 'title') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'title')}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                                    <textarea
                                        rows={3}
                                        value={form.desc}
                                        onChange={e => { setForm(f => ({ ...f, desc: e.target.value })); clearFieldError('desc'); }}
                                        placeholder="Short tip description..."
                                        className={`w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-[var(--navy)] focus:outline-none resize-none ${hasError(fieldErrors, 'desc') ? 'border-red-300 bg-red-50/30' : ''}`}
                                    />
                                    {hasError(fieldErrors, 'desc') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'desc')}</p>}
                                </div>

                                {/* Colour Theme */}
                                <div>
                                    <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Card Colour</label>
                                    <div className="flex flex-wrap gap-2">
                                        {COLOR_OPTIONS.map(opt => (
                                            <button
                                                key={opt.label}
                                                onClick={() => handleColorSelect(opt)}
                                                className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition ${opt.color} ${opt.border} ${form.color === opt.color ? "ring-2 ring-offset-1 ring-slate-900" : "opacity-60 hover:opacity-100"}`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Order */}
                                <div>
                                    <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-500">Display Order</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={form.order}
                                        onChange={e => { setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 })); clearFieldError('order'); }}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-[var(--navy)] focus:outline-none"
                                    />
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className="mt-auto border-t bg-slate-50/50 px-8 py-5 flex justify-end gap-3">
                            <button
                                onClick={handleCloseAttempt}
                                className="rounded-2xl px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center justify-center gap-2 min-w-[140px] rounded-2xl bg-[var(--navy)] px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-900/10 transition-all hover:bg-[var(--blue)] disabled:opacity-60 active:scale-95"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>{editing ? "Saving..." : "Adding..."}</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={18} />
                                        <span>{editing ? "Save Changes" : "Add Tip"}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals */}
            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                title="Remove this tip?"
                message="This will hide the tip from the website. This action cannot be undone."
                onConfirm={handleDelete}
                onClose={() => setDeleteModal({ isOpen: false, id: "" })}
                isDeleting={deleting}
            />
            <ConfirmModal
                isOpen={confirmClose}
                title="Discard changes?"
                message="You have unsaved changes. Are you sure you want to close?"
                confirmText="Discard"
                onConfirm={closeModal}
                onClose={() => setConfirmClose(false)}
            />
        </AdminShell>
    );
}
