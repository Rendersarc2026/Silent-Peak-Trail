"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Image as ImageIcon,
  MapPin,
  Star,
  Settings as SettingsIcon,
  LogOut,
  Globe,
  Menu,
  X,
  Home,
  UserCircle,
  PhoneCall,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info
} from "lucide-react";
import { cn, hasError, getErrorMessage } from "@/lib/utils";
import { agencyProfileSchema } from "@/lib/validation";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/packages", icon: Package, label: "Packages" },
  { href: "/admin/enquiries", icon: MessageSquare, label: "Enquiries" },
  { href: "/admin/gallery", icon: ImageIcon, label: "Gallery" },
  { href: "/admin/destinations", icon: MapPin, label: "Destinations" },
  { href: "/admin/testimonials", icon: Star, label: "Testimonials" },
  { href: "/admin/leh-tips", icon: Info, label: "Leh Tips" },
  { href: "/admin/homepage", icon: Home, label: "Homepage" },
];

export default function AdminShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsForm, setSettingsForm] = useState<Record<string, string> | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchSettings() {
    try {
      setSettingsError("");
      setSettingsSuccess("");
      setFieldErrors({});
      const res = await fetch("/api/agency");
      const data = await res.json();
      setSettingsForm(data);
    } catch (e) {
      console.error(e);
      setSettingsError("Could not load agency profile.");
    }
  }

  async function saveSettings() {
    if (!settingsForm) return;
    setSavingSettings(true);
    setSettingsError("");
    setSettingsSuccess("");
    setFieldErrors({});

    // Client-side validation
    const result = agencyProfileSchema.safeParse(settingsForm);
    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors as any);
      setSettingsError("Please fill all required fields.");
      setSavingSettings(false);
      return;
    }

    try {
      const res = await fetch("/api/agency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm)
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
          setSettingsError("Please fill all required fields.");
        } else {
          setSettingsError(data.error || "Failed to save.");
        }
      } else {
        setSettingsSuccess("Agency profile updated successfully!");
        setFieldErrors({});
        setTimeout(() => setProfileModalOpen(false), 1500);
      }
    } catch (err) {
      setSettingsError("Network error. Please try again.");
    } finally {
      setSavingSettings(false);
    }
  }

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.json())
      .then(d => {
        if (!d.authenticated) router.replace("/admin/login");
        else setUser(d.user);
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  // Close sidebar on route change (mobile nav)
  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [sidebarOpen]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const SidebarContent = (
    <>
      {/* Brand */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <img src="/logo.jpg" alt="Logo" className="h-8 w-8 rounded-full object-cover shrink-0" />
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white truncate">Silent Peak Trail</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
        {/* Close button — only on mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
          aria-label="Close menu"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto space-y-0.5 px-3 py-4">
        {NAV.map((n) => {
          const Icon = n.icon;
          const isActive = pathname === n.href;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300"
                  }`}
              />
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / user */}
      <div className="border-t border-slate-800 p-3 shrink-0">
        <div className="flex items-center justify-between rounded-lg bg-slate-800/50 px-3 py-2.5">
          <div className="min-w-0 px-1">
            <p className="text-[10px] text-slate-500">Logged in as</p>
            <p className="truncate text-sm font-semibold text-white">{user || "admin"}</p>
          </div>
          <button
            onClick={logout}
            className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Desktop sidebar (always visible ≥ lg) ── */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:flex-col bg-slate-900 text-slate-300">
        {SidebarContent}
      </aside>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-slate-900 text-slate-300 shadow-2xl animate-in slide-in-from-left duration-200">
            {SidebarContent}
          </div>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-14 sm:h-16 items-center justify-between border-b bg-white px-4 sm:px-6 xl:px-8 gap-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — only on mobile/tablet */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors shrink-0"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-base sm:text-lg font-semibold text-slate-800 truncate">{title}</h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 sm:gap-2 rounded-lg border border-slate-200 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">View Site</span>
            </a>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                aria-label="User profile"
              >
                <UserCircle size={20} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 mb-1">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-0.5">Logged in as</p>
                    <p className="text-sm font-semibold text-slate-900 truncate">{user || "admin"}</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); setProfileModalOpen(true); fetchSettings(); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left"
                  >
                    <SettingsIcon size={16} /> Agency Profile
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); logout(); }}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors text-left"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
          <div className="mx-auto w-full max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>

      {/* Agency Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4 animate-in fade-in duration-200">
          <div
            className="relative w-full sm:max-w-lg max-h-[95dvh] sm:max-h-[90vh] flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-slate-100 p-1.5 text-slate-600">
                  <PhoneCall size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Agency Profile</h3>
              </div>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {!settingsForm ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={24} className="animate-spin text-blue-500" />
                  <p className="text-sm font-medium text-slate-400">Loading profile data...</p>
                </div>
              ) : (
                <>
                  {settingsError && (
                    <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100">
                      <AlertCircle size={18} className="text-red-600 flex-shrink-0" />
                      {settingsError}
                    </div>
                  )}
                  {settingsSuccess && (
                    <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700 border border-green-100">
                      <CheckCircle2 size={18} className="text-green-600 flex-shrink-0" />
                      {settingsSuccess}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Phone / WhatsApp</label>
                      <input
                        className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'phone') && 'border-red-300 ring-2 ring-red-500/10')}
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      />
                      {hasError(fieldErrors, 'phone') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'phone')}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Email Address</label>
                      <input
                        className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'email') && 'border-red-300 ring-2 ring-red-500/10')}
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      />
                      {hasError(fieldErrors, 'email') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'email')}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Office Address</label>
                      <input
                        className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'address') && 'border-red-300 ring-2 ring-red-500/10')}
                        value={settingsForm.address}
                        onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      />
                      {hasError(fieldErrors, 'address') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'address')}</p>}
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Best Season Text</label>
                      <input
                        className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'season') && 'border-red-300 ring-2 ring-red-500/10')}
                        value={settingsForm.season}
                        onChange={(e) => setSettingsForm({ ...settingsForm, season: e.target.value })}
                      />
                      {hasError(fieldErrors, 'season') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'season')}</p>}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 border-t bg-slate-50/50 px-6 py-4">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                disabled={savingSettings || !settingsForm}
                className="flex items-center justify-center gap-2 min-w-[120px] rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-sm disabled:opacity-70 active:scale-[0.98]"
              >
                {savingSettings ? <Loader2 size={18} className="animate-spin" /> : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
