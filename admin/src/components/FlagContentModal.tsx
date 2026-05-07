import { useState } from "react";
import { useApiMutation } from "../hooks";

const FLAG_OPTIONS = [
  "Copyright or Ownership Concern",
  "Mature Content",
  "Violence or Disturbing Imagery",
  "Illegal or Prohibited Content",
  "Spam or Promotional Content",
  "Duplicate or Repetitive Content",
  "Other",
];

interface FlagContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  carouselId: string;
  onFlagSuccess?: () => void;
}

export default function FlagContentModal({
  isOpen,
  onClose,
  carouselId,
  onFlagSuccess,
}: FlagContentModalProps) {
  const [selected, setSelected] = useState<string>("Mature Content");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const flagContentMutation = useApiMutation({
    endpoint: `/admins/carousels/${carouselId}/flag`,
    method: "POST",
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await flagContentMutation.mutateAsync({
        status: "flagged",
        reason: selected,
        additionalInfo: additionalInfo,
      });

      // Reset form on success
      setSelected("Mature Content");
      setAdditionalInfo("");

      // Call the success callback
      if (onFlagSuccess) {
        onFlagSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Error flagging content:", error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-[535px] bg-gray-900 rounded-2xl p-6 flex flex-col gap-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 7L7 17M7 7L17 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col gap-9 pr-6">
          {/* Title */}
          <h2
            className="text-white text-2xl font-bold uppercase tracking-wider"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Flag Content
          </h2>

          {/* Form */}
          <div className="flex flex-col gap-8">
            {/* Radio Options */}
            <div className="flex flex-col gap-6">
              {FLAG_OPTIONS.map((option) => {
                const isSelected = selected === option;
                return (
                  <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className="flex items-center gap-4 text-left group"
                  >
                    {/* Radio Circle */}
                    <div
                      className={[
                        "w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors",
                        isSelected
                          ? "bg-orange-500"
                          : "border border-gray-400 bg-transparent",
                      ].join(" ")}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    {/* Label */}
                    <span className="text-white text-base font-normal leading-normal">
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="flex flex-col gap-2">
              <label className="text-white/70 text-sm">
                Additional Information
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="Tell us more"
                rows={5}
                className="w-full bg-transparent border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm resize-none focus:outline-none focus:border-white/40 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={flagContentMutation.isPending}
          className="w-full bg-orange-500 text-white font-semibold text-base py-4 rounded-xl hover:opacity-90 active:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {flagContentMutation.isPending ? "Submitting..." : "Submit"}
        </button>

        {/* Error Message */}
        {flagContentMutation.isError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <p className="text-red-400 text-sm">
              {flagContentMutation.error?.message ||
                "Failed to flag content. Please try again."}
            </p>
          </div>
        )}

        {/* Success Message */}
        {flagContentMutation.isSuccess && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-3">
            <p className="text-green-400 text-sm">
              Content flagged successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
