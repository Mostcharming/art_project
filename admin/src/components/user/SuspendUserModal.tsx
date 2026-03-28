import { useState } from "react";
import { toast } from "sonner";

interface SuspendUserModalProps {
  onClose?: () => void;
  onProceed?: (data: {
    startDate: string;
    endDate: string;
    reason: string;
  }) => void | Promise<void>;
  isLoading?: boolean;
}

export default function SuspendUserModal({
  onClose,
  onProceed,
  isLoading = false,
}: SuspendUserModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const handleProceed = async () => {
    if (!startDate || !endDate || !reason.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (onProceed) {
      try {
        const loadingToast = toast.loading("Suspending user...");
        await onProceed({ startDate, endDate, reason });
        toast.dismiss(loadingToast);
        toast.success("User suspended successfully!");
      } catch (error) {
        toast.dismiss();
        toast.error(
          error instanceof Error ? error.message : "Failed to suspend user"
        );
      }
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
            Suspend User
          </h2>

          {/* Form */}
          <div className="flex flex-col gap-8">
            {/* Timeframe */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium"
                style={{ color: "#CECFD2" }}
              >
                Timeframe
              </label>
              <div className="flex gap-6">
                {/* Start Date */}
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 rounded-lg px-3.5 py-2.5 text-base font-normal outline-none transition-colors"
                  style={{
                    backgroundColor: "#0C111D",
                    border: "1px solid #333741",
                    color: "white",
                    boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#D8522E";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#333741";
                  }}
                />

                {/* End Date */}
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 rounded-lg px-3.5 py-2.5 text-base font-normal outline-none transition-colors"
                  style={{
                    backgroundColor: "#0C111D",
                    border: "1px solid #333741",
                    color: "white",
                    boxShadow: "0 1px 2px 0 rgba(16, 24, 40, 0.05)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#D8522E";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#333741";
                  }}
                />
              </div>
            </div>

            {/* Reason for suspension */}
            <div className="flex flex-col gap-1.5">
              <label
                className="text-sm font-medium"
                style={{ color: "#CECFD2" }}
              >
                Reason for suspension
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
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#D8522E" }}
            >
              {isLoading ? "Processing..." : "Proceed"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder,
        textarea::placeholder {
          color: #85888E;
        }
        
        input[type="date"] {
          color-scheme: dark;
          padding-right: 12px !important;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1) brightness(1.2);
          cursor: pointer;
          width: 20px;
          height: 20px;
          margin-right: 8px;
        }
        
        input[type="date"]::-webkit-outer-spin-button,
        input[type="date"]::-webkit-inner-spin-button {
          display: none;
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
