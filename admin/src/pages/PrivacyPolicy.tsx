import { Link } from "react-router-dom";
import LegalPageLayout from "../layouts/LegalPageLayout";

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How Carsl handles information across the Carsl publisher app, CARSL TV viewer app, and Carsl website. Contact us or request account deletion."
    >
      <main className="page" id="main">
      <div className="hero">
        <p className="eyebrow">Carsl · Publisher &amp; TV</p>
        <h1>Privacy policy</h1>
        <p className="lead">Your art, your viewing experience, and the information that makes Carsl work.</p>
        <p className="meta">Last updated: <time dateTime="2026-09-07">7 September 2026</time></p>
        <p>This policy explains how <strong>Carsl</strong> handles personal information in the Carsl publisher app, the CARSL TV viewer app for Android TV, and the Carsl website, including its account and administration services.</p>
        <p>Carsl operates these services. For privacy questions or requests, email <a href="mailto:carsl.ssfo@gmail.com">carsl.ssfo@gmail.com</a>.</p>
      </div>
      <div className="content-layout">
        <nav className="contents" aria-label="Policy sections">
          <h2>On this page</h2>
          <ol>
            <li><a href="#information">Information we handle</a></li>
            <li><a href="#purposes">How we use it</a></li>
            <li><a href="#sharing">Visibility and sharing</a></li>
            <li><a href="#device">Your device</a></li>
            <li><a href="#security">Security</a></li>
            <li><a href="#retention">Retention</a></li>
            <li><a href="#choices">Choices and deletion</a></li>
            <li><a href="#children">Children</a></li>
            <li><a href="#changes">Updates and contact</a></li>
          </ol>
        </nav>
        <article aria-label="Carsl privacy policy">
          <section id="information">
            <h2>1. Information we handle</h2>
            <h3>Accounts and profiles</h3>
            <p>When you register or manage an account, we process your email address, account identifier, password for authentication, verification and password-reset information, account status, and the profile details you provide. Passwords are hashed on our server.</p>
            <p>Publisher profiles may include a name, creator or organisation type, country, biography, website, and profile image. Viewer profiles may include a name, website, and profile image. Optional profile fields depend on the app and features you use.</p>
            <h3>Artwork and publishing</h3>
            <p>We store the images you upload and related information, such as artwork title, artist, year, dimensions, stated price, carousel descriptions, tags, display timing, and publishing schedules. We also keep publication, review, and moderation status. An artwork's stated price is listing information; it is not a payment-card record.</p>
            <h3>Viewing activity and preferences</h3>
            <p>For viewers, we process saved favourites, followed artists or publishers, searches, viewing history, watch counts and progress, and feedback such as likes and dislikes. We store the style, language, content, display, and accessibility preferences you choose. This includes accessibility settings rather than a medical diagnosis.</p>
            <h3>Technical information and correspondence</h3>
            <p>Our services receive connection and request information, including IP address, browser or app user-agent information, request time, and server response details. Account security emails may include sign-in device and IP information. If you contact us, we receive your email address, message, and any attachments you choose to send.</p>
          </section>
          <section id="purposes">
            <h2>2. How we use information</h2>
            <ul>
              <li>Create and verify accounts, authenticate sign-ins, recover access, and manage profiles.</li>
              <li>Store, review, publish, schedule, and display artwork and carousels.</li>
              <li>Remember preferences, personalise browsing, restore viewing progress, and provide favourites and followed content.</li>
              <li>Calculate engagement measures such as views and favourites, and help publishers understand how their content is used.</li>
              <li>Send account, security, verification, and service-related emails, and respond to support or privacy requests.</li>
              <li>Operate and troubleshoot the service, investigate misuse, moderate content, and protect accounts.</li>
            </ul>
          </section>
          <section id="sharing">
            <h2>3. Visibility and sharing</h2>
            <p><strong>Public content:</strong> published artwork, carousel information, and publisher details displayed with that content can be viewed by other people. Do not include private information in material you intend to publish. Account passwords and verification codes are not public profile information.</p>
            <p><strong>Service providers:</strong> hosting, database, file-storage, and email providers process information needed to run Carsl. This includes delivering account emails and handling correspondence sent to our support mailbox. Authorised administrators can access information needed for support, moderation, and service operation.</p>
            <p><strong>Other disclosures:</strong> information may be disclosed when necessary to meet a legal obligation, respond to a lawful request, investigate abuse, or protect the rights and safety of users and Carsl.</p>
            <p>Service providers may process information in countries other than where you live. Information you independently share with an external website is governed by that website's policy. Carsl does not use the app activity described here to serve third-party targeted advertisements.</p>
          </section>
          <section id="device">
            <h2>4. Your device and permissions</h2>
            <p>The apps store session information and account or preference data on your device to keep you signed in and remember your choices. Signing out clears the app's saved sign-in state; uninstalling an app does not delete your server account.</p>
            <p>When you choose an image for artwork or a profile, an app may request access to your photo library or open your device's image picker. Selected images are sent to Carsl when you upload or save them. You can manage permissions in your device settings; refusing image access may prevent image uploads.</p>
            <p>If you enable biometric sign-in in the publisher app, your operating system performs the biometric check. Carsl does not receive or store your fingerprint or face template.</p>
            <p>Saving a voice-command accessibility preference does not itself record audio. A country you enter in your profile and an IP address received by our server are different from permission to access your device's precise GPS location.</p>
          </section>
          <section id="security">
            <h2>5. Security</h2>
            <p>Carsl uses HTTPS for its production API connections, hashed server-side passwords, and authenticated access for restricted account functions. Published images and content are intended to be accessible to viewers. No system can guarantee absolute security; keep your device and credentials secure and contact us if you suspect unauthorised access.</p>
          </section>
          <section id="retention">
            <h2>6. How long information is kept</h2>
            <p>Account information, uploaded content, and saved activity are kept while needed to provide your account and the features you use. The period depends on the information, account status, and any support, security, dispute, or legal need. Unpublishing artwork, signing out, or suspending an account does not by itself erase its stored records.</p>
            <p>When handling a deletion request, we remove the account and associated personal information, subject to any necessary legal, fraud-prevention, or security retention. If an exception applies, we explain what must be retained, why, and for how long in our response. Backup copies, where present, may remain until the applicable backup cycle expires and are not used to restore a deleted account to normal service.</p>
          </section>
          <section id="choices">
            <h2>7. Your choices and account deletion</h2>
            <p>You can change available profile and preference settings in the app. You can also contact us to request access to, correction of, or deletion of your personal information, or to raise an objection or other privacy request available under the law that applies to you.</p>
            <div className="callout">
              <p><strong>Want to delete your account?</strong> Visit our <Link to="/delete-account">account deletion page</Link> for the email request steps. You do not need to reinstall the app or sign in to that webpage.</p>
            </div>
            <p>Send requests to <a href="mailto:carsl.ssfo@gmail.com">carsl.ssfo@gmail.com</a>, preferably from your registered email address, and specify whether they concern your publisher account, TV viewer account, or both. We may need to verify ownership before disclosing or deleting information. Do not send your password or sign-in codes.</p>
            <p>We respond without undue delay, explain the expected completion time after verifying the request, and follow any applicable legal deadlines. Removing information from Carsl cannot erase copies that other people have independently saved or shared.</p>
          </section>
          <section id="children">
            <h2>8. Children and privacy</h2>
            <p>If you are a parent or guardian and believe a child has provided personal information to Carsl without the authorisation required by applicable law, contact us at <a href="mailto:carsl.ssfo@gmail.com">carsl.ssfo@gmail.com</a>. We will review the request and take appropriate steps, including deletion where required.</p>
          </section>
          <section id="changes">
            <h2>9. Updates and contact</h2>
            <p>We may update this policy as Carsl's features and practices change. The date above identifies the latest revision. Where required, we will give additional notice of material changes.</p>
            <p><strong>Operator:</strong> Carsl<br /><strong>Privacy and account deletion:</strong> <a href="mailto:carsl.ssfo@gmail.com">carsl.ssfo@gmail.com</a></p>
          </section>
        </article>
      </div>
    </main>
    </LegalPageLayout>
  );
}
