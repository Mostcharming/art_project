import { useState } from "react";

interface BanUserModalProps {
  onClose?: () => void;
  onProceed?: (data: { reason: string }) => void | Promise<void>;
  isLoading?: boolean;
}

export default function BanUserModal({
  onClose,
  onProceed,
  isLoading = false,
}: BanUserModalProps) {
  const [reason, setReason] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const handleProceed = () => {
    setIsConfirming(true);
  };

  const handleConfirm = async () => {
    if (onProceed) {
      await onProceed({ reason });
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
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
            className="text-white text-center text-2xl font-bold tracking-wide"
            style={{
              fontFamily: "BankGothicBold",
            }}
          >
            {isConfirming ? "Are you sure?" : "Ban User"}
          </h2>

          {isConfirming ? (
            // Confirmation Screen
            <div className="flex flex-col gap-8 items-center justify-center py-8">
              <p className="text-base text-gray-300 text-center">
                Are you sure you want to ban this user? Please note that this
                action is irreversible.
              </p>

              {/* Buttons */}
              <div className="flex gap-4 w-full">
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className="flex-1 py-3 rounded-lg text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#F23C57" }}
                >
                  {isLoading ? "Processing..." : "Ban User"}
                </button>
                <button
                  onClick={() => handleCancel()}
                  className="flex-1 py-3 rounded-lg text-base font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
                  style={{
                    backgroundColor: "#333741",
                  }}
                >
                  No, Cancel
                </button>
              </div>
            </div>
          ) : (
            // Form Screen
            <div className="flex flex-col gap-8">
              {/* Reason for ban */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: "#CECFD2" }}
                >
                  Reason for ban
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
                    e.currentTarget.style.borderColor = "#F23C57";
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
                style={{ backgroundColor: "#F23C57" }}
              >
                {isLoading ? "Processing..." : "Proceed"}
              </button>
            </div>
          )}
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
