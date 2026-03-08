"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  Plus,
  Trash2,
  X,
  Maximize,
  Square,
  Check,
  Loader2,
  Image as ImageIcon,
  Edit2,
  AlertCircle
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Skeleton from "@/components/admin/Skeleton";
import Pagination from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/SearchInput";
import { validateWithYup, cn, hasError, getErrorMessage } from "@/lib/utils";
import { gallerySchema } from "@/lib/validation";

interface GalleryItem { id: string; src: string; alt: string; wide: boolean; tall: boolean; }
const EMPTY = { src: "", alt: "", wide: false, tall: false };

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: "" });
  const [deleting, setDeleting] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const isDirty = () => {
    if (editing) {
      return (
        form.src !== editing.src ||
        form.alt !== editing.alt ||
        form.wide !== editing.wide ||
        form.tall !== editing.tall
      );
    }
    return JSON.stringify(form) !== JSON.stringify(EMPTY);
  };

  const handleCloseAttempt = () => {
    if (isDirty()) {
      setConfirmClose(true);
    } else {
      setModal(false);
      setForm(EMPTY);
      setEditing(null);
      setFieldErrors({});
    }
  };
  const load = (page = 1, s = search, lim = rowsPerPage) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      search: s,
      limit: lim.toString()
    });
    return fetch(`/api/gallery?${params}`)
      .then(r => r.json())
      .then(res => {
        // Map _id from MongoDB to id for the frontend
        const mappedData = (res.data || []).map((item: any) => ({
          ...item,
          id: item._id
        }));
        setItems(mappedData);
        setTotalPages(res.totalPages);
        setCurrentPage(res.currentPage);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      load(1, search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);


  async function save() {
    setError("");
    setFieldErrors({});

    // Client-side validation using Yup
    const { success, error: validationError } = await validateWithYup(gallerySchema, form);
    if (!success) {
      setFieldErrors(validationError?.fieldErrors as any);
      setError("Please fill all required fields.");
      return;
    }

    // Duplicate image check
    const isDuplicate = items.some(g => g.src === form.src && g.id !== editing?.id);
    if (isDuplicate) {
      setError("This image is already in the gallery.");
      return;
    }

    setSaving(true);
    const url = editing ? `/api/gallery/${editing.id}` : "/api/gallery";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
          setError("Please fill all required fields.");
        } else {
          setError(data.error || "Failed to save image.");
        }
        setSaving(false);
        return;
      }

      setSaving(false);
      setModal(false);
      setForm(EMPTY);
      setEditing(null);
      setFieldErrors({});
      await load(currentPage);

      showToast(editing ? "Image updated successfully!" : "Image added to gallery!");
    } catch (err) {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function del(id: string) {
    setDeleting(true);
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      await load();
      showToast("Image deleted successfully!");
    } finally {
      setDeleting(false);
      setDeleteModal({ isOpen: false, id: "" });
    }
  }

  async function toggle(item: GalleryItem, field: "wide" | "tall") {
    await fetch(`/api/gallery/${item.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, [field]: !item[field] })
    });
    await load();
  }

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setModal(true);
    setError("");
    setFieldErrors({});
  }

  function openEdit(item: GalleryItem) {
    setEditing(item);
    setForm({
      src: item.src,
      alt: item.alt,
      wide: item.wide,
      tall: item.tall
    });
    setModal(true);
    setError("");
    setFieldErrors({});
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <AdminShell title="Gallery">
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "" })}
        onConfirm={() => del(deleteModal.id)}
        isDeleting={deleting}
        title="Remove Image"
        message="Are you sure you want to remove this image from the gallery? It will no longer be visible on the public site."
      />
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Search gallery..."
          loading={loading && !!search}
          className="max-w-md"
        />
        <button
          onClick={openNew}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-sm active:scale-[0.98] shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Image
        </button>
      </div>

      {toast && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700 border border-green-100 shadow-sm">
          <Check size={18} className="text-green-600" />
          {toast}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="p-4">
                <Skeleton className="h-4 w-3/4 mb-3" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-16 rounded-lg" />
                  <Skeleton className="h-6 w-16 rounded-lg" />
                </div>
                <div className="flex items-center border-t pt-4 gap-2">
                  <Skeleton className="h-8 flex-1 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400 border-2 border-dashed rounded-3xl bg-slate-50/50">
            <div className="flex flex-col items-center gap-3">
              <ImageIcon size={48} className="text-slate-200" />
              <p>No gallery images yet. Start by adding one!</p>
            </div>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100 transition-all hover:shadow-md">
              <div className="aspect-[4/3] overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-4">
                <div className="mb-3 text-sm font-semibold text-slate-900 line-clamp-1">
                  {item.alt || "No description provided"}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => toggle(item, "wide")}
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${item.wide
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    title="Wide layout"
                  >
                    <Maximize size={10} /> Wide
                  </button>
                  <button
                    onClick={() => toggle(item, "tall")}
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${item.tall
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    title="Tall layout"
                  >
                    <Square size={10} /> Tall
                  </button>
                </div>

                <div className="flex items-center border-t pt-4 gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-slate-50 py-2 text-xs font-bold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteModal({ isOpen: true, id: item.id })}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && items.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(val) => {
              setRowsPerPage(val);
              setCurrentPage(1);
              load(1, search, val);
            }}
            onPageChange={(page) => {
              setCurrentPage(page);
              load(page, search);
            }}
          />
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200" onClick={handleCloseAttempt}>
          <div
            className="relative w-full sm:max-w-lg max-h-[95dvh] sm:max-h-[90vh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-6 py-4 shrink-0">
              <h3 className="text-lg font-bold text-slate-900">{editing ? "Edit Gallery Image" : "Add Gallery Image"}</h3>
              <button
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                id="close-gallery-modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto min-h-0 flex-1">
              {error && (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100 animate-in slide-in-from-top-2">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                  {error}
                </div>
              )}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">
                  Gallery Image
                </label>
                <ImageUpload
                  value={form.src}
                  onChange={(url: string) => { setForm(f => ({ ...f, src: url })); clearFieldError('src'); }}
                  onError={(msg: string) => setError(msg)}
                />
                {hasError(fieldErrors, 'src') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'src')}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Description / Alt Text
                  </label>
                  <span className={`text-[10px] font-bold ${form.alt.length > 90 ? 'text-red-500' : 'text-slate-400'}`}>
                    {form.alt.length} / 100
                  </span>
                </div>
                <input
                  maxLength={100}
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'alt') && 'border-red-300 ring-2 ring-red-500/10')}
                  value={form.alt}
                  onChange={e => { setForm(f => ({ ...f, alt: e.target.value })); clearFieldError('alt'); }}
                  placeholder="e.g. Pangong lake at sunrise"
                />
                {hasError(fieldErrors, 'alt') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'alt')}</p>}
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.wide}
                      onChange={e => { setForm(f => ({ ...f, wide: e.target.checked })); clearFieldError('wide'); }}
                    />
                    <div className="h-5 w-5 rounded-md border-2 border-slate-200 transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 group-hover:border-blue-400"></div>
                    <Check size={14} className="absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Wide (2 cols)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.tall}
                      onChange={e => { setForm(f => ({ ...f, tall: e.target.checked })); clearFieldError('tall'); }}
                    />
                    <div className="h-5 w-5 rounded-md border-2 border-slate-200 transition-all peer-checked:bg-indigo-600 peer-checked:border-indigo-600 group-hover:border-indigo-400"></div>
                    <Check size={14} className="absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600 transition-colors">Tall (2 rows)</span>
                </label>
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
                onClick={save}
                disabled={saving}
                className="flex items-center justify-center gap-2 min-w-[120px] rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-sm disabled:opacity-70 active:scale-[0.98]"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{editing ? "Saving..." : "Adding..."}</span>
                  </>
                ) : (editing ? "Save Changes" : "Add Image")}
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
          setForm(EMPTY);
          setEditing(null);
          setFieldErrors({});
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close? Your progress will be lost."
        confirmText="Close Anyway"
        cancelText="Stay"
      />
    </AdminShell>
  );
}
