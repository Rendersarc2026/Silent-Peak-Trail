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
  ShieldCheck,
  Instagram,
  Facebook,
  MessageCircle,
  Type,
  Info,
  Plus,
  Trash2,
  ExternalLink,
  Twitter,
  Youtube
} from "lucide-react";
import { sanitizeInput, hasError, getErrorMessage, cn, validateWithYup } from "@/lib/utils";
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
  stargazingTitle: string; stargazingTagline: string; stargazingHighlights: string;
  // Contact & Social
  socialLinks: string;
  phone?: string; email?: string; address?: string; season?: string;
  whatsappNumber?: string;
  footerDescription?: string;
  // AMS Warning
  amsWarningTitle?: string; amsWarningDesc?: string;
  // CTA
  bookButtonText?: string;
}

export default function HomepagePage() {
  const [form, setForm] = useState<HomepageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const ErrorMsg = ({ field }: { field: string }) => {
    const msg = getErrorMessage(fieldErrors, field);
    if (!msg) return null;
    return <p className="mt-1 text-[10px] font-bold text-red-500 ml-1 animate-in fade-in slide-in-from-top-1">{msg}</p>;
  };

  useEffect(() => {
    fetch("/api/homepage")
      .then(r => r.json())
      .then(data => {
        // Ensure all fields have at least an empty string default to avoid TypeErrors
        setForm({
          heroBgImage: data.heroBgImage || "",
          heroTitle: data.heroTitle || "",
          heroSubtitle: data.heroSubtitle || "",
          heroBadge: data.heroBadge || "",
          statsAltitude: data.statsAltitude || "",
          statsPackages: data.statsPackages || "",
          statsTravellers: data.statsTravellers || "",
          statsExperience: data.statsExperience || "",
          statsSatisfaction: data.statsSatisfaction || "",
          whyUsTitle: data.whyUsTitle || "",
          whyUsSubtitle: data.whyUsSubtitle || "",
          whyUsImage: data.whyUsImage || "",
          whyUsStatsValue: data.whyUsStatsValue || "",
          whyUsStatsLabel: data.whyUsStatsLabel || "",
          whyUsFeatures: data.whyUsFeatures || "[]",
          stargazingTitle: data.stargazingTitle || "",
          stargazingTagline: data.stargazingTagline || "",
          stargazingHighlights: data.stargazingHighlights || "[]",
          socialLinks: data.socialLinks || "[]",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          season: data.season || "",
          whatsappNumber: data.whatsappNumber || "",
          footerDescription: data.footerDescription || "",
          amsWarningTitle: data.amsWarningTitle || "",
          amsWarningDesc: data.amsWarningDesc || "",
          bookButtonText: data.bookButtonText || "",
        });
      });
  }, []);

  function set(key: keyof HomepageContent, val: string) {
    setForm(f => f ? { ...f, [key]: val } : f);
    if (fieldErrors[key]) {
      setFieldErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
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

  function updateHighlight(index: number, field: string, value: string) {
    if (!form) return;
    try {
      const highlights = JSON.parse(form.stargazingHighlights || "[]");
      highlights[index] = { ...highlights[index], [field]: value };
      set("stargazingHighlights", JSON.stringify(highlights));
    } catch (e) {
      console.error("Failed to update highlight", e);
    }
  }

  function addHighlight() {
    if (!form) return;
    const highlights = JSON.parse(form.stargazingHighlights || "[]");
    highlights.push({ icon: "Sparkles", title: "", desc: "" });
    set("stargazingHighlights", JSON.stringify(highlights));
  }

  function removeHighlight(index: number) {
    if (!form) return;
    const highlights = JSON.parse(form.stargazingHighlights || "[]");
    highlights.splice(index, 1);
    set("stargazingHighlights", JSON.stringify(highlights));
  }

  // Social Links management
  function updateSocialLink(index: number, field: string, value: string) {
    if (!form) return;
    try {
      const links = JSON.parse(form.socialLinks || "[]");
      links[index] = { ...links[index], [field]: value };
      set("socialLinks", JSON.stringify(links));
    } catch (e) {
      console.error("Failed to update social link", e);
    }
  }

  function addSocialLink() {
    if (!form) return;
    const links = JSON.parse(form.socialLinks || "[]");
    links.push({ platform: "Instagram", url: "" });
    set("socialLinks", JSON.stringify(links));
  }

  function removeSocialLink(index: number) {
    if (!form) return;
    const links = JSON.parse(form.socialLinks || "[]");
    links.splice(index, 1);
    set("socialLinks", JSON.stringify(links));
  }

  async function save() {
    if (!form) return;

    const { success, error: validationError } = await validateWithYup(homepageContentSchema, form);
    if (!success) {
      setFieldErrors(validationError?.fieldErrors as any);
      setError("Validation failed. Please check the highlighted fields below.");
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
          setError("Validation failed. Please check the highlighted fields below.");
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
                <ErrorMsg field="heroBgImage" />
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
                <ErrorMsg field="heroBadge" />
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
                <ErrorMsg field="heroTitle" />
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
                <ErrorMsg field="heroSubtitle" />
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
                <ErrorMsg field="stargazingTitle" />
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
                <ErrorMsg field="stargazingTagline" />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4 ml-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Highlights (Max 3)</h4>
                  <button
                    onClick={addHighlight}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    <Plus size={12} /> Add Highlight
                  </button>
                </div>
                <div className="space-y-6">
                  {(() => {
                    try {
                      const highlights = JSON.parse(form.stargazingHighlights || "[]");
                      if (highlights.length === 0) {
                        return (
                          <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">No highlights added yet</p>
                          </div>
                        );
                      }
                      return highlights.map((h: any, i: number) => (
                        <div key={i} className={cn("relative rounded-xl border p-4 space-y-3", hasError(fieldErrors, `stargazingHighlights.${i}`) ? 'border-red-300 bg-red-50/30' : 'border-slate-100 bg-slate-50/50')}>
                          <button
                            onClick={() => removeHighlight(i)}
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white border border-slate-200 text-red-500 flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                          <div className="flex gap-4">
                            <select
                              className="w-1/3 rounded-lg border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
                              value={h.icon}
                              onChange={(e) => updateHighlight(i, 'icon', e.target.value)}
                            >
                              <option value="Sparkles">Sparkles</option>
                              <option value="Clock">Clock</option>
                              <option value="CheckCircle2">Check</option>
                              <option value="Zap">Zap</option>
                            </select>
                            <input
                              className={cn("w-2/3 rounded-lg border-slate-200 bg-white px-3 py-2 text-xs font-bold", hasError(fieldErrors, `stargazingHighlights.${i}.title`) && 'border-red-300')}
                              value={h.title}
                              placeholder="Title"
                              onChange={(e) => updateHighlight(i, 'title', e.target.value)}
                            />
                          </div>
                          <textarea
                            className={cn("w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-xs resize-none", hasError(fieldErrors, `stargazingHighlights.${i}.desc`) && 'border-red-300')}
                            rows={2}
                            placeholder="Description"
                            value={h.desc}
                            onChange={(e) => updateHighlight(i, 'desc', e.target.value)}
                          />
                        </div>
                      ));
                    } catch { return null; }
                  })()}
                </div>
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
                  <ErrorMsg field={key} />
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
                <ErrorMsg field="whyUsTitle" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Section Subtitle</label>
                <textarea
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white resize-none", hasError(fieldErrors, 'whyUsSubtitle') && 'border-red-300 ring-2 ring-red-500/10')}
                  rows={3}
                  value={form.whyUsSubtitle}
                  onChange={e => set("whyUsSubtitle", e.target.value)}
                />
                <ErrorMsg field="whyUsSubtitle" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Showcase Image</label>
                <ImageUpload
                  value={form.whyUsImage || ""}
                  onChange={url => set("whyUsImage", url)}
                  onError={msg => setError(msg)}
                />
                <ErrorMsg field="whyUsImage" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Floating Stat Value</label>
                  <input
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white"
                    value={form.whyUsStatsValue}
                    onChange={e => set("whyUsStatsValue", e.target.value)}
                  />
                  <ErrorMsg field="whyUsStatsValue" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Floating Stat Label</label>
                  <input
                    className="block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium transition-all focus:border-blue-500 focus:ring-blue-500/10 focus:bg-white"
                    value={form.whyUsStatsLabel}
                    onChange={e => set("whyUsStatsLabel", e.target.value)}
                  />
                  <ErrorMsg field="whyUsStatsLabel" />
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
                      <ErrorMsg field={`whyUsFeatures.${i}.title`} />

                      <textarea
                        className={cn("w-full rounded-lg border-slate-200 bg-white px-3 py-2 text-xs resize-none", hasError(fieldErrors, `whyUsFeatures.${i}.desc`) && 'border-red-300 ring-2 ring-red-500/10')}
                        rows={2}
                        value={f.desc}
                        onChange={(e) => updateFeature(i, 'desc', e.target.value)}
                      />
                      <ErrorMsg field={`whyUsFeatures.${i}.desc`} />
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

          {/* Contact & Social Section */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3 border-b bg-slate-50/50 px-6 py-4">
              <div className="rounded-lg bg-blue-50 p-1.5 text-blue-600">
                <Globe size={18} />
              </div>
              <h3 className="font-bold text-slate-900">Contact & Social Media</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 ml-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Social Media Links</label>
                  <button
                    onClick={addSocialLink}
                    className="flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-700"
                  >
                    <Plus size={12} /> Add New Link
                  </button>
                </div>

                <div className="space-y-4">
                  {(() => {
                    try {
                      const links = JSON.parse(form.socialLinks || "[]");
                      if (links.length === 0) {
                        return (
                          <div className="text-center py-8 border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                              No social links added.<br />Click &quot;Add New Link&quot; to show social icons in the footer.
                            </p>
                          </div>
                        );
                      }
                      return links.map((link: any, i: number) => (
                        <div key={i} className={cn("relative group rounded-xl border p-4 transition-all hover:border-blue-200 hover:bg-blue-50/10", hasError(fieldErrors, `socialLinks.${i}`) ? 'border-red-300 bg-red-50/30' : 'border-slate-100')}>
                          <button
                            onClick={() => removeSocialLink(i)}
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white border border-slate-200 text-red-500 flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                          >
                            <Trash2 size={12} />
                          </button>

                          <div className="flex flex-col gap-3">
                            <div className="flex gap-4">
                              <select
                                className="w-1/3 rounded-lg border-slate-200 bg-white px-3 py-2 text-xs font-semibold"
                                value={link.platform}
                                onChange={(e) => updateSocialLink(i, 'platform', e.target.value)}
                              >
                                <option value="Instagram">Instagram</option>
                                <option value="Facebook">Facebook</option>
                                <option value="Twitter">Twitter / X</option>
                                <option value="Youtube">Youtube</option>
                                <option value="Whatsapp">Whatsapp</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Custom">Other</option>
                              </select>
                              <div className="relative w-2/3">
                                <input
                                  className={cn("w-full rounded-lg border-slate-200 bg-white px-3 py-2 pl-8 text-xs font-medium", hasError(fieldErrors, `socialLinks.${i}.url`) && 'border-red-300')}
                                  value={link.url}
                                  placeholder="https://..."
                                  onChange={(e) => updateSocialLink(i, 'url', e.target.value)}
                                />
                                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                  <ExternalLink size={12} />
                                </div>
                              </div>
                            </div>
                            <ErrorMsg field={`socialLinks.${i}.url`} />
                          </div>
                        </div>
                      ));
                    } catch { return null; }
                  })()}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Footer Brand Description</label>
                <textarea
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white resize-none", hasError(fieldErrors, 'footerDescription') && 'border-red-300 ring-2 ring-red-500/10')}
                  rows={3}
                  value={form.footerDescription}
                  onChange={e => set("footerDescription", e.target.value)}
                />
                <ErrorMsg field="footerDescription" />
              </div>


            </div>
          </section>

          {/* AMS Warning Section */}
          <section className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center gap-3 border-b bg-slate-50/50 px-6 py-4">
              <div className="rounded-lg bg-red-50 p-1.5 text-red-600">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-bold text-slate-900">Health & AMS Warning</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Warning Title</label>
                <input
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold transition-all focus:border-blue-500 focus:bg-white", hasError(fieldErrors, 'amsWarningTitle') && 'border-red-300')}
                  value={form.amsWarningTitle}
                  onChange={e => set("amsWarningTitle", e.target.value)}
                  placeholder="e.g. Don't ignore the 48-hour rule"
                />
                <ErrorMsg field="amsWarningTitle" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5 ml-1 text-slate-500">Warning Description</label>
                <textarea
                  className={cn("block w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:bg-white resize-none", hasError(fieldErrors, 'amsWarningDesc') && 'border-red-300 ring-2 ring-red-500/10')}
                  rows={3}
                  value={form.amsWarningDesc}
                  onChange={e => set("amsWarningDesc", e.target.value)}
                />
                <ErrorMsg field="amsWarningDesc" />
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
