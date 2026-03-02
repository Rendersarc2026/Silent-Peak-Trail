"use client";
import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import {
  Save,
  Settings as SettingsIcon,
  Layout,
  BarChart3,
  PhoneCall,
  Eye,
  CheckCircle2,
  Loader2,
  Globe,
  MapPin,
  Mail,
  Zap,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { sanitizeInput, hasError, getErrorMessage, cn } from "@/lib/utils";
import { homepageContentSchema } from "@/lib/validation";
import ImageUpload from "@/components/admin/ImageUpload";

interface HomepageContent {
  heroBgImage?: string; heroTitle: string; heroSubtitle: string; heroBadge: string;
  statsAltitude: string; statsPackages: string; statsTravellers: string;
  statsExperience: string; statsSatisfaction: string;
  // Why Us Section
  whyUsTitle: string; whyUsSubtitle: string; whyUsImage: string;
  whyUsStatsValue: string; whyUsStatsLabel: string; whyUsFeatures: string;
  // Stargazing overrides
  stargazingTitle: string; stargazingTagline: string;
  // Fallbacks for the preview section
  phone?: string; email?: string; address?: string; season?: string;
}

export default function HomepagePage() {
  const [form, setForm] = useState<HomepageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  useEffect(() => { fetch("/api/homepage").then(r => r.json()).then(setForm); }, []);

  function set(key: keyof HomepageContent, val: string) {
    setForm(f => f ? { ...f, [key]: val } : f);
  }

  // Feature editing helper
  function updateFeature(index: number, field: string, value: string) {
    if (!form) return;
    try {
      const features = JSON.parse(form.whyUsFeatures || "[]");
      features[index] = { ...features[index], [field]: value };
      set("whyUsFeatures", JSON.stringify(features));
    } catch (e) {
      console.error("Failed to update feature", e);
    }
  }

  async function save() {
    if (!form) return;

    const result = homepageContentSchema.safeParse(form);
    if (!result.success) {
      const flattenedErrors: Record<string, string[]> = {};
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.');
        if (!flattenedErrors[path]) flattenedErrors[path] = [];
        flattenedErrors[path].push(issue.message);
      });
      setFieldErrors(flattenedErrors);
      setError("Please fill all required fields.");
      return;
    }

    setSaving(true);
    setError("");
    setFieldErrors({});
    try {
      const res = await fetch("/api/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          setFieldErrors(data.details);
          setError("Please fill all required fields.");
        } else {
          setError(data.error || "Failed to save homepage content.");
        }
        setSaving(false);
        return;
      }

      setSaving(false);
      showToast("Homepage content saved! Changes are now live on the site.");
    } catch (err) {
      setError("Network error. Please try again.");
      setSaving(false);
    }
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 4000); }

  if (!form) return (
    <AdminShell title="Homepage">
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 size={32} className="animate-spin text-blue-500" />
        <p className="text-sm font-medium">Fetching site configurations...</p>
      </div>
    </AdminShell>
  );

  const featuresList = JSON.parse(form.whyUsFeatures || "[]");

  return (
    <AdminShell title="Homepage Content">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-slate-500">Configure global website content for the landing page</h2>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 disabled:opacity-70 active:scale-[0.98]"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      {toast && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-sm font-medium text-green-700 border border-green-100 shadow-sm">
          <CheckCircle2 size={18} className="text-green-600" />
          {toast}
        </div>
      )}

      {error && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-2 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-100 shadow-sm">
          <AlertCircle size={18} className="text-red-600" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Hero Section */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3 border-b bg-slate-50/50 px-6 py-4">
              <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
                <Layout size={18} />
              </div>
              <h3 className="font-bold text-slate-900">Hero Section</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">
                  Hero Background Image
                </label>
                <ImageUpload
                  value={form.heroBgImage || ""}
                  onChange={url => set("heroBgImage", url)}
                  onError={msg => setError(msg)}
                />
                {hasError(fieldErrors, 'heroBgImage') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'heroBgImage')}</p>}
                <p className="mt-1.5 text-[10px] text-slate-400 font-medium leading-relaxed">Leave blank to use the default majestic mountain landscape.</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Hero Badge</label>
                  <span className={`text-[10px] font-bold ${form.heroBadge.length >= 50 ? 'text-red-500' : 'text-slate-400'}`}>
                    {form.heroBadge.length} / 50
                  </span>
                </div>
                <input
                  maxLength={50}
                  className={`block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white ${hasError(fieldErrors, 'heroBadge') ? 'border-red-300 bg-red-50/30' : ''}`}
                  value={form.heroBadge}
                  onChange={e => set("heroBadge", e.target.value)}
                />
                {hasError(fieldErrors, 'heroBadge') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'heroBadge')}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Main Heading</label>
                  <span className={`text-[10px] font-bold ${form.heroTitle.length > 70 ? 'text-red-500' : 'text-slate-400'}`}>
                    {form.heroTitle.length} / 80
                  </span>
                </div>
                <input
                  maxLength={80}
                  className={`block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white ${hasError(fieldErrors, 'heroTitle') ? 'border-red-300 bg-red-50/30' : ''}`}
                  value={form.heroTitle}
                  onChange={e => set("heroTitle", e.target.value)}
                />
                {hasError(fieldErrors, 'heroTitle') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'heroTitle')}</p>}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">Subtitle / Description</label>
                  <span className={`text-[10px] font-bold ${form.heroSubtitle.length > 250 ? 'text-red-500' : 'text-slate-400'}`}>
                    {form.heroSubtitle.length} / 300
                  </span>
                </div>
                <textarea
                  maxLength={300}
                  className={`block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white resize-none ${hasError(fieldErrors, 'heroSubtitle') ? 'border-red-300 bg-red-50/30' : ''}`}
                  rows={4}
                  value={form.heroSubtitle}
                  onChange={e => set("heroSubtitle", e.target.value)}
                />
                {hasError(fieldErrors, 'heroSubtitle') && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, 'heroSubtitle')}</p>}
              </div>
            </div>
          </section>

          {/* Stargazing Section */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3 border-b bg-slate-50/50 px-6 py-4">
              <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
                <Zap size={18} />
              </div>
              <h3 className="font-bold text-slate-900">Premium Stargazing Section</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Custom Heading</label>
                <input
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'stargazingTitle') && 'border-red-300 ring-2 ring-red-500/10')}
                  value={form.stargazingTitle}
                  onChange={e => set("stargazingTitle", e.target.value)}
                  placeholder="e.g. The Premium Stargazing Expedition"
                />
                {hasError(fieldErrors, 'stargazingTitle') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'stargazingTitle')}</p>}
                <p className="mt-1.5 text-[10px] text-slate-400 font-medium">Tip: Use the word &quot;Premium&quot; for special italic styling.</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Intro Description</label>
                <textarea
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white resize-none", hasError(fieldErrors, 'stargazingTagline') && 'border-red-300 ring-2 ring-red-500/10')}
                  rows={3}
                  value={form.stargazingTagline}
                  onChange={e => set("stargazingTagline", e.target.value)}
                />
                {hasError(fieldErrors, 'stargazingTagline') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'stargazingTagline')}</p>}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3 border-b bg-slate-50/50 px-6 py-4">
              <div className="rounded-lg bg-amber-50 p-1.5 text-amber-600">
                <BarChart3 size={18} />
              </div>
              <h3 className="font-bold text-slate-900">Performance Stats</h3>
            </div>
            <div className="p-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                ["Max Altitude", "statsAltitude"],
                ["Tour Packages", "statsPackages"],
                ["Happy Travellers", "statsTravellers"],
                ["Years Experience", "statsExperience"],
                ["Guest Satisfaction", "statsSatisfaction"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">{label}</label>
                  <input
                    className={`block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white tabular-nums ${hasError(fieldErrors, key) ? 'border-red-300 bg-red-50/30' : ''}`}
                    value={form[key as keyof HomepageContent]}
                    onChange={e => set(key as keyof HomepageContent, e.target.value)}
                  />
                  {hasError(fieldErrors, key) && <p className="mt-1 text-xs text-red-500 font-medium">{getErrorMessage(fieldErrors, key)}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Why Us Section */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3 border-b bg-slate-50/50 px-6 py-4">
              <div className="rounded-lg bg-red-50 p-1.5 text-red-600">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-bold text-slate-900">Why Us Section</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Section Title</label>
                <input
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white", hasError(fieldErrors, 'whyUsTitle') && 'border-red-300 ring-2 ring-red-500/10')}
                  value={form.whyUsTitle}
                  onChange={e => set("whyUsTitle", e.target.value)}
                />
                {hasError(fieldErrors, 'whyUsTitle') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'whyUsTitle')}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Section Subtitle</label>
                <textarea
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white resize-none", hasError(fieldErrors, 'whyUsSubtitle') && 'border-red-300 ring-2 ring-red-500/10')}
                  rows={3}
                  value={form.whyUsSubtitle}
                  onChange={e => set("whyUsSubtitle", e.target.value)}
                />
                {hasError(fieldErrors, 'whyUsSubtitle') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'whyUsSubtitle')}</p>}
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Showcase Image</label>
                <ImageUpload
                  value={form.whyUsImage || ""}
                  onChange={url => set("whyUsImage", url)}
                  onError={msg => setError(msg)}
                />
                {hasError(fieldErrors, 'whyUsImage') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'whyUsImage')}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Floating Stat Value</label>
                  <input
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white"
                    value={form.whyUsStatsValue}
                    onChange={e => set("whyUsStatsValue", e.target.value)}
                  />
                  {hasError(fieldErrors, 'whyUsStatsValue') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'whyUsStatsValue')}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Floating Stat Label</label>
                  <input
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white"
                    value={form.whyUsStatsLabel}
                    onChange={e => set("whyUsStatsLabel", e.target.value)}
                  />
                  {hasError(fieldErrors, 'whyUsStatsLabel') && <p className="mt-1 text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, 'whyUsStatsLabel')}</p>}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-4 ml-1">Core Features (4)</h4>
                <div className="space-y-6">
                  {featuresList.slice(0, 4).map((f: any, i: number) => (
                    <div key={i} className={`rounded-xl border bg-slate-50/50 p-4 space-y-3 transition-colors ${hasError(fieldErrors, `whyUsFeatures.${i}`) ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}>
                      <div className="flex gap-4">
                        <select
                          className="w-1/3 rounded-lg border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
                          value={f.icon}
                          onChange={(e) => updateFeature(i, 'icon', e.target.value)}
                        >
                          <option value="Compass">Compass</option>
                          <option value="ShieldCheck">Shield</option>
                          <option value="Leaf">Leaf</option>
                          <option value="Settings2">Settings</option>
                          <option value="Users">Users</option>
                        </select>
                        <input
                          className="w-2/3 rounded-lg border-slate-200 bg-white px-3 py-2 text-xs font-bold"
                          value={f.title}
                          onChange={(e) => updateFeature(i, 'title', e.target.value)}
                        />
                      </div>
                      {hasError(fieldErrors, `whyUsFeatures.${i}.title`) && <p className="text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, `whyUsFeatures.${i}.title`)}</p>}

                      <textarea
                        className={cn("w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-xs resize-none", hasError(fieldErrors, `whyUsFeatures.${i}.desc`) && 'border-red-300 ring-2 ring-red-500/10')}
                        rows={2}
                        value={f.desc}
                        onChange={(e) => updateFeature(i, 'desc', e.target.value)}
                      />
                      {hasError(fieldErrors, `whyUsFeatures.${i}.desc`) && <p className="text-[10px] font-bold text-red-500 ml-1">{getErrorMessage(fieldErrors, `whyUsFeatures.${i}.desc`)}</p>}
                    </div>
                  ))}
                  {featuresList.length === 0 && (
                    <button
                      onClick={() => set("whyUsFeatures", JSON.stringify([
                        { icon: "Compass", title: "Local Guides", desc: "Native experts", color: "text-[var(--blue)]", bg: "bg-blue-50" },
                        { icon: "ShieldCheck", title: "Safety First", desc: "Top protocols", color: "text-[var(--gold)]", bg: "bg-amber-50" },
                        { icon: "Leaf", title: "Eco Friendly", desc: "Sustainable tours", color: "text-green-600", bg: "bg-green-50" },
                        { icon: "Settings2", title: "Tailored", desc: "Fully custom", color: "text-indigo-600", bg: "bg-indigo-50" }
                      ]))}
                      className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:border-blue-200 hover:text-blue-500 transition-all"
                    >
                      Initialize Feature List
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Live Preview */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4">
              <div className="rounded-lg bg-indigo-50 p-1.5 text-indigo-600">
                <Eye size={18} />
              </div>
              <h3 className="font-bold text-slate-900">Live Component Preview</h3>
            </div>
            <div className="p-8">
              <div className="relative overflow-hidden rounded-[2rem] bg-[#052060] p-10 text-white shadow-2xl ring-1 ring-white/10">
                {form.heroBgImage && (
                  <img src={form.heroBgImage} alt="Hero Background" className="absolute inset-0 z-0 h-full w-full object-cover opacity-60 mix-blend-overlay" />
                )}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur-sm ring-1 ring-white/20 mb-6">
                    <Zap size={10} className="text-amber-400 fill-amber-400" />
                    {form.heroBadge}
                  </span>
                  <h1 className="mb-6 max-w-lg text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                    {form.heroTitle}
                  </h1>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-6 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                {form.phone && <div className="flex items-center gap-2"><PhoneCall size={12} /> {form.phone}</div>}
                {form.email && <div className="flex items-center gap-2"><Mail size={12} /> {form.email}</div>}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
