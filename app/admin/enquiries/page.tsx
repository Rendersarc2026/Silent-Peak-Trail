"use client";
import { useEffect, useState } from "react";
import { useAction } from "@/lib/hooks/useAction";
import AdminShell from "@/components/admin/AdminShell";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Mail,
  Phone,
  Trash2,
  X,
  ChevronRight,
  Calendar,
  Users,
  IndianRupee,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  SlidersHorizontal
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import EmailComposer from "@/components/admin/EmailComposer";
import SearchInput from "@/components/admin/SearchInput";

interface Enquiry {
  id: string; firstName: string; lastName: string; email: string; phone: string;
  package: string; travellers: string; month: string; budget: string;
  message: string; status: string; createdAt: string;
}

const STATUSES = ["all", "new", "replied", "confirmed", "cancelled"] as const;

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  new: { label: "New", bg: "bg-blue-50", text: "text-blue-700", icon: Clock },
  replied: { label: "Replied", bg: "bg-yellow-50", text: "text-yellow-700", icon: MessageSquare },
  confirmed: { label: "Confirmed", bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-700", icon: X },
};

const STATUS_FILTER_OPTIONS = ["new", "replied", "confirmed", "cancelled"];

import Pagination from "@/components/admin/Pagination";

interface FilterState {
  dateFrom: string;
  dateTo: string;
  package: string;
  statuses: string[];
}

const defaultFilters: FilterState = {
  dateFrom: "",
  dateTo: "",
  package: "",
  statuses: [],
};

export default function EnquiriesPage() {
  const [all, setAll] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [counts, setCounts] = useState<Record<string, number>>({});

  // Filter drawer state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterState>(defaultFilters);
  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters);

  const [detail, setDetail] = useState<Enquiry | null>(null);
  const [toast, setToast] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({ isOpen: false, id: null });
  const [deleting, setDeleting] = useState(false);
  const [composingEmail, setComposingEmail] = useState<string | null>(null);

  const activeFilterCount = [
    filterState.dateFrom || filterState.dateTo,
    filterState.package,
    filterState.statuses.length > 0,
  ].filter(Boolean).length;

  const load = (page = 1, s = search, f = filter, lim = rowsPerPage, fs = filterState) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      search: s,
      status: f,
      limit: lim.toString(),
      sortBy: 'createdAt',
      sortOrder: '-1'
    });
    if (fs.dateFrom) params.set('dateFrom', fs.dateFrom);
    if (fs.dateTo) params.set('dateTo', fs.dateTo);
    if (fs.package) params.set('packageFilter', fs.package);
    if (fs.statuses.length > 0) params.set('statuses', fs.statuses.join(','));

    return fetch(`/api/enquiries?${params}`)
      .then(r => r.json())
      .then(res => {
        const mappedData = (res.data || []).map((item: any) => ({
          ...item,
          id: item._id
        }));
        setAll(mappedData);
        setTotalPages(res.totalPages);
        setCurrentPage(res.currentPage);
        setCounts(res.counts);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      load(1, search, filter, rowsPerPage, filterState);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, filter, filterState]);

  const [handleStatusUpdate, { loading: updatingStatus }] = useAction(async ({ id, status }: { id: string, status: string }) => {
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    await load(currentPage);
    showToast("Status updated!");
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d);
  });

  async function del(id: string) {
    setDeleting(true);
    try {
      await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      await load(currentPage);
      setDetail(null);
      showToast("Enquiry deleted successfully!");
    } finally {
      setDeleting(false);
      setDeleteModal({ isOpen: false, id: null });
    }
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function applyFilters() {
    setFilterState(draftFilters);
    setCurrentPage(1);
    setFilterOpen(false);
  }

  function resetFilters() {
    setDraftFilters(defaultFilters);
    setFilterState(defaultFilters);
    setCurrentPage(1);
    setFilterOpen(false);
  }

  function openFilterDrawer() {
    setDraftFilters(filterState); // sync draft with applied
    setFilterOpen(true);
  }

  return (
    <AdminShell title="Enquiries">
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={() => deleteModal.id && del(deleteModal.id)}
        isDeleting={deleting}
        title="Delete Enquiry"
        message="Are you sure you want to permanently delete this enquiry? This action cannot be undone."
      />

      {/* Filter Drawer Overlay */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setFilterOpen(false)}
          />
          {/* Drawer */}
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
                  <SlidersHorizontal size={16} />
                </div>
                <h2 className="font-bold text-slate-900">Filter Enquiries</h2>
              </div>
              <button
                onClick={() => setFilterOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

              {/* Date Range */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={14} className="text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Date Range</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 ml-0.5">From</label>
                    <input
                      type="date"
                      value={draftFilters.dateFrom}
                      onChange={e => setDraftFilters(p => ({ ...p, dateFrom: e.target.value }))}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1.5 ml-0.5">To</label>
                    <input
                      type="date"
                      value={draftFilters.dateTo}
                      onChange={e => setDraftFilters(p => ({ ...p, dateTo: e.target.value }))}
                      className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Package */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ChevronRight size={14} className="text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Package</h3>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Nubra & Pangong..."
                  value={draftFilters.package}
                  onChange={e => setDraftFilters(p => ({ ...p, package: e.target.value }))}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 transition-all focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 size={14} className="text-slate-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Status</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {STATUS_FILTER_OPTIONS.map(s => {
                    const cfg = STATUS_CONFIG[s];
                    const active = draftFilters.statuses.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => setDraftFilters(p => ({
                          ...p,
                          statuses: active
                            ? p.statuses.filter(x => x !== s)
                            : [...p.statuses, s]
                        }))}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${active
                          ? `${cfg.bg} ${cfg.text} border-transparent ring-2 ring-current/20`
                          : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                      >
                        <cfg.icon size={13} />
                        <span className="capitalize">{s}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t bg-slate-50/50 p-4 flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors active:scale-[0.98]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => {
                setFilter(s);
                setCurrentPage(1);
              }}
              className={`inline-flex items-center gap-3 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all active:scale-95 ${filter === s
                ? "bg-[var(--navy)] text-white shadow-lg shadow-navy/20"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm"
                }`}
            >
              <span className="capitalize">{s}</span>
              {counts[s] > 0 && (
                <span className={`rounded-xl px-2 py-0.5 text-[10px] ${filter === s ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {counts[s]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search and Clear */}
        <div className="flex items-center gap-3">
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setCurrentPage(1);
            }}
            placeholder="Search enquiries..."
            loading={loading && !!search}
            className="w-full lg:w-96"
          />

          {(search || filter !== 'all') && (
            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
                setCurrentPage(1);
              }}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-xs font-bold text-slate-600 transition-all hover:bg-slate-200 active:scale-95"
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {toast && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-2xl bg-green-50 p-5 text-sm font-bold text-green-700 border border-green-100 shadow-sm">
          <CheckCircle2 size={18} className="text-green-600" />
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Table List */}
        <div className={`flex-1 overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100 transition-all ${detail ? "lg:flex-[1.5]" : ""}`}>

          {/* Table Toolbar */}
          <div className="flex items-center justify-between border-b bg-slate-50/50 px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enquiries</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                </span>
              )}
            </div>
            <button
              onClick={openFilterDrawer}
              className={`relative flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all hover:shadow-sm active:scale-95 ${activeFilterCount > 0
                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Sender</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">Date</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Month & Package</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                  {!detail && <th className="px-3 sm:px-6 py-3 sm:py-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y text-slate-600">
                {loading ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="flex h-[300px] flex-col items-center justify-center text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4 opacity-80" />
                        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading enquiries...</p>
                      </div>
                    </td>
                  </tr>
                ) : all.length === 0 ? (
                  <tr>
                    <td colSpan={detail ? 3 : 4} className="px-6 py-12 text-center text-slate-400">
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  all.map((e: Enquiry) => (
                    <tr
                      key={e.id}
                      onClick={() => setDetail(e)}
                      className={`cursor-pointer transition-colors hover:bg-slate-50/80 ${detail?.id === e.id ? "bg-blue-50/50" : ""}`}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="font-bold text-slate-900 line-clamp-1">{e.firstName} {e.lastName}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{e.email}</div>
                        <div className="text-[10px] text-slate-500 md:hidden mt-1 line-clamp-1 border-t border-slate-100 pt-1">
                          {e.month} · {e.package}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-700">{new Date(e.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[10px] text-slate-400">{new Date(e.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="font-medium text-slate-700 whitespace-nowrap">{e.month}</div>
                        <div className="text-xs text-slate-400 line-clamp-1">{e.package}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4" onClick={ev => ev.stopPropagation()}>
                        <div className="relative inline-block w-28 sm:w-32">
                          <select
                            value={e.status}
                            onChange={ev => handleStatusUpdate({ id: e.id, status: ev.target.value })}
                            disabled={updatingStatus}
                            className={`block w-full appearance-none rounded-lg border-0 px-2 sm:px-3 py-1.5 pr-6 sm:pr-8 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all focus:ring-2 focus:ring-blue-500/20 ${STATUS_CONFIG[e.status]?.bg} ${STATUS_CONFIG[e.status]?.text} ${updatingStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {["new", "replied", "confirmed", "cancelled"].map(s => (
                              <option key={s} value={s} className="bg-white text-slate-900">{s.toUpperCase()}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      {!detail && (
                        <td className="px-3 sm:px-6 py-3 sm:py-4" onClick={ev => ev.stopPropagation()}>
                          <div className="flex justify-center">
                            <button
                              onClick={(ev) => {
                                ev.stopPropagation();
                                setDeleteModal({ isOpen: true, id: e.id });
                              }}
                              className="rounded-lg p-1.5 sm:p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && all.length > 0 && (
            <div className="border-t bg-slate-50/30">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(val) => {
                  setRowsPerPage(val);
                  setCurrentPage(1);
                  load(1, search, filter, val);
                }}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  load(page, search, filter, rowsPerPage);
                }}
              />
            </div>
          )}
        </div>

        {/* Detail Side Panel */}
        {detail && (
          <div className="sticky top-24 w-full shrink-0 overflow-hidden rounded-2xl border bg-white shadow-lg ring-1 ring-slate-100 animate-in slide-in-from-right-4 duration-300 lg:w-96">
            <div className="flex items-center justify-between border-b bg-slate-50/50 px-6 py-4">
              <h3 className="font-bold text-slate-900">Enquiry Detail</h3>
              <button
                onClick={() => setDetail(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`rounded-xl p-2.5 ${STATUS_CONFIG[detail.status]?.bg} ${STATUS_CONFIG[detail.status]?.text}`}>
                  {(() => {
                    const Icon = STATUS_CONFIG[detail.status]?.icon || AlertCircle;
                    return <Icon size={20} />;
                  })()}
                </div>
                <div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${STATUS_CONFIG[detail.status]?.text}`}>
                    Status: {detail.status}
                  </div>
                  <div className="text-xs text-slate-400">{new Date(detail.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {[
                  { label: "Full Name", value: `${detail.firstName} ${detail.lastName}`, icon: Users },
                  { label: "Email Address", value: detail.email, icon: Mail, type: 'email' },
                  { label: "Phone & WhatsApp", value: detail.phone, icon: Phone, type: 'tel' },
                  { label: "Selected Package", value: detail.package, icon: ChevronRight },
                  { label: "Travel Month", value: detail.month, icon: Calendar },
                  { label: "Estimated Budget", value: detail.budget, icon: IndianRupee },
                  { label: "No. of Travellers", value: detail.travellers, icon: Users },
                ].map((item, i) => (
                  <div key={i} className="py-4 first:pt-0 last:pb-0">
                    <label className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <item.icon size={12} /> {item.label}
                    </label>
                    <div className="text-sm font-semibold text-slate-700">
                      {item.type ? (
                        <a href={`${item.type}:${item.value}`} className="text-blue-600 hover:underline">
                          {item.value}
                        </a>
                      ) : item.value}
                    </div>
                  </div>
                ))}
              </div>

              {detail.message && (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                  <label className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Message from Client</label>
                  <p className="text-sm leading-relaxed text-slate-600 italic">"{detail.message}"</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => setComposingEmail(detail.email)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                  <Mail size={14} /> Send Email
                </button>
                <button
                  onClick={() => setDeleteModal({ isOpen: true, id: detail.id })}
                  className="flex items-center justify-center gap-2 rounded-xl bg-white border border-red-100 py-2.5 text-xs font-bold text-red-600 transition-all hover:bg-red-50 active:scale-95"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {composingEmail && (
        <EmailComposer
          to={composingEmail}
          onClose={() => setComposingEmail(null)}
          onSuccess={() => {
            showToast("Email sent successfully!");
            if (detail) handleStatusUpdate({ id: detail.id, status: "replied" });
          }}
        />
      )}
    </AdminShell>
  );
}
