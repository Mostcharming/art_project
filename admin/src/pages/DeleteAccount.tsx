import { Link } from "react-router-dom";
import LegalPageLayout from "../layouts/LegalPageLayout";

export default function DeleteAccount() {
  return (
    <LegalPageLayout
      title="Delete Your Account"
      description="Request deletion of your Carsl publisher account, CARSL TV viewer account, and associated personal data by contacting Carsl support."
    >
      <main className="page single-column" id="main">
      <div className="hero">
        <p className="eyebrow">Account &amp; data requests</p>
        <h1>Delete your Carsl account</h1>
        <p className="lead">Request deletion of your Carsl publisher account, CARSL TV viewer account, or both.</p>
        <p>You can make this request without signing into this website or reinstalling either app. Carsl handles requests through <a href="mailto:carsl.ssfo@gmail.com">carsl.ssfo@gmail.com</a>.</p>
      </div>
      <article aria-label="Account deletion instructions">
        <section id="request">
          <h2>1. Send your request</h2>
          <ol>
            <li>Email <a href="mailto:carsl.ssfo@gmail.com">carsl.ssfo@gmail.com</a>, preferably from the email address registered to your Carsl account.</li>
            <li>Use the subject <strong>Carsl account deletion request</strong>.</li>
            <li>State whether you want to delete your <strong>publisher account</strong>, <strong>TV viewer account</strong>, or <strong>both</strong>. Include the registered email address if it differs from the address you are writing from.</li>
          </ol>
          <a className="button" href="mailto:carsl.ssfo@gmail.com?subject=Carsl%20account%20deletion%20request&amp;body=Hello%20Carsl%2C%0D%0A%0D%0APlease%20delete%20my%20Carsl%20account%20and%20associated%20personal%20data.%0D%0A%0D%0AAccount%20type%20%28publisher%2C%20TV%20viewer%2C%20or%20both%29%3A%20%0D%0ARegistered%20email%20address%3A%20%0D%0A">Open email request</a>
          <p className="meta">This button opens a draft in your email app. You must send the email to submit the request. If no email app opens, copy the address and send the request using your usual email service.</p>
          <div className="callout"><p>Never include your password, verification code, or authentication token. If you no longer have access to your registered email, tell us so we can discuss an alternative ownership check.</p></div>
        </section>
        <section id="verification">
          <h2>2. We verify and process it</h2>
          <p>We verify account ownership before deleting information. We then confirm the scope and expected completion time, process the request without undue delay and within applicable legal deadlines, and send a completion response. Opening this page or sending an email does not immediately delete your account.</p>
        </section>
        <section id="data">
          <h2>3. What deletion covers</h2>
          <ul>
            <li><strong>Both account types:</strong> the account record, profile and profile image, sign-in credentials and verification/reset records, and saved account preferences.</li>
            <li><strong>Publisher accounts:</strong> associated uploaded artwork files, carousels, and publishing information. Deleting your publisher account removes its published content from Carsl.</li>
            <li><strong>TV viewer accounts:</strong> saved favourites, followed artists or publishers, search and viewing history, watch progress, feedback, and viewing or accessibility preferences.</li>
          </ul>
          <p>Publisher and viewer accounts are separate. Specify both if you use the same email for each and want both removed. Deleting an account ends access to its saved information. Uninstalling the app, logging out, or unpublishing content alone does not delete your account.</p>
        </section>
        <section id="retained">
          <h2>Information that may be retained</h2>
          <p>Limited information may need to be retained for legal obligations, resolving disputes, preventing fraud, or maintaining security. If this applies, our response will identify the information, the reason, and the retention period. Backup copies, where present, may remain until the applicable backup cycle expires and are not used to restore a deleted account to normal service.</p>
          <p>Copies other people have independently saved or shared are outside Carsl's control. For a request to delete specific information while keeping your account, use the same email address and describe the information concerned.</p>
          <p>Read our <Link to="/privacy-policy">privacy policy</Link> for details of how Carsl handles personal information.</p>
        </section>
      </article>
    </main>
    </LegalPageLayout>
  );
}
