"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
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
    Compass,
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Skeleton from "@/components/admin/Skeleton";

// Map of available lucide icon names to components
const ICON_MAP: Record<string, React.ElementType> = {
    Wind, WifiOff, FileText, Stethoscope, ShieldAlert, Mountain,
    Star, Droplets, Sun, Camera, Heart, Compass, Info, AlertCircle,
};

const COLOR_OPTIONS = [
    { label: "Blue", color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
    { label: "Amber", color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
    { label: "Red", color: "bg-red-50 text-red-600", border: "border-red-100" },
    { label: "Indigo", color: "bg-indigo-50 text-indigo-700", border: "border-indigo-100" },
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
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<LehTip | null>(null);
    const [form, setForm] = useState(EMPTY);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState("");
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
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
    };

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3000);
    };

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/leh-tips");
            setItems(await res.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

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
        setSaving(true);
        setError("");
        setFieldErrors({});
        try {
            const url = editing ? `/api/leh-tips/${editing.id}` : "/api/leh-tips";
            const method = editing ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, order: Number(form.order) }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (data.details) setFieldErrors(data.details);
                else setError(data.error || "Something went wrong.");
                return;
            }
            showToast(editing ? "Tip updated!" : "Tip added!");
            closeModal();
            fetchItems();
        } catch {
            setError("Network error. Please try again.");
        } finally {
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
    };

    return (
        <AdminShell title="Leh Tips">
            <div className="mx-auto max-w-5xl px-4 py-10">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">Know Before You Go</h1>
                        <p className="mt-1 text-sm text-slate-500">Manage the tips shown in the Leh preparation section.</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-black text-white transition hover:bg-[var(--blue)] active:scale-95"
                    >
                        <Plus size={16} /> Add Tip
                    </button>
                </div>

                {/* Toast */}
                {toast && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl bg-green-50 px-5 py-3 text-sm font-bold text-green-700 shadow-sm ring-1 ring-green-200">
                        <Check size={16} /> {toast}
                    </div>
                )}

                {/* Tips Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
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
            </div>

            {/* Add/Edit Modal */}
            {modal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900">{editing ? "Edit Tip" : "Add New Tip"}</h2>
                            <button onClick={handleCloseAttempt} className="rounded-xl p-2 hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 ring-1 ring-red-200">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            {/* Icon */}
                            <div>
                                <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-500">Icon</label>
                                <select
                                    value={form.icon}
                                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:border-[var(--navy)] focus:outline-none"
                                >
                                    {Object.keys(ICON_MAP).map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                                {fieldErrors.icon && <p className="mt-1 text-xs text-red-500">{fieldErrors.icon[0]}</p>}
                            </div>

                            {/* Title */}
                            <div>
                                <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-500">Title</label>
                                <input
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. Mandatory Acclimatization"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-[var(--navy)] focus:outline-none"
                                />
                                {fieldErrors.title && <p className="mt-1 text-xs text-red-500">{fieldErrors.title[0]}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="mb-1 block text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
                                <textarea
                                    rows={3}
                                    value={form.desc}
                                    onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                                    placeholder="Short tip description..."
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-[var(--navy)] focus:outline-none resize-none"
                                />
                                {fieldErrors.desc && <p className="mt-1 text-xs text-red-500">{fieldErrors.desc[0]}</p>}
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
                                    onChange={e => setForm(f => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-[var(--navy)] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <button onClick={handleCloseAttempt} className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 rounded-xl bg-[var(--navy)] px-6 py-3 text-sm font-black text-white hover:bg-[var(--blue)] disabled:opacity-60 active:scale-95"
                            >
                                {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Check size={16} /> {editing ? "Save Changes" : "Add Tip"}</>}
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
