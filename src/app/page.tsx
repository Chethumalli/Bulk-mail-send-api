"use client";

import { useState } from "react";

export default function Home() {
  const [emails, setEmails] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {

      let response;

      if (file) {
        // CSV Upload Mode
        const formData = new FormData();
        formData.append("file", file);
        formData.append("subject", subject);
        formData.append("body", body);

        response = await fetch("/api/send", {
          method: "POST",
          body: formData
        });

      } else {
        // Manual Email Mode
        response = await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emails: emails.split("\n").map(e => e.trim()).filter(Boolean),
            subject,
            body
          })
        });
      }

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(`Successfully sent ${data.count} emails!`);
        setEmails("");
        setSubject("");
        setBody("");
        setFile(null);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send emails.");
      }

    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10">

          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Marketing Mailer
          </h1>

          <p className="text-neutral-400 mb-8">
            Send bulk emails to your customer list instantly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* CSV Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Upload CSV (Optional)
              </label>

              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200"
              />

              <p className="text-xs text-neutral-500 mt-2">
                CSV must contain an <b>email</b> column.
              </p>
            </div>


            {/* Manual Emails */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Recipient Emails
              </label>

              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="john@example.com&#10;jane@example.com"
                rows={4}
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono"
              />

              <p className="text-xs text-neutral-500 mt-2">
                Enter one email per line (ignored if CSV uploaded).
              </p>
            </div>


            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Subject
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Exciting News from Our Team!"
                required
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>


            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Email Body (HTML supported)
              </label>

              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="<h1>Hello!</h1><p>Write your message here...</p>"
                required
                rows={6}
                className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono"
              />
            </div>


            {/* Status */}
            {status !== "idle" && (
              <div
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  status === "success"
                    ? "bg-green-500/10 border border-green-500/20 text-green-400"
                    : status === "error"
                    ? "bg-red-500/10 border border-red-500/20 text-red-400"
                    : "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                }`}
              >
                {status === "loading" && (
                  <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                )}

                <p className="text-sm font-medium">
                  {status === "loading" ? "Sending emails..." : message}
                </p>
              </div>
            )}


            {/* Button */}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Sending..." : "Send Bulk Emails"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}