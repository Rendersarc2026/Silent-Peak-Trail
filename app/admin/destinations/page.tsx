"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  Plus,
  Trash2,
  X,
  MapPin,
  Mountain,
  Check,
  Loader2,
  ImageIcon,
  Edit2,
  CheckCircle2,
  Star,
  AlertCircle
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Skeleton from "@/components/admin/Skeleton";
import Pagination from "@/components/admin/Pagination";
import SearchInput from "@/components/admin/SearchInput";
import { validateWithYup, cn, hasError, getErrorMessage } from "@/lib/utils";
import { destinationSchema } from "@/lib/validation";

interface Dest { id: string; name: string; type: string; altitude: string; img: string; big: boolean; }
const EMPTY = { name: "", type: "", altitude: "", img: "", big: false };

export default function DestinationsPage() {
  const [items, setItems] = useState<Dest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Dest | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
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
        form.name !== editing.name ||
        form.type !== editing.type ||
        form.altitude !== editing.altitude ||
        form.img !== editing.img ||
        form.big !== editing.big
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
  const load = (page = 1, s = search) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      search: s,
      limit: "10"
    });
    return fetch(`/api/destinations?${params}`)
      .then(r => r.json())
      .then(res => {
        setItems(res.data);
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

  function openNew() { setEditing(null); setForm(EMPTY); setModal(true); setError(""); setFieldErrors({}); }
  function openEdit(d: Dest) { setEditing(d); setForm({ name: d.name, type: d.type, altitude: d.altitude, img: d.img, big: d.big }); setModal(true); setError(""); setFieldErrors({}); }

  async function save() {
    setError("");
    setFieldErrors({});

    // Client-side validation using Yup
    const { success, error: validationError } = await validateWithYup(destinationSchema, form);
    if (!success) {
      setFieldErrors(validationError?.fieldErrors as any);
      setError("Please fill all required fields.");
      return;
    }

    // Duplicate name check
    const nameNormal = form.name.trim().toLowerCase();
    const isDuplicate = items.some(d => d.name.trim().toLowerCase() === nameNormal && d.id !== editing?.id);
    if (isDuplicate) {
      setError(`A destination named "${form.name.trim()}" already exists.`);
      return;
    }

    setSaving(true);
    const url = editing ? `/api/destinations/${editing.id}` : "/api/destinations";
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
          setError(data.error || "Failed to save destination.");
        }
        setSaving(false);
        return;
      }

      setSaving(false);
      setModal(false);
      await load(currentPage);
      showToast(editing ? "Destination updated successfully!" : "Destination added successfully!");
    } catch (err) {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function del(id: string) {
    setDeleting(true);
    try {
      await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      await load(currentPage);
      showToast("Destination deleted successfully!");
    } finally {
      setDeleting(false);
      setDeleteModal({ isOpen: false, id: "" });
    }
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <AdminShell title="Destinations">
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "" })}
        onConfirm={() => del(deleteModal.id)}
        isDeleting={deleting}
        title="Delete Destination"
        message="Are you sure you want to delete this destination? This action will remove it from the travel exploration grid."
      />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          placeholder="Search destinations..."
          loading={loading && !!search}
          className="max-w-md"
        />
        <button
          onClick={openNew}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-sm active:scale-[0.98] shrink-0 whitespace-nowrap self-start sm:self-auto"
        >
          <Plus size={16} />
          Add Destination
        </button>
      </div>

      {toast && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700 border border-green-100 shadow-sm">
          <CheckCircle2 size={18} className="text-green-600" />
          {toast}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-3 sm:px-6 py-3 sm:py-4">Destination</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Category & Features</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Altitude / Stats</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <Skeleton className="h-10 w-14 sm:h-12 sm:w-16 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-16 rounded-full" />
                        <Skeleton className="h-4 w-12 rounded-full" />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <p>No destinations found. Add your first destination!</p>
                  </td>
                </tr>
              ) : (
                items.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="h-10 w-14 sm:h-12 sm:w-16 overflow-hidden rounded-lg border bg-slate-100 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={d.img} alt={d.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{d.name}</div>
                          <div className="text-[10px] text-slate-500 md:hidden mt-0.5 whitespace-normal">
                            {d.type} {d.altitude ? `· ${d.altitude}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600 ring-1 ring-inset ring-blue-500/20 whitespace-nowrap">
                          <MapPin size={10} /> {d.type}
                        </span>
                        {d.big && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-600 ring-1 ring-inset ring-amber-500/20 whitespace-nowrap">
                            <Star size={10} strokeWidth={3} /> Hero Item
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Mountain size={14} className="text-slate-300" />
                        <span className="text-xs sm:text-sm">{d.altitude}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => openEdit(d)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: d.id })}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && items.length > 0 && (
          <div className="border-t bg-slate-50/30">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                load(page, search);
              }}
            />
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200" onClick={handleCloseAttempt}>
          <div
            className="relative w-full sm:max-w-xl max-h-[95dvh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">{editing ? "Edit Destination" : "Add Destination"}</h3>
              <button
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {error && (
                <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100 animate-in slide-in-from-top-2">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Destination Name
                    </label>
                    <span className={`text-[10px] font-bold ${form.name.length > 45 ? 'text-red-500' : 'text-slate-400'}`}>
                      {form.name.length} / 50
                    </span>
                  </div>
                  <input
                    maxLength={50}
                    className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'name') && 'border-red-300 ring-2 ring-red-500/10')}
                    placeholder="e.g. Pangong Tso"
                    value={form.name}
                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); clearFieldError('name'); }}
                  />
                  {hasError(fieldErrors, 'name') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'name')}</p>}
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5 ml-1">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Category / Type
                    </label>
                    <span className={`text-[10px] font-bold ${form.type.length > 25 ? 'text-red-500' : 'text-slate-400'}`}>
                      {form.type.length} / 30
                    </span>
                  </div>
                  <input
                    maxLength={30}
                    className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'type') && 'border-red-300 ring-2 ring-red-500/10')}
                    placeholder="e.g. High-Altitude Lake"
                    value={form.type}
                    onChange={e => { setForm(f => ({ ...f, type: e.target.value })); clearFieldError('type'); }}
                  />
                  {hasError(fieldErrors, 'type') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'type')}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">
                  Altitude / Quick Stats
                </label>
                <input
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'altitude') && 'border-red-300 ring-2 ring-red-500/10')}
                  placeholder="e.g. 4,350m · 134km long"
                  value={form.altitude}
                  onChange={e => { setForm(f => ({ ...f, altitude: e.target.value })); clearFieldError('altitude'); }}
                />
                {hasError(fieldErrors, 'altitude') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'altitude')}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">
                  Destination Image
                </label>
                <ImageUpload
                  value={form.img}
                  onChange={url => { setForm(f => ({ ...f, img: url })); clearFieldError('img'); }}
                  onError={msg => setError(msg)}
                />
                {hasError(fieldErrors, 'img') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'img')}</p>}
              </div>

              <label className="flex items-center gap-3 cursor-pointer group pt-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={form.big}
                    onChange={e => { setForm(f => ({ ...f, big: e.target.checked })); clearFieldError('big'); }}
                  />
                  <div className="h-5 w-5 rounded-md border-2 border-slate-200 transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 group-hover:border-blue-400"></div>
                  <Check size={14} className="absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Hero Item</span>
                  <span className="text-[10px] text-slate-400">Spans 2 rows in the homepage grid</span>
                </div>
              </label>
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
                ) : (editing ? "Save Changes" : "Add Destination")}
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
