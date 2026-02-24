"use client";
import { useEffect, useState } from "react";
import { useAction } from "@/lib/hooks/useAction";
import AdminShell from "@/components/admin/AdminShell";
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
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import EmailComposer from "@/components/admin/EmailComposer";

interface Enquiry {
  id: number; firstName: string; lastName: string; email: string; phone: string;
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

import Skeleton from "@/components/admin/Skeleton";

export default function EnquiriesPage() {
  const [all, setAll] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<Enquiry | null>(null);
  const [toast, setToast] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({ isOpen: false, id: null });
  const [deleting, setDeleting] = useState(false);
  const [composingEmail, setComposingEmail] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    return fetch("/api/enquiries")
      .then(r => r.json())
      .then(setAll)
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const shown = filter === "all" ? all : all.filter(e => e.status === filter);

  const [handleStatusUpdate, { loading: updatingStatus }] = useAction(async ({ id, status }: { id: number, status: string }) => {
    await fetch(`/api/enquiries/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    await load();
    showToast("Status updated!");
    if (detail?.id === id) setDetail(d => d ? { ...d, status } : d);
  });

  async function del(id: number) {
    setDeleting(true);
    try {
      await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      await load();
      setDetail(null);
      showToast("Enquiry deleted successfully!");
    } finally {
      setDeleting(false);
      setDeleteModal({ isOpen: false, id: null });
    }
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  const counts: Record<string, number> = {};
  STATUSES.forEach(s => { counts[s] = s === "all" ? all.length : all.filter(e => e.status === s).length; });

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
      <div className="mb-6 flex flex-col gap-4">
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${filter === s
                ? "bg-slate-900 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
            >
              <span className="capitalize">{s}</span>
              {counts[s] > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-[10px] ${filter === s ? "bg-slate-700 text-slate-200" : "bg-slate-100 text-slate-500"}`}>
                  {counts[s]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700 border border-green-100 shadow-sm">
          <CheckCircle2 size={18} className="text-green-600" />
          {toast}
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Table List */}
        <div className={`flex-1 overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100 transition-all ${detail ? "lg:flex-[1.5]" : ""}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Sender</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Month & Package</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                  {!detail && <th className="px-3 sm:px-6 py-3 sm:py-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y text-slate-600">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-40" />
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-32" />
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <Skeleton className="h-6 w-28 rounded-lg" />
                      </td>
                      {!detail && (
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <div className="flex justify-center">
                            <Skeleton className="h-8 w-8 rounded-lg" />
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : shown.length === 0 ? (
                  <tr>
                    <td colSpan={detail ? 3 : 4} className="px-6 py-12 text-center text-slate-400">
                      No enquiries found
                    </td>
                  </tr>
                ) : (
                  shown.map(e => (
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
