# Carsl: Google Play submission checklist

**8 September build/submission update:** use [Google Play Console answers](GOOGLE_PLAY_CONSOLE_ANSWERS.md) for copy-ready listings, per-app declarations, Data safety worksheets and reviewer instructions. See [current build status](deployment/PLAY_BUILD_STATUS.md) for the release attempts. The implementation-time statements below describe the earlier audit, not the current build status.

Prepared 7 September 2026 for **Carsl**, contact **carsl.ssfo@gmail.com**. Scope: the Android publisher app and Android TV viewer app. Findings below come from source inspection, not a release-build or device certification.

**Reviewer accounts:** the backend now includes a migration for dedicated publisher and viewer accounts. See [reviewer account provisioning and login instructions](deployment/GOOGLE_PLAY_REVIEW_ACCOUNTS.md). Apply it to the production database used by the submitted builds; development provisioning alone is not production access. Passwords are supplied privately for Play Console.

## What the projects do

| Project | Purpose | Android package |
| --- | --- | --- |
| `publishers/` | Expo app for creators to manage profiles, upload artwork, and publish/schedule carousels | `com.carsl.app` |
| `C:\Users\OluwaMayowa\Downloads\carslTV` | React Native TV app for discovering and displaying art, favourites, followed publishers, and personalised viewing | `com.carsl` |
| `admin/` and `apis/` | Website, administration/moderation, and shared account/content API | Website/backend, not separate Play submissions |

The two Android apps currently have different package IDs and serve different audiences. Use separate Play Console app entries for these existing identities; enable Android TV distribution for the viewer entry. Decide final display names before preparing artwork. Do not change an already-published package ID to rename an app.

## Website pages added

- `admin/src/pages/PrivacyPolicy.tsx`: public React policy covering both apps, operated by Carsl; `/terms-of-use` provides shared Terms and community rules.
- `admin/src/pages/DeleteAccount.tsx`: public React form for verified account and associated-data deletion, with email support as a fallback.
- `admin/src/layouts/LegalPageLayout.tsx` and its stylesheet: shared responsive layout with styles scoped to these pages.
- `admin/src/routes.json` and `admin/src/App.tsx`: register `/privacy-policy` and `/delete-account` in the existing admin router, accessible without an admin session.
- `admin/src/pages/Home.tsx`: homepage links to both pages.

Once these files are deployed on the production admin website at `joincarsl.com`, the intended Play Console URLs are:

- Privacy policy: `https://joincarsl.com/privacy-policy`
- Account deletion: `https://joincarsl.com/delete-account`

The web server must serve the admin app's `index.html` for these client-side routes, as it does for other React routes. Verify direct visits and page refreshes as well as navigation from the homepage.

The initial legal routes were committed and pushed earlier. This expanded implementation has not been deployed or verified live. The existing main-branch workflow deploys the admin frontend. After publishing, open both URLs while signed out, on another network and on a phone; verify they return the actual pages and that the email request works. Google requires an accessible privacy policy and an in-app policy link or text. [Google User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311).

## Address these findings before submission

The code changes below are implemented in source. Production configuration and release checks are listed separately in [Privacy operations](deployment/PRIVACY_OPERATIONS.md).

- [x] **Make legal text usable in the apps.** Both signup screens and Settings provide native Terms and Privacy readers. TV uses remote-friendly paged text without depending on a browser. All copies come from `legal/documents.json`.
- [x] **Add publisher account deletion.** Settings now has an email-verification and permanent-deletion confirmation flow, also available through the public admin React route. TV Settings explains the same external request process.
- [x] **Implement deletion processing.** The API verifies an expiring code, removes account/dependent records transactionally, invalidates access through account existence checks, queues file cleanup and retries failures. Admins can monitor verified requests. Scheduled retention, an independent ledger exporter and backup-restoration replay are included.
- [x] **Provide practical policy wording and an operations guide.** Added sample provider/retention configuration clearly labelled as sample, a log-rotation example, support procedures and backup restoration steps. Real provider identities, locations, mailbox monitoring and external retention still require deployment verification; the public policy does not invent them.
- [x] **Align TV support and security wording.** Replaced conflicting contacts with `carsl.ssfo@gmail.com` and replaced blanket encryption claims with specific implemented measures.
- [x] **Protect account storage.** Publisher uses Expo SecureStore; TV uses an Android Keystore module. Old plaintext tokens are discarded on upgrade, profile writes use field allowlists, server account JSON excludes secrets, and request payload/header logging was removed. Sign-out clears session/profile caches. Viewer token expiry is enforced.
- [x] **Implement public-content moderation.** Versioned Terms acceptance is enforced at signup and publisher upload/publication. TV can report content/publishers, block and unblock publishers. Server filters prevent blocked or inactive publishers appearing in viewer content queries. Admin Reports & Privacy supports review, content removal, bans and recorded decisions.
- [x] **Remove broad Android image access.** Publisher upload/edit now uses the system image picker without a media-library permission prompt; unnecessary camera/audio and broad storage/media permissions are blocked in Expo config.

Deployment actions still required: run the migration, configure the real email/hosting/backup settings, publish updated native binaries, verify artwork rights, and perform the release checks in the operations guide. Native dependency installation, builds, tests and production deployment have not been run for this implementation.

## Prepare each Play Console entry

- [ ] Complete the developer account's identity/contact and any device verification. Organisation accounts may require a D-U-N-S number; use the actual legal identity Google verifies, even if the app brand is Carsl. [Play Console requirements](https://support.google.com/googleplay/android-developer/answer/10788890?hl=en).
- [ ] Set app name, language, app category, support email, website, countries, and pricing. Provide short/full descriptions that accurately distinguish publishing from TV viewing.
- [ ] Upload app icons, feature graphics, and real screenshots of each submitted app. Prepare a 512 × 512 store icon and 1024 × 500 feature graphic. For TV, also supply TV screenshots and a 1280 × 720 store banner; this is separate from the launcher banner packaged in the app. An existing TV image is in `assets/store/android-tv-banner.png`; check dimensions and content before use. [Google store assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en).
- [ ] Complete content rating, target audience/age groups, ads declaration, app access, Data safety, and any other declarations shown for each app. Decide child targeting deliberately and review the Families requirements if children are included. No ads or billing SDK was identified in the inspected dependencies; confirm the production app before answering.
- [ ] Provide reusable publisher and viewer reviewer accounts, complete onboarding, and seed approved artwork. Give clear login instructions that work without access to your private email inbox or expiring verification codes. Keep the production API and email service available throughout review. [Reviewer access requirements](https://support.google.com/googleplay/android-developer/answer/10788890?hl=en).

## Data safety: working inventory to review

This table describes observed app/backend behaviour. It is a starting point for the separate Console forms, not a pre-approved declaration.

| Observed information | Publisher | TV viewer |
| --- | --- | --- |
| Email, account ID, name and profile fields | Account/profile | Account/profile |
| Photos | Uploaded art/profile images | Profile image, when uploaded |
| Other user-provided content | Biography, artwork/carousel descriptions and metadata | Profile fields and saved preferences |
| App activity | Publishing actions and content engagement records | Watch history/progress, favourites, feedback and follows |
| In-app searches | Confirm collection for shipped features | Search history is stored |
| Technical information | Server request logs, IP and user-agent | Server request logs, IP and user-agent |

Map each collected field to Google's current data types and purposes. Review collection versus sharing, mandatory versus optional fields, and service-provider exceptions. Assess approximate location if IP/country information is used to derive location; the absence of a GPS permission alone does not settle that declaration. Do not classify an artwork's listed price as a card payment or a saved voice preference as an audio recording. Verify every production SDK and network destination before finalising security and sharing answers. [Google Data safety definitions](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).

## Release artifacts and Android compatibility

- [ ] Produce **signed production Android App Bundles (`.aab`)** for both entries, configure Play App Signing, and protect the upload keys. Increment version codes for every new upload.
- [ ] Publisher: use the existing EAS **production** profile. The preview profile explicitly creates an APK and is not the intended store bundle. Confirm its production API environment and generated manifest.
- [ ] TV: use the Gradle release bundle task with the production environment. The project already has a release signing configuration that reads local keystore properties; verify it resolves the intended upload key without sharing those files.
- [ ] Verify the final publisher AAB targets **API 36 or higher**. Since 31 August 2026 this is the new-app/update mobile requirement. Android TV requires **API 34 or higher**; the TV source already configures target/compile SDK 36. [Current target API requirements](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en).
- [ ] Check native dependencies and the final bundles for **16 KB page-size compatibility** on 64-bit devices when targeting Android 15+. Do not infer compatibility only from the React Native version. Follow the current Console requirements for the submitted release; Android's guidance also identifies 1 February 2027 enforcement for incompatible updates. TV has its own current requirements below. [Android page-size guidance](https://developer.android.com/guide/practices/page-sizes).

## Additional Android TV work

- [ ] Enable the Android TV form factor and complete its review requirements in Play Console.
- [ ] Retain the existing Leanback launcher, optional touchscreen declaration and app banner. Verify the packaged launcher assets, including the 320 × 180 banner and TV icon.
- [ ] Check every screen with only a D-pad/remote: signup, login, keyboard entry, browsing, playback, settings, legal access, focus visibility and Back behaviour. Ensure landscape presentation, readable text, no clipped controls, and reliable pause/resume behaviour.
- [ ] Review profile-image selection and other phone-oriented controls on a real TV. The dependency is standard React Native rather than `react-native-tvos`; the manifest alone does not prove the UI is TV-ready.
- [ ] Validate both 32-bit and 64-bit support and 16 KB page sizes, required for TV from 1 August 2026. `reactNativeArchitectures` currently lists both ARM families and x86 variants, but the final artifact and libraries still need verification.

Source for TV requirements: [Android TV app quality](https://developer.android.com/develop/adaptive-apps/quality-guidelines/tv-app-quality).

## Test and submit when the fixes are ready

1. Upload each signed bundle to internal testing. Review Console errors and pre-launch reports, then exercise signup, verification, password reset, profile changes, uploads, moderation, viewing, history, and legal/deletion access against production.
2. If using a personal developer account created after 13 November 2023, complete the required closed test with at least **12 testers continuously opted in for 14 days**, then apply for production access. Check the requirement for each app; internal testing alone does not satisfy it. [Google testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en).
3. Resolve device, policy, and data-disclosure issues; complete TV review where applicable. Submit each production release with its reviewer credentials and release notes, then monitor review messages and production errors.

No builds, dependency installation, device testing, store upload, migrations or production deployment were performed for the expanded privacy and moderation implementation. See the operations guide before release.
