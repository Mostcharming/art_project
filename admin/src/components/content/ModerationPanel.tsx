import { ModerationProvider } from "../../contexts/ModerationContext";
import PendingApprovalSection from "./contentManangment/PendingApproval";
import ReportedContentSection from "./contentManangment/ReprotedContent";

export default function Index() {
  return (
    <ModerationProvider>
      <div className="min-h-screen">
        <div className="flex flex-col gap-20">
          <PendingApprovalSection />
          <ReportedContentSection />
        </div>
      </div>
    </ModerationProvider>
  );
}
