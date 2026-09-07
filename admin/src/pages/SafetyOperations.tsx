import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import { useUserStore } from "../store/userStore";
import { apiRoot } from "../utils/privacyApi";

type Report = { id: number; publisherId: number; carouselId: number | null; publisherName?: string; carouselName?: string; reason: string; details: string; createdAt: string; status: string; resolution?: string };
type Deletion = { id: string; accountType: string; status: string; pendingFiles: string[]; targets: { type: string; id: number }[]; createdAt: string };
const control = "rounded border border-gray-500 bg-gray-800 px-3 py-2 text-white focus:outline-2 focus:outline-orange-400 disabled:opacity-50";

export default function SafetyOperations() {
  const token = useUserStore(state => state.user?.token);
  const [reports, setReports] = useState<Report[]>([]);
  const [requests, setRequests] = useState<Deletion[]>([]);
  const [filter, setFilter] = useState("open");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<Report | null>(null);
  const [action, setAction] = useState("dismiss");
  const [resolution, setResolution] = useState("");
  const request = useCallback(async (path: string, payload?: unknown) => {
    const response = await fetch(`${apiRoot}/admins/safety${path}`, { method: payload ? "POST" : "GET", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: payload ? JSON.stringify(payload) : undefined, cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load safety operations.");
    return data;
  }, [token]);
  const load = useCallback(async () => {
    setBusy(true); setError("");
    try {
      const [reportData, deletionData] = await Promise.all([request(`/reports?status=${filter}`), request("/deletions")]);
      setReports(reportData.reports); setRequests(deletionData.requests);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Request failed."); }
    finally { setBusy(false); }
  }, [filter, request]);
  useEffect(() => { void load(); }, [load]);
  const resolve = async () => {
    if (!selected || busy) return;
    setBusy(true); setError("");
    try { await request(`/reports/${selected.id}/resolve`, { action, resolution }); setSelected(null); setResolution(""); await load(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Could not save the decision."); }
    finally { setBusy(false); }
  };
  const retry = async (id: string) => {
    setBusy(true); setError("");
    try { await request(`/deletions/${id}/retry`, {}); await load(); }
    catch (failure) { setError(failure instanceof Error ? failure.message : "Retry failed."); }
    finally { setBusy(false); }
  };
  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-8 p-6 text-gray-100">
        <div><h1 className="text-3xl font-bold">Reports &amp; Privacy</h1><p className="mt-2 text-gray-300">Review reports daily. Prioritise child safety and immediate threats. Confirm the content and record your reason before taking action.</p></div>
        {error && <p role="alert" className="rounded border border-red-400 p-3 text-red-200">{error}</p>}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-4"><h2 className="text-xl font-bold">Content and publisher reports</h2><label>Status <select className={control} value={filter} onChange={event => setFilter(event.target.value)} disabled={busy}><option value="open">Open</option><option value="resolved">Resolved</option></select></label><button className={control} disabled={busy} onClick={() => void load()}>{busy ? "Loading…" : "Refresh"}</button></div>
          {!busy && reports.length === 0 && <p>No {filter} reports.</p>}
          {reports.map(report => <article key={report.id} className="space-y-3 rounded-lg border border-gray-600 p-4">
            <h3 className="font-bold">#{report.id} · {report.reason}</h3>
            <p>{report.publisherName || `Publisher ${report.publisherId}`} · {new Date(report.createdAt).toLocaleString()}</p>
            {report.carouselId && <Link className="text-orange-300 underline" to={`/content/${report.carouselId}`}>Inspect {report.carouselName || "reported carousel"}</Link>}
            <p className="whitespace-pre-wrap break-words">{report.details || "No additional details."}</p>
            {report.status === "open" ? <button className={control} disabled={busy} onClick={() => { setSelected(report); setAction("dismiss"); setResolution(""); }}>Review report</button> : <p>{report.resolution}</p>}
          </article>)}
          {selected && <form className="space-y-4 rounded-lg border border-orange-400 p-4" onSubmit={event => { event.preventDefault(); void resolve(); }}>
            <h3 className="font-bold">Decision for report #{selected.id}</h3>
            <label className="block">Action <select className={control} value={action} onChange={event => setAction(event.target.value)} disabled={busy}><option value="dismiss">Dismiss report</option>{selected.carouselId && <option value="remove_content">Remove content from public display</option>}<option value="ban_publisher">Ban publisher and hide their content</option></select></label>
            <label className="block">Decision and reason<textarea className={`${control} mt-2 w-full`} required minLength={5} maxLength={2000} value={resolution} onChange={event => setResolution(event.target.value)} disabled={busy} /></label>
            <p>This applies the selected action immediately. Banning prevents publisher sign-in and hides their content from viewers.</p>
            <div className="flex gap-3"><button className={control} disabled={busy} type="submit">Confirm decision</button><button className={control} disabled={busy} type="button" onClick={() => setSelected(null)}>Cancel</button></div>
          </form>}
        </section>
        <section className="space-y-4"><h2 className="text-xl font-bold">Verified account deletions</h2><p>Only email-verified requests appear here. Complete means active database and locally managed file cleanup finished. Check provider retention and carry this ledger forward before restoring backups. Unrecognised external file locations require provider assistance.</p>
          {!busy && requests.length === 0 && <p>No verified deletion requests.</p>}
          {requests.map(item => <article key={item.id} className="space-y-2 rounded-lg border border-gray-600 p-4"><h3 className="break-all font-bold">{item.id}</h3><p>{item.accountType} · {item.status} · {new Date(item.createdAt).toLocaleString()}</p><p>Deleted account IDs: {item.targets.map(target => `${target.type} ${target.id}`).join(", ")}</p>{item.pendingFiles.length > 0 && <><p>Files awaiting cleanup: {item.pendingFiles.length}</p><ul className="list-inside list-disc break-all">{item.pendingFiles.map(file => <li key={file}>{file}</li>)}</ul><button className={control} disabled={busy} onClick={() => void retry(item.id)}>Retry local file cleanup</button></>}</article>)}
        </section>
      </div>
    </AppLayout>
  );
}
