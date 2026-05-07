import { useState } from "react";

interface DismissReportModalProps {
  onClose?: () => void;
  onProceed?: (data: { unflaggedReason: string }) => void | Promise<void>;
  isLoading?: boolean;
}

export default function DismissReportModal({
  onClose,
  onProceed,
  isLoading = false,
}: DismissReportModalProps) {
  const [reason, setReason] = useState("");

  const handleProceed = async () => {
    if (onProceed) {
      await onProceed({ unflaggedReason: reason });
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
    >
      <div
        className="relative w-full max-w-[664px] mx-4 rounded-2xl p-6"
        style={{ backgroundColor: "#0C111D" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-white/10"
          aria-label="Close"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 7L7 17M7 7L17 17"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col gap-8">
          {/* Title */}
          <h2
            className="text-white text-2xl font-bold tracking-wide"
            style={{
              fontFamily: "BankGothicBold",
            }}
          >
            Dismiss Report
          </h2>

          {/* Form */}
          <div className="flex flex-col gap-8">
            {/* Reason for dismissal */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium"
                style={{ color: "#CECFD2" }}
              >
                Reason for dismissal
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter details"
                rows={5}
                className="w-full rounded-lg px-3.5 py-2.5 text-base font-normal outline-none resize-none transition-colors"
                style={{
                  backgroundColor: "#0C111D",
                  border: "1px solid #333741",
                  color: "white",
                  boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                  minHeight: "139px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#D8522E";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#333741";
                }}
              />
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceed}
              disabled={isLoading || !reason.trim()}
              className="w-full py-3 rounded-lg text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#D8522E" }}
            >
              {isLoading ? "Processing..." : "Dismiss Report"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        textarea::placeholder {
          color: #85888E;
        }
      `}</style>
    </div>
  );
}
