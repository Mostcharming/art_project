# Carsl Google Play Console answers

Prepared 8 September 2026 from both apps, the shared API, and current Google guidance. Use alongside [submission checklist](GOOGLE_PLAY_SUBMISSION.md) and [production operations](deployment/PRIVACY_OPERATIONS.md).

**Two submissions:** publisher `com.carsl.app` and TV viewer `com.carsl`. The admin website and API do not need Play entries. Suggested store names below distinguish the apps; they do not change Android package IDs or the current launcher names.

**How to use this document:** copy the supplied text into the matching Console section. Items marked **CONFIRM** need an actual business decision, production verification, or reviewer credential. Leave those forms as drafts until resolved. Console questions can vary with account, country, artifact permissions, and earlier answers. Do not treat this as evidence of a completed release or policy certification.

## 1. Developer account: shared by both apps

| Console field | Value / action |
| --- | --- |
| Developer display name | `Carsl`, if this is the brand you want displayed and it is available |
| Account type | **CONFIRM:** Personal if publishing as yourself; Organisation only for the actual verified organisation |
| Legal name, address, country, telephone | Enter your real verified details. These cannot be inferred from the app brand or workspace |
| Organisation details / D-U-N-S | Actual organisation details, if Google requests them |
| Contact person and verification email | Your monitored account contact; complete Google's verification |
| Public app support email | `carsl.ssfo@gmail.com` |
| Website | `https://joincarsl.com` |
| Developer verification / device verification | Complete every task shown for your account |
| Payments / tax / trader declarations, if shown | **CONFIRM** actual legal and commercial status. A free app alone does not determine trader status |
| Developer agreements and policy declarations | Read and accept as the account owner when accurate |

Do not put signing passwords, reviewer passwords, tax IDs or identity documents into this repository. Google may publish some developer contact details according to account type and distribution region. [Account requirements](https://support.google.com/googleplay/android-developer/answer/10788890?hl=en).

## 2. Create the two apps

| Field | Publisher | TV viewer |
| --- | --- | --- |
| App name (30 characters maximum) | `Carsl Publisher` | `Carsl TV` |
| Default language | English (United States), `en-US` | English (United States), `en-US` |
| App or game | App | App |
| Free or paid | **Proposed: Free**; confirm launch pricing | **Proposed: Free**; confirm launch pricing |
| Android package, supplied by bundle | `com.carsl.app` | `com.carsl` |
| Category | Art & Design | Art & Design |
| Tags | Select only relevant tags actually offered by Console, such as art/gallery; do not enter unrelated discovery keywords | Same; use viewing-related tags only where available and accurate |
| Form factor | Phone/tablet support as validated by the bundle | Add Android TV in Setup / Advanced settings / Form factors (navigation may vary) |
| Countries / regions | **CONFIRM** initial launch countries | **CONFIRM** initial launch countries |
| Support email | `carsl.ssfo@gmail.com` | `carsl.ssfo@gmail.com` |
| Website | `https://joincarsl.com` | `https://joincarsl.com` |
| Phone in store listing | Optional; supply an actual monitored number if desired | Same |

Do not create another app if the package already exists in your account: open its existing entry. Store title changes do not require package changes. Review Free/Paid before saving; Google does not allow a distributed free app to be converted to paid. [Create and set up an app](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en).

## 3. Main store listing: publisher

**App name**

```text
Carsl Publisher
```

**Short description** (maximum 80 characters)

```text
Upload artwork, create carousels and manage your Carsl publisher profile.
```

**Full description** (maximum 4,000 characters)

```text
Carsl Publisher helps artists, galleries and institutions organise artwork and share collections through Carsl.

UPLOAD AND ORGANISE ARTWORK
Choose images from your device and add artwork details, including titles, artist information and descriptions.

CREATE ART CAROUSELS
Bring artworks together into carousels, arrange their order and set display timing. Save your work, manage publication and schedule collections for release.

MANAGE YOUR PUBLISHER PROFILE
Create and update your publisher profile with your name, creator type, country and biography. Manage your artwork and collections from one place.

SHARE THROUGH CARSL
Publish collections for discovery and viewing in Carsl TV, subject to Carsl's content review and community rules. Upload only artwork you own or have permission to share.

A publisher account and an internet connection are required. Carsl Publisher is the creation and management app; use Carsl TV to discover and display art on a supported television.

Support: carsl.ssfo@gmail.com
Privacy policy: https://joincarsl.com/privacy-policy
```

Do not add claims about selling art, earning money, subscriptions, push notifications, offline use or AI creation unless the submitted app actually provides them.

## 4. Main store listing: TV

**App name**

```text
Carsl TV
```

**Short description**

```text
Discover art, follow publishers and enjoy artwork carousels on your TV.
```

**Full description**

```text
Bring art to your television with Carsl TV. Discover artwork and explore carousels shared by artists, galleries and other Carsl publishers.

DISCOVER ART
Browse collections and new arrivals, explore publishers and search for artwork that interests you.

ENJOY ARTWORK CAROUSELS
Open a collection and view its artwork on your TV. Explore the artwork and publisher details as you browse.

MAKE YOUR VIEWING PERSONAL
Sign in to save favourites, follow publishers and return to recently viewed collections. Set your art preferences to personalise your experience.

MANAGE YOUR EXPERIENCE
Adjust available viewing and accessibility preferences. Report content or publishers and block publishers you do not want to see.

Carsl TV requires an internet connection and a supported Android TV or Google TV device. An account is required for personalised features. To upload artwork and publish your own collections, use Carsl Publisher.

Support: carsl.ssfo@gmail.com
Privacy policy: https://joincarsl.com/privacy-policy
```

This description does not promise live television, films, music streaming, a system screensaver or offline playback. Remote usability must still pass device testing.

## 5. Store graphics and screenshots

| Asset | Publisher | TV |
| --- | --- | --- |
| Store icon | 512 x 512 PNG; create a store export from existing brand artwork | 512 x 512 PNG |
| Feature graphic | 1024 x 500 JPEG or 24-bit PNG without alpha | Same |
| Screenshots | At least 2 actual app screenshots; prepare 4-6 phone captures. Add tablet captures if distributing and marketing tablet support | At least 1 Android TV screenshot is required for TV; prepare 4 actual landscape TV captures and satisfy the listing's overall minimum screenshot checks |
| TV store banner | Not applicable | 1280 x 720 JPEG or 24-bit PNG without alpha |
| Preview video | Optional; leave blank if none | Optional; leave blank if none |

Use real captures from the submitted build, with artwork you have permission to display. Suggested publisher screens: dashboard, artwork upload, carousel editor, schedule, profile. Suggested TV screens: discovery, search, carousel view, favourites. Avoid personal emails and passwords in screenshots. [Google asset requirements](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en).

Existing TV store banner: `C:\Users\OluwaMayowa\Downloads\carslTV\assets\store\android-tv-banner.png`. Checked locally: **1280 x 720, 24-bit RGB**. Visual/branding review remains. This is separate from the 320 x 180 launcher banner packaged in the app.

## 6. App content: common answers and differences

| Console section / question | Publisher answer | TV answer |
| --- | --- | --- |
| Privacy policy URL | `https://joincarsl.com/privacy-policy` | Same |
| App access: is all functionality unrestricted? | No: all or some functionality is restricted by login | No: guest browsing exists, personalised features require login |
| Contains ads | **No**, based on inspected integrations; confirm no paid placements or production ad integration | Same |
| Advertising ID used? | **No**, based on source; verify final merged manifest and dependencies | Same |
| Target audience / age groups | **CONFIRM** actual intended ages | **CONFIRM** actual intended ages |
| Appeals to children? | Answer based on actual design, marketing and intended users; current product is a creator tool | Answer based on actual design and catalogue; general artwork is not proof of child targeting |
| News app | No | No |
| Government app | No | No |
| Financial features | Select the option that the app does not provide financial features | Same |
| Health apps declaration | Select the option that the app does not provide health features | Same; accessibility settings are not medical treatment |
| COVID-19 contact tracing / status, if shown | No | No |
| Blockchain / tokenised digital assets, if shown | No | No |
| Real-money gambling / contests, if shown | No | No |
| In-app digital purchases / subscriptions | None found; answer No for current build | Same; following a publisher is not a paid subscription |
| User-generated content | Yes: publisher uploads and publication | Yes: displays publisher-supplied artwork; reports/blocks implemented |
| Generative AI features, if asked | No app AI-generation feature found | Same; displaying uploaded art is a different question from generating it |
| Data safety | Yes, collects user data; complete sections 9-11 below | Yes, collects user data; complete sections 9-11 below |

Read the current wording before selecting an option; Google's forms include conditional follow-up questions. [App content preparation](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en), [declaration catalogue](https://developers.google.com/android-publisher/app-store-review/policy-declarations).

### Age selection needs a product decision

If intentionally adult-only, select **18 and over**. If intended for teens and adults, select all applicable age bands, for example **13-15, 16-17, 18 and over**. Do not choose 18+ merely to avoid requirements. The current Terms do not establish an adult-only service or verify age. Including children requires a separate Families compliance assessment. The optional Console restriction for Google-identified minors is a separate choice from the target audience and IARC rating. [Target audience guidance](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en).

### Conditional declarations triggered by the final bundle

No broad photo/video, camera, microphone, background location, SMS/call log, all-files access, VPN, accessibility-service or package-install use was identified as a required feature. Publisher config blocks broad media/storage/camera/audio permissions. A system picker does not require a broad photo-access justification. If Console nevertheless opens a sensitive-permission form, inspect the merged manifest first and remove an unintended permission; do not invent a qualifying use case. Ordinary accessibility preferences do not make the app an Android AccessibilityService.

If a foreground-service declaration is triggered, inspect the specific service/type in the final artifact and provide the actual feature, justification and requested demonstration video. Do not select a service type on the strength of the app's name.

If **Child safety standards** is required (notably for apps categorised as Social or Dating), use actual externally published standards and a trained, monitored contact. The existing `/terms-of-use` prohibits CSAE; that alone does not certify every reporting, removal and legal obligation. Do not certify unimplemented operations or change category to evade a requirement.

## 7. App access: reviewer accounts and paste-ready instructions

The backend now includes a migration for **two separate active, pre-verified accounts** with completed onboarding and current Terms acceptance. See [provisioning and verification instructions](deployment/GOOGLE_PLAY_REVIEW_ACCOUNTS.md). Apply the migration to production before submitting; development accounts are separate from production accounts. Provide passwords only in Console's private access fields.

| Field | Publisher | TV |
| --- | --- | --- |
| Instruction set name | `Carsl publisher review account` | `Carsl TV viewer review account` |
| Username / email | `play-review-publisher@joincarsl.com` | `play-review-viewer@joincarsl.com` |
| Password | Publisher password supplied privately; verify against production | Viewer password supplied privately; verify against production |
| Other access requirements | Use text below after testing it | Use text below after testing it |

Publisher instructions:

```text
Use the supplied publisher account on the Sign in screen. This account is already email-verified, has completed publisher setup and has accepted the current Terms. Normal sign-in requires only the supplied email and password.

After sign-in, use the dashboard's artwork upload and carousel creation controls to test publishing features. Open a carousel to review its artwork, ordering and display settings. New publications may require content review before appearing in Carsl TV.

Settings provides Terms, Privacy Policy and account deletion. Account deletion verifies ownership by email and permanently removes the selected account and its content.

The app uses the production Carsl service. No payment is required to access the submitted features. Support: carsl.ssfo@gmail.com.
```

TV instructions:

```text
Launch Carsl TV on an Android TV or Google TV device. Use the remote's directional pad and centre/select button to navigate. Choose Sign in and use the supplied viewer email and password. This account is already email-verified and has completed onboarding.

Browse the home collections, open a carousel and start viewing. Test search, favourites, followed publishers and recently viewed collections. Content and publisher detail pages provide report and block controls. Settings provides viewing preferences, blocked publishers, Terms, Privacy Policy and account deletion instructions. Use the remote's Back button to return to the previous screen.

Guest browsing is available, while personalised features require sign-in. The app uses the production Carsl service. No payment is required to access the submitted features. Support: carsl.ssfo@gmail.com.
```

**Review access gap to resolve:** deletion, password reset and fresh signup use email codes. Pre-verifying a login does not make those restricted flows accessible. Before submission provide a documented, secure way for reviewers to obtain required codes for dedicated test accounts, or an implemented review mechanism restricted to those accounts. Do not claim that no additional information is needed if a flow still needs an inaccessible inbox; do not disable verification for ordinary users. Maintain a replacement reviewer account if a reviewer tests permanent deletion. [Reviewer access requirements](https://support.google.com/googleplay/android-developer/answer/10788890?hl=en).

## 8. Content rating questionnaire: complete once per app

| Question topic | Publisher | TV |
| --- | --- | --- |
| IARC contact email | `carsl.ssfo@gmail.com` | Same |
| App category in questionnaire | All Other App Types, if those are the offered branches | All Other App Types, if offered; follow any specific art/media branch shown |
| Users create/upload/exchange content | Yes: publishes images and text | Yes where the question includes accessing content contributed by other users |
| Direct chat / messaging between users | No direct chat found; distinguish from broad sharing/interaction wording | Same; follows and public artwork still count where included by the question |
| Publicly accessible / online content | Yes | Yes |
| Shares current physical location with other users | No live location feature found; publisher country is displayed on profiles, so disclose it if the question also includes user-entered location | No current-location sharing feature found |
| Digital purchases / random paid items | No | No |
| Unrestricted internet browser or search engine | No: artwork search and external links are not an unrestricted browser | Same |
| Gambling, prizes convertible to money | No features found | No features found |
| Violence, fear, blood/gore, sex/nudity, language, drugs, alcohol/tobacco, discrimination | **CONFIRM actual available artwork and descriptions** | **CONFIRM actual accessible catalogue**, including content outside seeded examples |

You cannot safely answer every artwork-content question No from source code alone. Art can include non-sexual nudity, violence, religious imagery or mature themes; answer the specific frequency/context questions honestly. Terms prohibiting explicit content do not prove there are no rating-relevant artworks. Submit the questionnaire and accept the calculated regional ratings after reviewing them; do not invent an ESRB/PEGI rating. [Content ratings](https://support.google.com/googleplay/android-developer/answer/9859655?hl=en).

## 9. Data safety: initial form, both apps

| Question | Answer to enter |
| --- | --- |
| Does your app collect or share any required user data types? | **Yes**, both apps |
| Is all collected user data encrypted in transit? | **Proposed Yes, pending release-network verification.** APIs are configured for HTTPS. Confirm all images, redirects, SDK requests and applicable provider transfers too |
| Account creation methods | **Username and password** (email serves as username); no OAuth/social login found. Email signup verification does not by itself establish a separate passwordless login method |
| Account deletion URL | `https://joincarsl.com/delete-account` |
| Can users request account/data deletion? | **Yes once the deployed flow works**: publisher Settings and external verified web form; TV Settings gives the external process |
| Delete some/all data without deleting the account? (optional separate question) | **CONFIRM.** Select Yes only for a supported, documented process and provide its URL. The account-deletion form alone is not proof of independent data deletion |
| Automatically deleted within 90 days? | Do not choose this as a blanket answer: active accounts, artwork and viewing records have no general 90-day expiry |
| Independent security review | No / not completed; no authorised-lab review evidence |
| Payments/UPI certification, if shown | No / not applicable |

HTTP checks on 8 September returned **200** for privacy, Terms and deletion routes, but only the React HTML shell was retrieved. No browser was available for rendered-page verification; the form's email and deletion operations remain untested. Do not equate HTTP 200 with a working policy or deletion flow.

The following per-type matrices are a source-based worksheet. Retained account/content data is **not ephemeral**. Collection means leaving the device; local biometric authentication does not mean Carsl receives fingerprint/face templates. [Google Data safety definitions](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).

## 10. Data safety: publisher per-type answers

For each row select **Collected: Yes**, **Ephemeral: No**, and the purposes shown. Required/optional is judged across the app's actual users and primary functions. **Shared** must be resolved using section 12.

| Google data type | Required or optional | Purposes to select | Source behaviour |
| --- | --- | --- | --- |
| Personal info / Name | Required | Account management; App functionality | Required publisher name at setup |
| Personal info / Email address | Required | Account management; App functionality; Fraud prevention, security and compliance | Signup, login, verification, recovery, deletion and account-security emails |
| Personal info / User IDs | Required | Account management; App functionality; Fraud prevention, security and compliance | Account IDs associated with owned content and access controls |
| Location / Approximate location | Required | Account management; App functionality | Publisher country is mandatory and displayed as publisher location. This is a conservative mapping of user-entered geographic location, not GPS collection |
| Personal info / Other info | Required | Account management; App functionality | Required persona type: individual/gallery/institution, etc. |
| Photos and videos / Photos | Required for primary publishing functionality | App functionality | Uploaded artwork images; profile image is optional, but the same data type is required to publish artwork |
| App activity / Other user-generated content | Required for primary publishing functionality | App functionality; Account management | Artwork/carousel titles, artist metadata and descriptions; optional bio and website; report/support text if transmitted through app |
| App activity / App interactions | Required | App functionality | Retained publishing, scheduling and content-management actions/status |

**Technical-data rows requiring production classification:** retained IP/user-agent used for account-security messages and request logs should be mapped to **Device or other IDs** where they identify a device/app/browser; purposes **Fraud prevention, security and compliance**, plus **App functionality** where used for service operation. Use **Diagnostics** for retained latency/error/performance data actually collected to operate/debug the app, with **Analytics / App functionality** as applicable. These are not automatic declarations of crash SDKs. Confirm what the deployed proxy, hosting and mail providers retain and whether any IP is geolocated. Do not omit identifiable technical data solely because no advertising SDK exists.

**Not identified in publisher source:** in-app search history sent to the API, precise location, phone numbers, contacts/address book, messages inbox/SMS, calendar, installed-app inventory, browsing history, video/audio uploads, payment details, purchase history, health/fitness data or crash-reporting SDK. Leave these unselected only after confirming production integrations. Artwork listing price is not a customer payment record. Local biometric templates are not uploaded.

If publication/review metrics also analyse publisher behaviour, add **Analytics** to the relevant identifiers/interactions rather than assuming every datum has only one purpose.

## 11. Data safety: TV per-type answers

For collected rows below, choose **Ephemeral: No** for stored data. Guest mode makes account-only fields optional if the released guest experience is usable without them; verify this on a device. **Shared** is addressed in section 12.

| Google data type | Required or optional | Purposes to select | Source behaviour |
| --- | --- | --- | --- |
| Personal info / Email address | Optional across app because guest browsing exists; required to register | Account management; App functionality; Fraud prevention, security and compliance | Account email, verification, recovery and security messages |
| Personal info / User IDs | Optional if only assigned/transmitted for signed-in users | Account management; App functionality; Personalization; Analytics; Fraud prevention, security and compliance | Account-linked viewing, saved content, recommendations and moderation |
| Personal info / Name | Optional | Account management; App functionality | Viewer profile name |
| Photos and videos / Photos | Optional | Account management; App functionality | Viewer profile-image upload |
| App activity / Other user-generated content | Optional where manually entered | App functionality; Account management; Personalization | Profile website, user-entered fields, report details and preferences |
| App activity / In-app search history | Optional if users can use browsing without searching | App functionality | Search queries; server retains signed-in search history and counts. Add Personalization only if search history actually feeds recommendations |
| App activity / App interactions | Required if requests/view counts are logged for all viewers; optional only if all such collection can be avoided | App functionality; Personalization; Analytics | Viewing history/progress/counts, engagement and preference interactions |
| App activity / Other actions | Optional for manually chosen actions | App functionality; Personalization; Analytics | Favourites, follows, likes/dislikes and related engagement totals; use App interactions instead where Console's current taxonomy places these there, without losing any covered action |

**Technical data:** apply the same IP/user-agent, Device or other IDs and Diagnostics review as publisher. Network requests occur in guest mode too, so guest browsing does not make all technical collection optional. Check third-party placeholder requests before finalising sharing.

**Approximate location:** no viewer country/GPS collection was found. Do not declare location merely because an artist's country is displayed. If production derives visitor location from IP, disclose the actual inferred location type and purposes. The backend calls raw IP `location` in security-email data; a field label alone does not establish geolocation.

**Not identified:** precise location, phone/address/contact-list collection, health diagnosis, payment records, purchase history, microphone recordings, videos, installed-app inventory, SMS, calendar, browsing history or crash SDK. Language/voice/accessibility preferences are settings; they do not prove audio recording or medical-data collection. Confirm the final build and network behaviour before leaving types unchecked.

## 12. Data safety: sharing decisions that remain open

Do not answer every sharing question No without resolving these actual transfers:

1. **Hosting, storage, database and email:** record the real providers and their role. Transfers can use Google's service-provider exception only when the provider processes on Carsl's behalf under its instructions. Confirm retention and independent uses. Account-security emails include IP/user-agent data.
2. **Public publisher artwork/profile:** transfers initiated by users with an expected public audience may qualify for Google's user-initiated-sharing exception. Confirm the publishing/profile UI makes that audience clear for names, country, images and metadata. Otherwise mark the affected types Shared and give the actual purpose, typically App functionality.
3. **Viewer engagement provided to publishers:** the inspected publisher dashboard returns subscriber/view totals, not viewer names/emails. The server separately reads follower email/first name to send new-content emails through its mail provider. Confirm no other production endpoint exposes identifiable viewers. Fully anonymous totals may qualify for an exception; identifiable follower/viewer data is different.
4. **TV external placeholders:** `https://via.placeholder.com/...` appears in several TV pages. Requests disclose connection data to another operator. Its provider status and practices are unverified. Resolve by using local/first-party placeholders or establishing the actual collection/sharing practices before final answers. This guide does not assert that such transfers qualify for an exception.
5. **Infrastructure:** confirm CDN/WAF, server analytics, support-mail attachments and any runtime SDKs absent from source manifests. If non-exempt sharing exists, select Shared for every affected data type and the actual sharing purposes. No advertising/marketing use has been identified in the apps.

These are specific unresolved inputs, not permission to guess. Save Data safety as a draft while they remain open. [Android data collection guidance](https://developer.android.com/privacy-and-security/declare-data-use), [Google collection/sharing rules](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en).

**Email purpose refinement:** the backend sends publisher publication notices and viewer new-content notices for followed publishers. Include **Developer communications** for names/emails and follow relationships used for these notifications, alongside the matrix purposes. If deployed emails promote products/services beyond requested service updates, also declare **Advertising or marketing** for the actual data used; the absence of an ad SDK does not rule out email marketing.

## 13. Build commands and signing

### Publisher: EAS production bundle

Production profile now explicitly sets the production environment, `EXPO_PUBLIC_ENV=production` and Android `app-bundle`; remote version codes auto-increment.

```powershell
Set-Location 'E:\Dir\DEV\carsl\publishers'
npx expo install --check
npx tsc --noEmit
eas build --platform android --profile production
```

Use the resulting **.aab**, not the preview APK. EAS owner is `mostcharming`; the project ID is already in `app.json`. Protect existing upload credentials. Do not start a duplicate cloud build while the current attempt is still active. [Expo production builds](https://docs.expo.dev/build-reference/android-builds/).

### TV: local production bundle

```powershell
Set-Location 'C:\Users\OluwaMayowa\Downloads\carslTV'
$env:ENVFILE='.env.production'
Set-Location android
.\gradlew.bat :app:bundleRelease --console=plain
```

Expected result: `android\app\build\outputs\bundle\release\app-release.aab`. Signing reads `android\keystore.properties`; it exists, but its credentials are not printed here. Source version is `versionCode 1`, `versionName "1.0"`: if 1 has already been uploaded to this package, increment before another upload. An existing bundle dated 7 July 2026 predates the privacy changes and is not the result of this build.

Publisher must meet current mobile target API **36+**; TV **34+** (TV source sets 36). Verify the generated publisher manifest. Verify native 16 KB compatibility in final bundles, including TV's current 64-bit/16 KB requirements. Compile success alone is insufficient. [Target SDK requirements](https://developer.android.com/google/play/requirements/target-sdk), [TV distribution](https://developer.android.com/training/tv/publishing/distribute), [16 KB checks](https://developer.android.com/guide/practices/page-sizes).

Enable Play App Signing per entry, preserve the corresponding upload key, and upload each AAB only to its matching package. Check version code, SDK, permissions and supported devices in App bundle explorer.

## 14. Testing tracks, release fields and submission order

1. Complete account verification and create/open both app entries.
2. Deploy and verify the API migration, moderation/deletion services and public legal pages following the operations guide. Keep current clients and backend Terms versions aligned.
3. Finish signed builds and upload each to **Internal testing**. Add the actual tester email list; share the opt-in link privately. Do not invent tester identities.
4. Test installed release builds: sign-in/signup/recovery, publisher upload/scheduling, TV remote navigation/player/resume, report/block/unblock, Terms/privacy, secure-session upgrade/logout, and verified account deletion. Check pre-launch reports. TV also needs form-factor review and remote-only usability.
5. Finish listings, graphics, app access, content ratings, Data safety and other applicable declarations. Check the Console dashboard for outstanding items.
6. If your personal account falls under Google's newer-account testing rule, run **closed testing with at least 12 testers continuously opted in for 14 days** before applying for production access. Internal testing is not a substitute. [Testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en).
7. For production-access questions about recruitment, engagement, feedback, changes and readiness, describe the actual completed test. Record tester count/dates, devices, concrete issues and fixes. These answers cannot truthfully be filled before testing occurs.
8. Select the confirmed production countries, create the production release, review errors/warnings and submit changes for review. Use managed publishing if you want to control when approved changes go live; check its applicability in your Console before relying on it.

**Release name** (internal label): publisher `1.0.0 - Initial publisher release`; TV `1.0 - Initial TV release`, adjusted to the actual built version.

**Publisher release notes**

```text
<en-US>
Initial Carsl Publisher release.
Upload artwork, organise carousels, manage publication and update your publisher profile.
Includes access to Terms, Privacy Policy and account deletion.
</en-US>
```

**TV release notes**

```text
<en-US>
Initial Carsl TV release.
Discover art, view carousels, save favourites and follow publishers.
Includes viewing preferences, reporting, publisher blocking and access to account information.
</en-US>
```

Use the text inside the language tags if Console's current editor already provides a separate en-US field. Keep notes consistent with the tested build.

## 15. Remaining inputs before forms can be final

- Confirm store names, Free/Paid, intended age bands and launch countries for each app.
- Supply actual verified developer identity and any account-specific legal/trader details in Console.
- Provision working reviewer accounts, approved sample artwork and reviewer access to code-protected flows.
- Verify the rendered public legal pages, production migration, email delivery, account deletion and moderation operation.
- Review the catalogue for the IARC questions and verify artwork rights.
- Finish final-artifact permissions, SDK/native compatibility and device tests.
- Resolve production provider/retention details, viewer-to-publisher data exposure and TV external placeholders for Data safety.
- Capture and upload actual store screenshots and remaining graphics.

No Play Console forms, app entries or releases have been submitted by this task. Build results are tracked in [build status](deployment/PLAY_BUILD_STATUS.md).
