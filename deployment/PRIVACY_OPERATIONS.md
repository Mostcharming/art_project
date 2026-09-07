# Carsl privacy and moderation operations

The application changes implement the submission findings. They require a database migration, updated Android binaries and operational setup before they can be described as working in production. No real provider names or processing countries have been invented in the public policy.

## Release order

1. Keep an independent, access-restricted backup of the current database and uploaded files. Record the existing upload signing keys securely.
2. Apply `20260908000000-add-privacy-and-moderation.js` using the API's existing migration command. It adds acceptance fields, deletion requests, reports and blocks. Do not start the new API against an unmigrated database. The deployment workflow now stops on a migration failure.
3. Deploy the API and admin together. Keep `legal/documents.json` and its generated copies in the release. Configure a private `JWT_SECRET`; production now refuses the old sample secret. Confirm `ALLOWED_ORIGINS`, the local reverse proxy, and production HTTPS. If your proxy is on another host, configure its specific trusted address instead of trusting all forwarded headers.
4. Configure the real Mailtrap or SMTP credentials already supported by the email service. SMTP must use TLS in production. Confirm the verified sender and delivery to ordinary mailboxes. Do not put keys or passwords in this guide, app bundles or Git.
5. Release new publisher and TV Android binaries. The publisher dependency manifests now include Expo SecureStore; install dependencies during the normal build pipeline. The TV app includes a new Android Keystore native module, so a JavaScript-only update is insufficient. No dependencies were installed locally during implementation.
6. Coordinate client rollout with API rollout: new signup requests must include the current terms version and explicit acceptance. Older publisher builds will also receive HTTP 428 when trying to upload/publish without current terms acceptance. Existing users can accept in the updated app's Terms page. Old plaintext sessions are discarded on upgrade; users sign in once again. Viewer sessions now expire and deleted/inactive accounts cannot continue using old tokens.
7. The public URLs are `/privacy-policy`, `/terms-of-use`, and `/delete-account`; configure the admin's existing SPA fallback for direct visits. The authenticated admin queue is `/safety` (Reports & Privacy in the sidebar).

## Settings to adopt and verify

The values below are **sample operational defaults**, not a statement that an external provider has been configured. Replace the provider/country fields with factual information and apply the retention settings before using them in a public declaration.

| Item | Sample/default | Action |
| --- | --- | --- |
| Account operator | Carsl | Confirm the developer identity in Play Console matches the operator or clearly identifies the brand |
| Privacy/support mailbox | carsl.ssfo@gmail.com | Monitor daily; restrict mailbox access and enable MFA |
| Hosting, PostgreSQL and uploaded files | Existing Carsl server; provider and country to be recorded | Record actual vendor, region and any subprocessors |
| Transactional email | Mailtrap **or** configured SMTP | Record the actual deployed transport, processing country and provider retention |
| Support email processing | Mailbox provider | Record mailbox retention and deletion procedure |
| Database/file backups | 30 days maximum recommended | Configure encrypted backups, provider lifecycle expiry and restricted access; do not claim this is applied until verified |
| PM2, proxy and security logs | 30 days recommended | Apply the example logrotate rule and the equivalent provider/proxy settings |
| Manual privacy enquiries | Acknowledge within 3 working days; aim to resolve within 30 days, or sooner where law requires | Staff this process and explain exceptions/delays to the requester; these are service targets, not an unverified promise in the public policy |
| Advertising transfers | None in the implemented app integrations | Confirm no infrastructure, SDK, marketing or partner integration introduces additional transfers |

Public wording currently describes provider categories and asks users to contact Carsl for the applicable external retention period. Once the actual settings are known, update `legal/documents.json`, increment its version if appropriate, and run `scripts/sync-legal-documents.ps1`. Keep the backend `TERMS_VERSION` aligned if the terms change.

## Automated account deletion

- The website and publisher Settings use the same API. The user selects publisher, TV viewer or both, then requests an 8-digit email code. A request alone never removes an account.
- Codes are hashed, expire in 15 minutes, and allow five confirmation attempts. Requests have IP and email throttles. The confirmation includes an explicit permanent-deletion flag.
- Account IDs are captured when the request is created. A later account created with the same email is not silently substituted into that request.
- A transaction removes the selected accounts, credentials, profile, viewer history/preferences/favourites/follows/blocks/reports, or publisher artwork/carousels/settings and related records. Admin activity records directly associated with the deleted accounts/content are also removed.
- Uploaded files are placed in a durable cleanup queue. Only files inside the managed artwork/profile upload directories can be unlinked. Shared assets with another live owner are retained. External or unrecognised file locations remain pending for operator investigation; no external URL is fetched or guessed for deletion.
- The API retries cleanup every minute. Use Reports & Privacy to inspect pending files or retry. `complete` means **active database and managed-file cleanup**, not certification that every external backup or email-provider record has expired.
- Unconfirmed deletion requests are purged after expiry. Completed deletion ledger entries retain IDs and references, but no email or code, for 90 days. Closed reports are purged after 90 days; admin activity logs after 30 days. The minute-based worker executes these cutoffs while the API is running.

The CLI can run maintenance independently (from `apis/`):

```powershell
node scripts/privacy-maintenance.js run
```

The command performs the same actual cleanup as the scheduled worker. It is an operations command, not a dry run.

## Backup restoration: carry deletion forward

Maintain an up-to-date deletion ledger separately from database backups. Export it regularly and immediately before any restore; protect it because it contains account identifiers. Keep historical exports for at least the backup window and no longer than the documented 90-day ledger period.

```powershell
node scripts/privacy-maintenance.js export-ledger /protected/path/carsl-deletions.json
```

After restoring a consistent database/file backup, keep the restored service offline, run current migrations, and reapply the current ledger **before enabling traffic**:

```powershell
node scripts/privacy-maintenance.js replay-ledger /protected/path/carsl-deletions.json --confirm-restored-database
```

Replay performs real deletion for the verified account IDs in that operator-controlled file. Do not use a ledger supplied by an app user. Do not allow new account creation between restoration and replay, and never restore database sequences in a way that reassigns old IDs. Review pending file cleanup afterwards. Ensure the backup provider also expires redundant copies and any separately stored media on the configured schedule. A media-only restore must exclude files belonging to deleted accounts; the ID ledger alone is not a file-level backup manifest.

## Manual support and provider follow-through

1. Ask the requester to use the verified deletion form when they can access the account email. Never ask for a password or sign-in code by email.
2. If email access is lost, investigate ownership through established account/support records; do not delete merely because somebody supplied an email address. Record the decision in a restricted support system. If ownership cannot be verified, explain the alternative evidence required.
3. Locate outstanding requests by their reference in the admin queue. Investigate failed local cleanup, ownership conflicts and external file storage. Do not mark a pending item resolved while its personal files remain accessible without a legitimate retention reason.
4. Request removal of associated data from service providers, including applicable email/support records. Honour any necessary legal hold and explain its scope and deadline to the user. The code cannot configure or certify unknown provider accounts.
5. Reply with what was removed, any remaining restricted copies and their expiry, and how to follow up. Use the sample service targets above only after staffing and confirming they can be met.

## Ongoing content moderation

- Assign a monitored daily moderation shift and a backup moderator. The queue prioritises child-safety reports, then oldest reports. Escalate urgent threats promptly; handle illegal material through appropriate provider/law-enforcement channels without circulating copies in email.
- Inspect the reported carousel or publisher and the submitted details. Record the reason before dismissing, hiding content or banning a publisher. A ban stops publisher API access and hides the publisher's content in viewer queries; a content-removal decision clears approval and flags the carousel.
- Keep reports separate from dislikes. Reports alone do not automatically punish a publisher, avoiding a mass-report removal mechanism.
- Viewers can report artwork/carousels or publishers and block publishers. Blocking removes their existing follows/favourites/recent watches and filters feeds, search, recommendations and detail access. Unblocking does not restore removed favourites or follows.
- Provide appeals through carsl.ssfo@gmail.com. Verify the rights to all seeded/demo artwork independently; source code cannot establish licensing.

## Checks to perform before submission

No builds, automated tests, device tests, migrations or production operations were executed for these changes. Before release, verify at least:

- Missing/false/outdated terms acceptance is rejected at signup and publisher upload. Current acceptance is saved with a timestamp; existing publishers can accept and retry.
- Correct, incorrect, expired, repeated and concurrent deletion confirmations; publisher-only, viewer-only and both; email delivery failure; deleted JWTs; all dependent records/files; failed file retry; a restoration with the independent ledger.
- Reporting content/user, duplicate reports, block/unblock, blocked/flagged/banned content across every TV feed/search/detail/player/favourite path, and administrator-only queue access.
- Fresh install and upgrade from plaintext tokens, secure storage unavailable/corrupt, logout/relaunch, account switching, and session expiry. Inspect device storage and logs for credentials.
- Remote-only access to terms/privacy at signup and Settings, legal page paging, report reasons, block confirmation, and unblock controls.
- Final Android merged manifests contain only needed permissions; image selection works without broad photo/video permissions. Verify signed release bundles and the separate Play submission checklist.
