import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import LegalPageLayout from "../layouts/LegalPageLayout";
import { privacyRequest } from "../utils/privacyApi";

type RequestResult = { requestId: string; message: string };
type ConfirmationResult = { message: string; reference: string; status: string };
export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [accountType, setAccountType] = useState("publisher");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<ConfirmationResult | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      if (!requestId) {
        const data = await privacyRequest<RequestResult>("/deletion/request", { email, accountType });
        setRequestId(data.requestId); setMessage(data.message);
      } else {
        const data = await privacyRequest<ConfirmationResult>("/deletion/confirm", { requestId, code, confirm: confirmed });
        setResult(data); setCode(""); setEmail("");
      }
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Request failed. Please try again."); }
    finally { setBusy(false); }
  };

  return (
    <LegalPageLayout title="Delete Your Account" description="Verify and permanently delete your Carsl publisher or CARSL TV viewer account and associated data.">
      <main className="page single-column" id="main">
        <div className="hero">
          <p className="eyebrow">Account &amp; data requests</p>
          <h1>Delete your Carsl account</h1>
          <p className="lead">Choose your publisher account, TV viewer account, or both. You can use this page without signing in or reinstalling an app.</p>
        </div>
        {result ? <div className="callout" role="status"><h2>Deletion {result.status === "complete" ? "confirmed" : "in progress"}</h2><p>{result.message}</p><p>Reference: {result.reference}</p><p>Hosting backups and provider records are handled separately as explained below.</p></div> : <>
          <div className="callout"><p><strong>This is permanent.</strong> Account deletion removes the selected account's profile, credentials, settings and saved activity. Publisher deletion also removes its uploaded artwork and carousels from Carsl. You cannot recover the deleted account through the app.</p></div>
          <form className="legal-form" onSubmit={submit} aria-busy={busy}>
            {!requestId ? <>
              <label>Registered email<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} disabled={busy} /></label>
              <label>Account to delete<select value={accountType} onChange={event => setAccountType(event.target.value)} disabled={busy}><option value="publisher">Publisher account</option><option value="viewer">TV viewer account</option><option value="both">Both accounts</option></select></label>
              <button className="button" disabled={busy} type="submit">{busy ? "Sending…" : "Email a verification code"}</button>
            </> : <>
              <p role="status">{message}</p><p>Requested: <strong>{accountType === "both" ? "both accounts" : `${accountType} account`}</strong> for {email}.</p>
              <label>8-digit deletion code<input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" required maxLength={8} value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ""))} disabled={busy} /></label>
              <label className="confirmation"><input type="checkbox" required checked={confirmed} onChange={event => setConfirmed(event.target.checked)} disabled={busy} />I understand this permanently deletes the selected account(s) and associated data.</label>
              <button className="button" disabled={busy || !confirmed || code.length !== 8} type="submit">{busy ? "Deleting…" : "Confirm permanent deletion"}</button>
              <button type="button" disabled={busy} onClick={() => { setRequestId(null); setCode(""); setConfirmed(false); setError(""); }}>Change details or request a new code</button>
            </>}
            {error && <p className="form-error" role="alert">{error}</p>}
          </form>
        </>}
        <article>
          <section><h2>What happens next</h2><p>Codes expire in 15 minutes and allow up to five confirmation attempts. After verification and confirmation, Carsl removes the account and its related records from the active database. File cleanup starts immediately and retries automatically if a file could not be removed.</p><p>For viewers, deletion includes favourites, followed publishers, search and watch history, progress, feedback, blocks and reports. For publishers it includes artwork files, carousels, profile and publishing settings. Signing out, uninstalling or unpublishing alone does not delete an account.</p></section>
          <section><h2>Retention and support</h2><p>A minimal deletion ledger with account identifiers and your reference, but no email or code, is kept for 90 days to prevent accidental restoration. Backups, hosting logs and email-provider records have separate retention settings. Contact us for the period applicable to your request or any legally required retention.</p><p>If you cannot access your registered email or need help with pending cleanup, email <a href="mailto:carsl.ssfo@gmail.com?subject=Carsl%20account%20deletion%20request">carsl.ssfo@gmail.com</a> and identify the account type or deletion reference. Never send passwords or sign-in codes. We will explain any alternative ownership checks and the expected response time.</p><p><Link to="/privacy-policy">Read the Privacy Policy</Link></p></section>
        </article>
      </main>
    </LegalPageLayout>
  );
}
