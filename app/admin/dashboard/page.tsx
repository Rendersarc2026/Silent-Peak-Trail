"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";
import {
  Package,
  MessageSquare,
  Image as ImageIcon,
  MapPin,
  Star,
  Settings,
  Globe,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  HomeIcon,
  Loader2
} from "lucide-react";


interface Stats {
  packages: number;
  enquiries: number;
  newEnquiries: number;
  gallery: number;
  destinations: number;
  testimonials: number;
  confirmed: number;
  replied: number;
}

interface RecentEnquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  package: string;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: "New", bg: "bg-blue-50", text: "text-blue-700" },
  replied: { label: "Replied", bg: "bg-yellow-50", text: "text-yellow-700" },
  confirmed: { label: "Confirmed", bg: "bg-green-50", text: "text-green-700" },
  cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-700" },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(data => {
        if (data.error) return;
        setStats({
          packages: data.packages,
          enquiries: data.enquiries,
          newEnquiries: data.newEnquiries,
          gallery: data.gallery,
          destinations: data.destinations,
          testimonials: data.testimonials,
          confirmed: data.confirmed,
          replied: data.replied,
        });
        const mappedRecent = (data.recent || []).map((e: any) => ({
          ...e,
          id: e._id
        }));
        setRecent(mappedRecent);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell title="Dashboard">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-4 sm:p-6 shadow-sm ring-1 ring-blue-50/50">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-1.5 sm:p-2.5 text-blue-600">
              <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <TrendingUp size={12} className="text-blue-500 sm:block hidden" />
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-[11px] sm:text-sm font-medium text-slate-500 uppercase tracking-wider sm:normal-case sm:tracking-normal">New Enquiries</h3>
            <div className="mt-0.5 sm:mt-1">
              {loading ? <div className="h-7 w-10 sm:h-9 sm:w-12 bg-slate-200 rounded-md animate-pulse"></div> : <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats?.newEnquiries ?? "0"}</p>}
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-[12px] sm:text-xs text-slate-500">
            <span className="font-medium text-blue-600">Awaiting reply</span>
          </div>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-4 sm:p-6 shadow-sm ring-1 ring-green-50/50">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-green-50 p-1.5 sm:p-2.5 text-green-600">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
            <TrendingUp size={12} className="text-green-500 sm:block hidden" />
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-[11px] sm:text-sm font-medium text-slate-500 uppercase tracking-wider sm:normal-case sm:tracking-normal">Confirmed</h3>
            <div className="mt-0.5 sm:mt-1">
              {loading ? <div className="h-7 w-10 sm:h-9 sm:w-12 bg-slate-200 rounded-md animate-pulse"></div> : <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats?.confirmed ?? "0"}</p>}
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-[12px] sm:text-xs text-slate-500">
            <span className="font-medium text-green-600">Total bookings</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-slate-50 p-1.5 sm:p-2.5 text-slate-600">
              <Package className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-[11px] sm:text-sm font-medium text-slate-500 uppercase tracking-wider sm:normal-case sm:tracking-normal">Packages</h3>
            <div className="mt-0.5 sm:mt-1">
              {loading ? <div className="h-7 w-10 sm:h-9 sm:w-12 bg-slate-200 rounded-md animate-pulse"></div> : <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats?.packages ?? "0"}</p>}
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-[12px] sm:text-xs text-slate-500">
            <span className="font-medium text-slate-600">Active tours</span>
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-100 bg-white p-4 sm:p-6 shadow-sm ring-1 ring-yellow-50/50">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-yellow-50 p-1.5 sm:p-2.5 text-yellow-600">
              <MessageSquare className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-[11px] sm:text-sm font-medium text-slate-500 uppercase tracking-wider sm:normal-case sm:tracking-normal">Enquiries</h3>
            <div className="mt-0.5 sm:mt-1">
              {loading ? <div className="h-7 w-10 sm:h-9 sm:w-12 bg-slate-200 rounded-md animate-pulse"></div> : <p className="text-xl sm:text-3xl font-bold text-slate-900">{stats?.enquiries ?? "0"}</p>}
            </div>
          </div>
          <div className="mt-3 sm:mt-4 flex items-center text-[12px] sm:text-xs text-slate-500">
            <span className="font-medium text-yellow-600">{stats?.replied ?? 0} Replied</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {/* Recent Enquiries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs font-semibold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="overflow-hidden rounded-2xl border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50/50 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-3 sm:px-6 py-3 sm:py-4">Sender</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Package</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4">Status</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600">
                  {loading ? (
                    <tr>
                      <td colSpan={4}>
                        <div className="flex h-[300px] flex-col items-center justify-center text-center">
                          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4 opacity-80" />
                          <p className="text-sm font-medium text-slate-500 animate-pulse">Loading dashboard data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : recent.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                        No enquiries yet
                      </td>
                    </tr>
                  ) : (
                    recent.map((e) => {
                      const status = STATUS_CONFIG[e.status] || STATUS_CONFIG.new;
                      return (
                        <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <div className="font-semibold text-slate-900 line-clamp-1">{e.firstName} {e.lastName}</div>
                            <div className="text-xs text-slate-400 line-clamp-1">{e.email}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 truncate max-w-[150px] hidden md:table-cell">{e.package}</td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4">
                            <span className={`inline-flex rounded-full px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-xs font-semibold ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs text-slate-400 hidden sm:table-cell">
                            {new Date(e.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
