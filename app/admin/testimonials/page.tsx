"use client";
import { useEffect, useState, useCallback } from "react";
import { useAction } from "@/lib/hooks/useAction";
import AdminShell from "@/components/admin/AdminShell";
import {
  Plus,
  Trash2,
  X,
  Star,
  MapPin,
  Quote,
  Check,
  Loader2,
  CheckCircle2,
  Edit2,
  Copy,
  Clock,
  ThumbsUp,
  ThumbsDown,
  AlertCircle
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { cn, hasError, getErrorMessage } from "@/lib/utils";
import { reviewSchema } from "@/lib/validation";


interface Review {
  id: number;
  name: string;
  place: string;
  packageId: number;
  tourPackage?: { name: string };
  message: string;
  rating: number;
  initial: string;
  isApproved: boolean;
  createdAt: string;
}

interface PackageOption {
  id: number;
  name: string;
}

const EMPTY = { name: "", place: "", packageId: 0, rating: 5, message: "" };

import Skeleton from "@/components/admin/Skeleton";

export default function TestimonialsAdmin() {
  const [items, setItems] = useState<Review[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [confirmClose, setConfirmClose] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const isDirty = () => {
    if (editing) {
      return (
        form.name !== editing.name ||
        form.place !== editing.place ||
        form.packageId !== editing.packageId ||
        form.rating !== editing.rating ||
        form.message !== editing.message
      );
    }
    return JSON.stringify(form) !== JSON.stringify(EMPTY);
  };

  const handleCloseAttempt = () => {
    if (isDirty()) {
      setConfirmClose(true);
    } else {
      setModal(false);
      setEditing(null);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [revRes, pkgRes] = await Promise.all([
        fetch("/api/reviews"),
        fetch("/api/packages")
      ]);
      const [revData, pkgData] = await Promise.all([
        revRes.json(),
        pkgRes.json()
      ]);
      setItems(Array.isArray(revData) ? revData : []);
      setPackages(Array.isArray(pkgData) ? pkgData : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const [handleSave, { loading: saving }] = useAction(async () => {
    const isEdit = !!editing;
    const url = isEdit ? `/api/reviews/${editing.id}` : "/api/reviews";
    const method = isEdit ? "PUT" : "POST";

    setError(null);
    setFieldErrors({});

    // Client-side validation
    const result = reviewSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors as any);
      setError("Please fill all required fields.");
      return;
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        isApproved: true // Admin edits/additions are auto-approved
      })
    });

    const data = await res.json();

    if (res.ok) {
      setModal(false);
      setEditing(null);
      await load();
      showToast(isEdit ? "Review updated successfully!" : "Review added successfully!");
    } else {
      if (data.details) {
        setFieldErrors(data.details);
        setError("Please fill all required fields.");
      } else {
        setError(data.error || "Something went wrong.");
      }
    }
  }, { onSuccess: () => { } });

  const [handleToggle, { loading: toggling }] = useAction(async (review: Review) => {
    const res = await fetch(`/api/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isApproved: !review.isApproved })
    });
    if (res.ok) {
      await load();
      showToast(review.isApproved ? "Review hidden from website." : "Review approved and live!");
    }
  });

  const [handleDelete, { loading: deleting }] = useAction(async (id: number) => {
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      await load();
      showToast("Review deleted successfully!");
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  });

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function copyReviewLink() {
    const link = `${window.location.origin}/reviews/new`;
    navigator.clipboard.writeText(link);
    showToast("Review link copied to clipboard!");
  }

  const pendingCount = items.filter(i => !i.isApproved).length;

  return (
    <AdminShell title="Testimonials & Reviews">
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && handleDelete(deleteModal.id)}
        isDeleting={deleting}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review? This action cannot be undone."
      />
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium text-slate-500">Manage customer feedback and moderation</h2>
          {pendingCount > 0 && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
              <Clock size={12} />
              {pendingCount} Pending Reviews
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={copyReviewLink}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 shadow-sm active:scale-[0.98]"
          >
            <Copy size={16} />
            Copy Review Link
          </button>
          <button
            onClick={() => { setEditing(null); setForm(EMPTY); setError(null); setFieldErrors({}); setModal(true); }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-sm active:scale-[0.98]"
          >
            <Plus size={16} />
            Add Manually
          </button>
        </div>
      </div>

      {toast && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700 border border-green-100 shadow-sm">
          <CheckCircle2 size={18} className="text-green-600" />
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="flex-1 mb-4">
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <div className="mt-auto flex items-center justify-between border-t pt-4">
                <Skeleton className="h-3 w-24" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-6 text-slate-400">
              <Star size={48} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No reviews yet</h3>
            <p className="max-w-xs text-sm text-slate-500">
              Start by copying the review link and sending it to your customers.
            </p>
          </div>
        ) : (
          items.map(t => (
            <div
              key={t.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm ring-1 transition-all hover:shadow-md group ${t.isApproved ? 'ring-slate-100' : 'ring-amber-200 bg-amber-50/10'
                }`}
            >
              {!t.isApproved && (
                <div className="absolute -top-3 right-4 rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
                  Pending Approval
                </div>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-inner">
                  {t.initial}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">{t.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{t.place}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < t.rating ? "currentColor" : "transparent"}
                    className={i < t.rating ? "text-amber-400" : "text-slate-200"}
                  />
                ))}
              </div>

              <div className="relative mb-4 flex-1">
                <Quote size={24} className="absolute -top-2 -left-2 text-slate-50 opacity-50 transition-colors group-hover:text-blue-50" />
                <p className="text-sm leading-relaxed text-slate-600 italic line-clamp-4 relative z-10">
                  &ldquo;{t.message}&rdquo;
                </p>
              </div>

              <div className="mt-auto flex items-center justify-between border-t pt-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {t.tourPackage?.name || "General Experience"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditing(t);
                      setForm({
                        name: t.name,
                        place: t.place,
                        packageId: t.packageId,
                        rating: t.rating,
                        message: t.message
                      });
                      setError(null);
                      setFieldErrors({});
                      setModal(true);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  {!t.isApproved && (
                    <button
                      onClick={() => handleToggle(t)}
                      disabled={toggling}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-green-700 active:scale-95 shadow-sm disabled:opacity-50"
                    >
                      <Check size={14} /> Approve
                    </button>
                  )}
                  {t.isApproved && (
                    <button
                      onClick={() => handleToggle(t)}
                      disabled={toggling}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      title="Hide from website"
                    >
                      <ThumbsDown size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: t.id })}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={handleCloseAttempt}>
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">{editing ? "Edit Review" : "Add Review Manually"}</h3>
              <button
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                id="close-testimonial-modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">
                    Client Name
                  </label>
                  <input
                    className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'name') && 'border-red-300 ring-2 ring-red-500/10')}
                    placeholder="e.g. Rohit Sharma"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {hasError(fieldErrors, 'name') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'name')}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">
                    Location
                  </label>
                  <input
                    className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'place') && 'border-red-300 ring-2 ring-red-500/10')}
                    placeholder="e.g. Mumbai, India"
                    value={form.place}
                    onChange={e => setForm(f => ({ ...f, place: e.target.value }))}
                  />
                  {hasError(fieldErrors, 'place') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'place')}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">
                  Package or Experience
                </label>
                <select
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'packageId') && 'border-red-300 ring-2 ring-red-500/10')}
                  value={form.packageId}
                  onChange={e => setForm(f => ({ ...f, packageId: Number(e.target.value) }))}
                >
                  <option value={0}>Select a package</option>
                  {packages.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {hasError(fieldErrors, 'packageId') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'packageId')}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">
                  Review Statement
                </label>
                <textarea
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white resize-none", hasError(fieldErrors, 'message') && 'border-red-300 ring-2 ring-red-500/10')}
                  rows={4}
                  placeholder="Share the client's experience..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                />
                {hasError(fieldErrors, 'message') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'message')}</p>}
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 ml-1">
                  Star Rating
                </label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setForm(f => ({ ...f, rating: n }))}
                      className="group flex flex-col items-center gap-1 transition-all"
                    >
                      <Star
                        size={28}
                        fill={n <= form.rating ? "currentColor" : "transparent"}
                        className={`transition-all ${n <= form.rating ? "text-amber-400 scale-110" : "text-slate-200 group-hover:text-amber-200"}`}
                      />
                      <span className={`text-[10px] font-bold transition-all ${n === form.rating ? "text-amber-600" : "text-slate-300"}`}>{n}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t bg-slate-50/50 px-6 py-4">
              <button
                onClick={handleCloseAttempt}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave({})}
                disabled={saving}
                className="flex items-center justify-center gap-2 min-w-[120px] rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-sm disabled:opacity-70 active:scale-[0.98]"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : (editing ? "Save Changes" : "Add Review")}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={confirmClose}
        onClose={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          setModal(false);
          setEditing(null);
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close? Your progress will be lost."
        confirmText="Close Anyway"
        cancelText="Stay"
      />
    </AdminShell>
  );
}
