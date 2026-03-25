interface ConfirmModalProps {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  title = "Are you sure?",
  description = "This will revoke this team member's access to Carsl",
  confirmLabel = "Remove Team Member",
  cancelLabel = "No, Cancel",
  onConfirm,
  onCancel,
  onClose,
  isLoading = false,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161B26] rounded-lg border border-[#333741] w-full max-w-md mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose ?? onCancel}
          className="absolute right-4 top-4 p-1 hover:bg-[#1F2636] rounded-lg transition-colors"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
        <div className="p-6 flex flex-col items-center text-center">
          <div className="mb-6 max-w-xs">
            <h2
              className="text-white text-xl font-semibold mb-2"
              style={{ fontFamily: "BankGothicBold" }}
            >
              {title}
            </h2>
            <p className="text-[#94969C] text-sm">{description}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-6 py-1.5 rounded-lg bg-red-400 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isLoading ? "Removing..." : confirmLabel}
            </button>
            <button
              onClick={onCancel ?? onClose}
              disabled={isLoading}
              className="px-6 py-1.5 rounded-lg border border-[#333741] bg-[#1F2636] text-white text-sm font-semibold hover:bg-[#262d3d] disabled:opacity-50 transition-colors"
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
