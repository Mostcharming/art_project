# Play build status - 8 September 2026

This file records the build attempts started with the Console-answer preparation. Last checked **8 September 2026, 19:13 Africa/Lagos**. Both builds completed successfully. Neither app has been uploaded to Play Console by this task.

| Check | Publisher | TV |
| --- | --- | --- |
| Project | `E:\Dir\DEV\carsl\publishers` | `C:\Users\OluwaMayowa\Downloads\carslTV` |
| Package | `com.carsl.app` | `com.carsl` |
| Production environment | Explicit EAS production environment and `EXPO_PUBLIC_ENV=production` | `ENVFILE=.env.production`; production API configured for HTTPS |
| Signing | EAS selected existing remote Android keystore; downloaded artifact not independently verified yet | Release signing completed; `jarsigner -verify` reports `jar verified` (self-signed certificate warnings) |
| Version | EAS incremented remote version code 4 to **5**; app 1.0.0 | Source versionCode **1**, versionName **1.0**; check Play's existing highest code before upload |
| TypeScript | `npx tsc --noEmit` passed | Not separately run in this task |
| Dependency check | Expo recommends patch updates to expo ~54.0.37, constants ~18.0.14, file-system ~19.0.24 and local-authentication ~17.0.9; dependencies not changed | Existing dependencies used |
| Current attempt | EAS `FINISHED`: `2f975680-1b65-4352-a482-cc9b0e393d37`; completed 18:49:58 Africa/Lagos | `BUILD SUCCESSFUL in 54m 37s`; bundle written 18:35:55 Africa/Lagos |
| New release artifact | Download link below | `android/app/build/outputs/bundle/release/app-release.aab`, 47,002,443 bytes; new 8 September bundle confirmed |

Publisher log: `publishers/.expo/submission-build.log` (ignored local output).

[Open publisher build progress and eventual artifact](https://expo.dev/accounts/mostcharming/projects/carsl/builds/2f975680-1b65-4352-a482-cc9b0e393d37).

[Download publisher 1.0.0 (5) AAB](https://expo.dev/artifacts/eas/yg5f5VdrJBZJm8tAfP-tUNYNfqSRJifGsqOuw5wjCtY.aab).

TV SHA-256: `7668EB1A8929AD05D31FED06A0A517E94AF1ABD537090E9F6E8CF3E0FA4BA52C`.

The publisher cloud build predates removal of the duplicate `app/types.ts` route file during local testing. A subsequent build is needed to include that source fix. The local API address change is in ignored `.env.local`; production uses its separate HTTPS configuration.

TV log: `C:\Users\OluwaMayowa\Downloads\carslTV\android\build-submission.log` (local output).

Read-only progress checks:

```powershell
Get-Content 'E:\Dir\DEV\carsl\publishers\.expo\submission-build.log' -Tail 40
Get-Content 'C:\Users\OluwaMayowa\Downloads\carslTV\android\build-submission.log' -Tail 40
Set-Location 'E:\Dir\DEV\carsl\publishers'
eas build:list --platform android --limit 3
```

Before internal-test upload, finish package/version, merged-manifest, target API and native page-size checks, verify the publisher artifact signature, and test the installed bundles. Build success alone does not certify Play readiness.

Production remains unverified: no migration/deployment, reviewer-account provisioning, installed-device testing, moderation operations, email/deletion test or Play form submission occurred in this task. Public legal routes returned 200 with a React shell; rendered content was not verified because a browser was unavailable.

Use [Console answers](../GOOGLE_PLAY_CONSOLE_ANSWERS.md) for the submission fields and unresolved inputs, and [privacy operations](PRIVACY_OPERATIONS.md) for backend deployment prerequisites.
