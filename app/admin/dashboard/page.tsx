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
  HomeIcon
} from "lucide-react";
import Skeleton from "@/components/admin/Skeleton";

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
        setRecent(data.recent);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminShell title="Dashboard">
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm ring-1 ring-blue-50/50">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
              <Clock size={20} />
            </div>
            <TrendingUp size={16} className="text-blue-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-500">New Enquiries</h3>
            <div className="mt-1">
              {loading ? <Skeleton className="h-9 w-12" /> : <p className="text-3xl font-bold text-slate-900">{stats?.newEnquiries ?? "0"}</p>}
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span className="font-medium text-blue-600">Awaiting reply</span>
          </div>
        </div>

        <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm ring-1 ring-green-50/50">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-green-50 p-2.5 text-green-600">
              <CheckCircle2 size={20} />
            </div>
            <TrendingUp size={16} className="text-green-500" />
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-500">Confirmed Bookings</h3>
            <div className="mt-1">
              {loading ? <Skeleton className="h-9 w-12" /> : <p className="text-3xl font-bold text-slate-900">{stats?.confirmed ?? "0"}</p>}
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span className="font-medium text-green-600">Total confirmed</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-slate-50 p-2.5 text-slate-600">
              <Package size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-500">Tour Packages</h3>
            <div className="mt-1">
              {loading ? <Skeleton className="h-9 w-12" /> : <p className="text-3xl font-bold text-slate-900">{stats?.packages ?? "0"}</p>}
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span className="font-medium text-slate-600">Active packages</span>
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-100 bg-white p-6 shadow-sm ring-1 ring-yellow-50/50">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-yellow-50 p-2.5 text-yellow-600">
              <MessageSquare size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-slate-500">Total Enquiries</h3>
            <div className="mt-1">
              {loading ? <Skeleton className="h-9 w-12" /> : <p className="text-3xl font-bold text-slate-900">{stats?.enquiries ?? "0"}</p>}
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <span className="font-medium text-yellow-600">{stats?.replied ?? 0} replied</span>
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
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-40" />
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                          <Skeleton className="h-4 w-24" />
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </td>
                        <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                          <Skeleton className="h-4 w-12" />
                        </td>
                      </tr>
                    ))
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
