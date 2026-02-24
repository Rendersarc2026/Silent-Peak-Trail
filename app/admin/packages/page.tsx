"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmModal from "@/components/admin/ConfirmModal";


interface Pkg {
  id: string; name: string; tagline: string; duration: string;
  price: number; badge: string; badgeGold: boolean; featured: boolean;
  img: string; features: string[];
  itinerary: { day: string; title: string; activities?: string }[];
  inclusions: string[];
  exclusions: string[];
}

const EMPTY: Omit<Pkg, "id"> = {
  name: "", tagline: "", duration: "", price: 0,
  badge: "", badgeGold: false, featured: false, img: "", features: [],
  itinerary: [], inclusions: [], exclusions: [],
};

import Skeleton from "@/components/admin/Skeleton";

export default function PackagesPage() {
  const [pkgs, setPkgs] = useState<Pkg[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [form, setForm] = useState<Omit<Pkg, "id">>(EMPTY);
  const [featStr, setFeatStr] = useState("");
  const [itineraryStr, setItineraryStr] = useState("");
  const [incStr, setIncStr] = useState("");
  const [excStr, setExcStr] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string }>({ isOpen: false, id: "" });
  const [deleting, setDeleting] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const isDirty = () => {
    if (editing) {
      const origItinerary = (editing.itinerary || []).map(i => `${i.day}|${i.title}${i.activities ? `|${i.activities}` : ""}`).join("\n");
      return (
        form.name !== editing.name ||
        form.tagline !== editing.tagline ||
        form.duration !== editing.duration ||
        form.price !== editing.price ||
        form.badge !== editing.badge ||
        form.badgeGold !== editing.badgeGold ||
        form.featured !== editing.featured ||
        form.img !== editing.img ||
        featStr !== editing.features.join("\n") ||
        itineraryStr !== origItinerary ||
        incStr !== (editing.inclusions || []).join("\n") ||
        excStr !== (editing.exclusions || []).join("\n")
      );
    }
    return (
      form.name !== EMPTY.name ||
      form.tagline !== EMPTY.tagline ||
      form.duration !== EMPTY.duration ||
      form.price !== EMPTY.price ||
      form.img !== EMPTY.img ||
      featStr !== "" ||
      itineraryStr !== "" ||
      incStr !== "" ||
      excStr !== ""
    );
  };

  const handleCloseAttempt = () => {
    if (isDirty()) {
      setConfirmClose(true);
    } else {
      closeModal();
    }
  };

  const load = () => {
    setLoading(true);
    return fetch("/api/packages")
      .then(r => r.json())
      .then(setPkgs)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null); setForm(EMPTY); setFeatStr("");
    setItineraryStr(""); setIncStr(""); setExcStr("");
    setModal(true); setError(""); setFieldErrors({});
  }
  function openEdit(p: Pkg) {
    setEditing(p);
    setForm({
      name: p.name, tagline: p.tagline, duration: p.duration, price: p.price,
      badge: p.badge, badgeGold: p.badgeGold, featured: p.featured, img: p.img,
      features: p.features, itinerary: p.itinerary || [],
      inclusions: p.inclusions || [], exclusions: p.exclusions || []
    });
    setFeatStr(p.features.join("\n"));
    setItineraryStr((p.itinerary || []).map(i => `${i.day}|${i.title}${i.activities ? `|${i.activities}` : ""}`).join("\n"));
    setIncStr((p.inclusions || []).join("\n"));
    setExcStr((p.exclusions || []).join("\n"));
    setModal(true); setError(""); setFieldErrors({});
  }
  function closeModal() { setModal(false); setEditing(null); setError(""); setFieldErrors({}); }

  function validate() {
    const nameRegex = /^[a-zA-Z0-9\s.,&']*$/;
    const looseRegex = /^[^<>{}]*$/;

    if (!form.name || !form.tagline || !form.duration || !form.img) return "Please fill all required fields.";
    if (!nameRegex.test(form.name)) return "Name can only contain letters, numbers, spaces, periods, commas, ampersands and apostrophes.";
    if (!looseRegex.test(form.tagline)) return "Tagline cannot contain HTML tags or brackets.";
    if (!looseRegex.test(form.badge)) return "Badge cannot contain HTML tags or brackets.";
    if (form.price < 0) return "Price cannot be negative.";

    // Duplicate name check
    const nameNormal = form.name.trim().toLowerCase();
    const isDuplicate = pkgs.some(p => p.name.trim().toLowerCase() === nameNormal && p.id !== editing?.id);
    if (isDuplicate) return `A package named "${form.name.trim()}" already exists.`;

    return null;
  }

  async function save() {
    const err = validate();
    if (err) { setError(err); return; }

    setSaving(true);
    setError("");
    setFieldErrors({});

    const itinerary = itineraryStr.split("\n").map(line => {
      const [day, title, activities] = line.split("|").map(s => s.trim());
      if (!day || !title) return null;
      return { day, title, activities };
    }).filter(Boolean);

    const payload = {
      ...form,
      features: featStr.split("\n").map(s => s.trim()).filter(Boolean),
      itinerary,
      inclusions: incStr.split("\n").map(s => s.trim()).filter(Boolean),
      exclusions: excStr.split("\n").map(s => s.trim()).filter(Boolean),
      price: Number(form.price)
    };
    const url = editing ? `/api/packages/${editing.id}` : "/api/packages";
    const method = editing ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
          setError("Please correct the highlighted fields below.");
        } else {
          setError(data.error || "Failed to save package.");
        }
        setSaving(false);
        return;
      }

      setSaving(false); closeModal(); await load();
      showToast(editing ? "Package updated successfully!" : "Package added successfully!");
    } catch (err) {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  async function del(id: string) {
    setDeleting(true);
    try {
      await fetch(`/api/packages/${id}`, { method: "DELETE" });
      await load();
      showToast("Package deleted successfully!");
    } finally {
      setDeleting(false);
      setDeleteModal({ isOpen: false, id: "" });
    }
  }

  function showToast(msg: string) {
    setToast(msg); setTimeout(() => setToast(""), 3000);
  }

  return (
    <AdminShell title="Packages">
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "" })}
        onConfirm={() => del(deleteModal.id)}
        isDeleting={deleting}
        title="Delete Package"
        message="Are you sure you want to delete this tour package? This action cannot be undone."
      />
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search packages..."
            className="block w-full rounded-xl border-slate-200 bg-white pl-10 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10"
          />
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus size={16} />
          Add New Package
        </button>
      </div>

      {toast && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700 border border-green-100 shadow-sm">
          <Check size={18} className="text-green-600" />
          {toast}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-3 sm:px-6 py-3 sm:py-4">Package</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Status &amp; Features</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">Price</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-600">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-12 sm:h-16 w-16 sm:w-24 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-16 rounded-full" />
                        <Skeleton className="h-4 w-12 rounded-full" />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-lg" />
                        <Skeleton className="h-8 w-8 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : pkgs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon size={48} className="text-slate-200" />
                      <p>No packages found. Add your first tour package!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pkgs.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 min-w-[200px]">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 sm:h-16 w-16 sm:w-24 overflow-hidden rounded-lg border bg-slate-100 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 line-clamp-1 text-sm">{p.name}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">{p.tagline}</div>
                          <div className="mt-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{p.duration}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-2">
                        {p.featured && (
                          <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase text-blue-600 ring-1 ring-inset ring-blue-500/20">
                            Featured
                          </span>
                        )}
                        {p.badge && (
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1 ring-inset ${p.badgeGold
                            ? "bg-amber-50 text-amber-700 ring-amber-500/20"
                            : "bg-slate-50 text-slate-600 ring-slate-500/20"
                            }`}>
                            {p.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium self-center">{p.features.length} points</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-right tabular-nums font-semibold text-slate-900 text-sm whitespace-nowrap">
                      ₹{p.price.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, id: p.id })}
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
      </div>

      {/* Modal Overlay */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200" onClick={handleCloseAttempt}>
          <div
            className="relative w-full sm:max-w-2xl max-h-[95dvh] sm:max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{editing ? "Edit Package" : "Add New Package"}</h3>
                <p className="text-xs text-slate-500">Configure your tour package details below</p>
              </div>
              <button
                onClick={handleCloseAttempt}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                      Package Name
                    </label>
                    <span className={`text-[10px] font-bold ${form.name.length > 45 ? 'text-red-500' : 'text-slate-400'}`}>
                      {form.name.length} / 50
                    </span>
                  </div>
                  <input
                    maxLength={50}
                    className={`block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white ${fieldErrors.name ? 'border-red-300 bg-red-50/30' : ''}`}
                    placeholder="Pangong Lake Explorer"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  {fieldErrors.name && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.name[0]}</p>}
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-2 ml-1 ${fieldErrors.duration ? 'text-red-500' : 'text-slate-500'}`}>
                    Duration
                  </label>
                  <select
                    className={`block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white ${fieldErrors.duration ? 'border-red-300 bg-red-50/30' : ''}`}
                    value={(() => {
                      const m = form.duration.match(/^(\d+)\s*Day/);
                      return m ? m[1] : "";
                    })()}
                    onChange={e => {
                      const days = Number(e.target.value);
                      const nights = Math.max(0, days - 1);
                      setForm(f => ({ ...f, duration: days ? `${days} Days · ${nights} Nights` : "" }));
                    }}
                  >
                    <option value="">Select number of days</option>
                    {Array.from({ length: 21 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={String(d)}>{d} Days · {Math.max(0, d - 1)} Nights</option>
                    ))}
                  </select>
                  {fieldErrors.duration && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.duration[0]}</p>}
                  {form.duration && !fieldErrors.duration && (
                    <p className="mt-2 ml-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">{form.duration}</p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Tagline
                  </label>
                  <span className={`text-[10px] font-bold ${form.tagline.length > 90 ? 'text-red-500' : 'text-slate-400'}`}>
                    {form.tagline.length} / 100
                  </span>
                </div>
                <input
                  maxLength={100}
                  className={`block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white ${fieldErrors.tagline ? 'border-red-300 bg-red-50/30' : ''}`}
                  placeholder="Where the sky meets turquoise infinity"
                  value={form.tagline}
                  onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                />
                {fieldErrors.tagline && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.tagline[0]}</p>}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
                    Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-medium text-slate-400">₹</span>
                    <input
                      type="number"
                      className={`block w-full rounded-xl border-slate-200 bg-slate-50 pl-8 pr-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white tabular-nums ${fieldErrors.price ? 'border-red-300 bg-red-50/30' : ''}`}
                      placeholder="32000"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: +e.target.value }))}
                    />
                  </div>
                  {fieldErrors.price && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.price[0]}</p>}
                </div>
                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 ${fieldErrors.badge ? 'text-red-500' : 'text-slate-500'}`}>
                    Badge Text
                  </label>
                  <input
                    className={`block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white ${fieldErrors.badge ? 'border-red-300 bg-red-50/30' : ''}`}
                    placeholder="⭐ Most Popular"
                    value={form.badge}
                    onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                  />
                  {fieldErrors.badge && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.badge[0]}</p>}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
                  Package Image
                </label>
                <ImageUpload
                  value={form.img}
                  onChange={url => setForm(f => ({ ...f, img: url }))}
                  onError={msg => setError(msg)}
                />
                {fieldErrors.img && <p className="mt-1 text-xs text-red-500 font-medium">{fieldErrors.img[0]}</p>}
              </div>

              <div>
                <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 ${fieldErrors.features ? 'text-red-500' : 'text-slate-500'}`}>
                  Highlights / Features (one per line)
                </label>
                <textarea
                  className={`block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white resize-none ${fieldErrors.features ? 'border-red-300 bg-red-50/30' : ''}`}
                  rows={3}
                  placeholder={`Leh to Pangong via Chang La\nSunrise at the lake\nNubra Valley Desert Safari`}
                  value={featStr}
                  onChange={e => setFeatStr(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
                  Itinerary (Format: Day | Title | Activities)
                </label>
                <textarea
                  className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white resize-none"
                  rows={6}
                  placeholder={`Day 1 | Arrival in Leh | Rest and acclimatization.\nDay 2 | Leh Sightseeing | Visit Shanti Stupa and Leh Palace.`}
                  value={itineraryStr}
                  onChange={e => setItineraryStr(e.target.value)}
                />
                <p className="mt-1 ml-1 text-[10px] text-slate-400">Use a pipe (|) to separate Day, Title, and optional Activities.</p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
                    Inclusions (one per line)
                  </label>
                  <textarea
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white resize-none"
                    rows={4}
                    placeholder={`Accommodation on twin sharing\nBreakfast and Dinner\nInner line permits`}
                    value={incStr}
                    onChange={e => setIncStr(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
                    Exclusions (one per line)
                  </label>
                  <textarea
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white resize-none"
                    rows={4}
                    placeholder={`Flight tickets\nLunch and snacks\nPersonal travel insurance`}
                    value={excStr}
                    onChange={e => setExcStr(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.badgeGold}
                      onChange={e => setForm(f => ({ ...f, badgeGold: e.target.checked }))}
                    />
                    <div className="h-5 w-5 rounded-md border-2 border-slate-200 transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 group-hover:border-blue-400"></div>
                    <Check size={14} className="absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Gold Badge</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.featured}
                      onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    />
                    <div className="h-5 w-5 rounded-md border-2 border-slate-200 transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600 group-hover:border-blue-400"></div>
                    <Check size={14} className="absolute inset-0 m-auto text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600 transition-colors">Featured Package</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
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
                className="flex items-center justify-center gap-2 min-w-[120px] rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-70 active:scale-[0.98]"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : (editing ? "Save Changes" : "Create Package")}
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
          closeModal();
        }}
        title="Unsaved Changes"
        message="You have unsaved changes. Are you sure you want to close? Your progress will be lost."
        confirmText="Close Anyway"
        cancelText="Stay"
      />
    </AdminShell>
  );
}
