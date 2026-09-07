# Carsl: Google Play submission checklist

Prepared 7 September 2026 for **Carsl**, contact **carsl.ssfo@gmail.com**. Scope: the Android publisher app and Android TV viewer app. Findings below come from source inspection, not a release-build or device certification.

## What the projects do

| Project | Purpose | Android package |
| --- | --- | --- |
| `publishers/` | Expo app for creators to manage profiles, upload artwork, and publish/schedule carousels | `com.carsl.app` |
| `C:\Users\OluwaMayowa\Downloads\carslTV` | React Native TV app for discovering and displaying art, favourites, followed publishers, and personalised viewing | `com.carsl` |
| `admin/` and `apis/` | Website, administration/moderation, and shared account/content API | Website/backend, not separate Play submissions |

The two Android apps currently have different package IDs and serve different audiences. Use separate Play Console app entries for these existing identities; enable Android TV distribution for the viewer entry. Decide final display names before preparing artwork. Do not change an already-published package ID to rename an app.

## Website pages added

- `admin/src/pages/PrivacyPolicy.tsx`: public React page covering both apps, operated by Carsl.
- `admin/src/pages/DeleteAccount.tsx`: public React page with instructions and a prefilled email link for account and associated-data deletion requests.
- `admin/src/layouts/LegalPageLayout.tsx` and its stylesheet: shared responsive layout with styles scoped to these pages.
- `admin/src/routes.json` and `admin/src/App.tsx`: register `/privacy-policy` and `/delete-account` in the existing admin router, accessible without an admin session.
- `admin/src/pages/Home.tsx`: homepage links to both pages.

Once these files are deployed on the production admin website at `joincarsl.com`, the intended Play Console URLs are:

- Privacy policy: `https://joincarsl.com/privacy-policy`
- Account deletion: `https://joincarsl.com/delete-account`

The web server must serve the admin app's `index.html` for these client-side routes, as it does for other React routes. Verify direct visits and page refreshes as well as navigation from the homepage.

These are intended deployment URLs, **not verified live URLs**. The existing main-branch workflow deploys the admin frontend, but this task has not pushed changes or run that workflow. After publishing, open both URLs while signed out, on another network and on a phone; verify they return the actual pages and that the email request works. Google requires an accessible privacy policy and an in-app policy link or text. [Google User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311).

## Address these findings before submission

- [ ] **Make the legal text usable in the apps.** Publisher signup (`publishers/app/auth/signup/email-password.tsx`) and TV signup (`src/pages/SignupPage.tsx`) currently render legal labels as plain text. Add working policy access at signup and in Settings. On TV, provide remote-accessible policy text or another reliable experience that does not depend on an installed browser.
- [ ] **Add a publisher account-deletion entry in Settings.** It can open the public deletion-request page. Android TV is exempt from the in-app initiation requirement, but still needs an external deletion URL in Play Console. An email-based web resource is allowed; account suspension is not deletion. [Google account-deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en).
- [ ] **Put the deletion process into operation.** No publisher/viewer account-deletion API was found. The new webpage sends an email request; it does not remove database rows or files. Establish ownership verification, an actual fulfilment procedure, and a response time you can meet. Cover both account types, related rows, uploaded files, tokens, service providers, and backups. Confirm backup expiry and exceptional retention periods, then make the public policy more specific where needed. Do not mark deletion operational in Play Console until requests can be fulfilled.
- [ ] **Confirm the policy against production operations.** Verify hosting/storage/email providers, processing countries, retention, any advertising/data transfers outside this repository, and the support mailbox. Confirm that the backup/deletion commitments on both pages are achievable. Source code alone cannot establish these operational facts.
- [ ] **Align TV support and security wording.** `src/pages/SettingsPage.tsx` contains both `carslsupport@atf-art.com` and `carslsupport@joincarsl.com`; use the confirmed contact. It also claims all personal data is encrypted. Replace broad claims with verified practices; production HTTPS does not establish encrypted device or database storage.
- [ ] **Review account storage.** `publishers/store/userStore.ts` persists the user object and token using AsyncStorage, and its type permits password/reset/verification fields. Ensure API responses and state never persist those secrets; use secure credential storage for session secrets. The TV app also stores its auth token in AsyncStorage. This is a source-review finding, not proof that a plaintext password is currently saved.
- [ ] **Complete public-content moderation.** Carsl publishes user-uploaded artwork. Admin approval exists, but a complete viewer report/block flow was not identified. Provide accepted Terms covering prohibited content, content/user reporting, user blocking, and ongoing moderation appropriate to the public artwork service. Confirm rights to publish all review/demo artwork. [Google UGC policy](https://support.google.com/googleplay/android-developer/answer/9876937?hl=en).
- [ ] **Review Android image permissions.** Publisher upload/edit screens request media-library access. Check the merged release manifest and use the system photo picker when broad access is unnecessary. Broad photo/video permissions require a qualifying use case and declaration. [Google photo/video permissions policy](https://support.google.com/googleplay/android-developer/answer/14115180?hl=en-CA).

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

No builds, dependency installation, device testing, store upload, or production deployment were performed as part of adding these pages.
