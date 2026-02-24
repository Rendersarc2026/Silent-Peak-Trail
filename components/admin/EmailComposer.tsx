"use client";
import { useState } from "react";
import { X, Send, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { useAction } from "@/lib/hooks/useAction";

interface EmailComposerProps {
    to: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function EmailComposer({ to, onClose, onSuccess }: EmailComposerProps) {
    const [subject, setSubject] = useState("Regarding your enquiry - Silent Peak Trail");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const [handleSend, { loading }] = useAction(async () => {
        if (!subject.trim() || !message.trim()) {
            alert("Please fill in both subject and message.");
            return;
        }

        const res = await fetch("/api/admin/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to, subject, message }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "Failed to send email");
        }

        setSent(true);
        setTimeout(() => {
            onSuccess?.();
            onClose();
        }, 2000);
    });

    return (
        <div className="fixed bottom-6 right-6 z-[100] w-96 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between border-b bg-slate-50/80 px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600">
                        <Mail size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">New Message</h3>
                </div>
                <button
                    onClick={onClose}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="p-4 space-y-4">
                <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Recipient</label>
                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 border border-slate-100 italic">
                        {to}
                    </div>
                </div>

                <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        disabled={sent}
                        className="w-full rounded-xl border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-300"
                        placeholder="What's this about?"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={sent}
                        rows={6}
                        className="w-full rounded-xl border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none placeholder:text-slate-300"
                        placeholder="Type your message here..."
                    />
                </div>

                <button
                    onClick={() => handleSend({})}
                    disabled={loading || sent}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95 ${sent ? "bg-green-500 shadow-green-200" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                        }`}
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : sent ? (
                        <>
                            <CheckCircle2 size={18} /> Sent Successfully
                        </>
                    ) : (
                        <>
                            <Send size={16} /> Send Email
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
