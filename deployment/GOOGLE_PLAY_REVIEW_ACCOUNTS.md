# Google Play reviewer accounts

Migration: `apis/migrations/20260908000001-create-google-play-review-accounts.js`.

| App | Login email |
| --- | --- |
| Publisher (`com.carsl.app`) | `play-review-publisher@joincarsl.com` |
| TV viewer (`com.carsl`) | `play-review-viewer@joincarsl.com` |

Passwords are provided privately with the implementation handoff. Put them in Play Console's private App access fields; do not add them to Git, app bundles or public instructions. The migration contains only bcrypt hashes and creates the same credentials in each database where it runs.

## Provisioning

From `apis`, apply the migration to the database used by the submitted builds. For the production configuration in `config/config.js`:

```sh
npx sequelize-cli db:migrate --env production
```

The production connection uses the existing `DB_*_PROD` environment variables. Applying the migration to development does not create these accounts in production. Pushing the feature branch does not run the main-branch deployment workflow.

Both accounts are ordinary active users, pre-verified, with completed onboarding and Terms version `2026-09-07` accepted. Publisher settings and viewer art preferences are included. The migration sends no emails and grants no administrator access. No login bypass, special password or fixed OTP is added to application code. Normal passwords, account status, moderation, token expiry and deletion behavior continue to apply.

The migration is transactional. It will not overwrite an existing account with different credentials. Rerunning it preserves the existing accounts, profiles and preferences rather than resetting review activity. Its `down` intentionally preserves accounts and associated content; use normal account deletion after review if removal is needed.

## Instructions for reviewers

Publisher: open Carsl and choose Log in. Enter the publisher email and the password supplied in App access. The account is already verified and profile setup is complete. Use the normal publishing/profile screens.

TV: open Carsl on Android TV and choose Log in. Enter the viewer email and the password supplied in App access. Verification, style selection and profile setup are already complete. Browse the available artwork and normal viewing/preferences screens.

No email code is required for these existing-account logins. Password reset, account deletion and fresh signup retain their normal email-code requirements. Arrange access to the dedicated mailboxes if those flows need to be exercised; this migration does not create mailboxes or make codes accessible. It does not publish artwork or bypass moderation. Prepare approved sample content separately and keep the accounts usable throughout review.

## Validation

Verified in development on 8 September 2026: both real login controllers accepted the supplied passwords and rejected incorrect passwords; verification, onboarding and Terms fields were populated; publisher settings and viewer styles existed; rerunning the migration produced no duplicate accounts or preferences. A conflicting password was rejected in an isolated test transaction that was rolled back. Outbound sign-in email was stubbed in the local verification process; no emails were sent by these checks.

Production database credentials were not configured in the local workspace, so production provisioning was not performed. Production provisioning, mailbox access and installed-app verification must be completed against the submitted builds before handing the credentials to Google.
