import { useState } from "react";
import { useApiMutation } from "../hooks/useApiMutation";

const EyeOffIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.16196 3.39488C7.4329 3.35482 7.7124 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C14.1862 8.79343 13.8814 9.23807 13.4777 9.7203M4.48288 4.47669C3.0415 5.45447 2.06297 6.81292 1.61407 7.52352C1.52286 7.66791 1.47725 7.74011 1.45183 7.85099C1.43273 7.93426 1.43272 8.06563 1.45181 8.14891C1.47722 8.25979 1.52262 8.33168 1.61342 8.47545C2.36369 9.66344 4.59694 12.6667 8.00028 12.6667C9.37255 12.6667 10.5546 12.1784 11.5259 11.5177M2.00028 2L14.0003 14M6.58606 6.58579C6.22413 6.94772 6.00028 7.44772 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10C8.55256 10 9.05256 9.77614 9.41449 9.41421"
      stroke="#D2D6DB"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeOnIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.61407 8.47648C1.52286 8.33209 1.47725 8.25989 1.45183 8.14901C1.43273 8.06574 1.43272 7.93437 1.45181 7.85109C1.47722 7.74021 1.52262 7.66832 1.61342 7.52455C2.36369 6.33656 4.59694 3.33333 8.00028 3.33333C11.4036 3.33333 13.6369 6.33656 14.3871 7.52455C14.4779 7.66833 14.5233 7.74023 14.5488 7.85112C14.5678 7.93439 14.5678 8.06578 14.5487 8.14905C14.5233 8.25993 14.4776 8.3323 14.3861 8.47705C13.6358 9.66504 11.4026 12.6667 8.00028 12.6667C4.59694 12.6667 2.36369 9.66344 1.61407 8.47648Z"
      stroke="#D2D6DB"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00028 10C9.10485 10 10.0003 9.10457 10.0003 8C10.0003 6.89543 9.10485 6 8.00028 6C6.89571 6 6.00028 6.89543 6.00028 8C6.00028 9.10457 6.89571 10 8.00028 10Z"
      stroke="#D2D6DB"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
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
);

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        className="text-sm font-medium leading-5"
        style={{ color: "#CECFD2" }}
      >
        {label}
      </label>
      <div
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg w-full"
        style={{
          border: "1px solid #333741",
          background: "#0C111D",
          boxShadow: "0 1px 2px 0 rgba(16,24,40,0.05)",
        }}
      >
        <input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-base font-normal leading-6 outline-none min-w-0"
          style={{ color: value ? "#fff" : "#85888E" }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOnIcon /> : <EyeOffIcon />}
        </button>
      </div>
    </div>
  );
}

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { mutate: changePassword, isLoading } = useApiMutation<{
    message: string;
  }>({
    endpoint: "/admins/change-password",
    method: "POST",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Make API call
    changePassword(
      {
        oldPassword: currentPassword,
        newPassword: newPassword,
      },
      {
        onSuccess: () => {
          setSuccess("Password changed successfully");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(() => {
            onClose();
          }, 1500);
        },
        onError: (err) => {
          setError(err.message || "Failed to change password");
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: "rgba(0, 0, 0, 0.8)" }}
    >
      <div
        className="relative flex flex-col gap-8 w-full max-w-[664px] p-6 rounded-2xl"
        style={{ background: "#0C111D" }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 opacity-80 hover:opacity-100 transition-opacity"
          aria-label="Close"
        >
          <CloseIcon />
        </button>

        {/* Title */}
        <h1
          className="text-2xl font-bold tracking-wide uppercase"
          style={{
            fontFamily: "BankGothicBold",
            color: "#FFFFFF",
            letterSpacing: "0.04em",
          }}
        >
          Change Password
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Fields */}
          <div className="flex flex-col gap-6">
            <PasswordField
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />
            <PasswordField
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={setNewPassword}
            />
            <PasswordField
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-green-500 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 w-full py-3 px-4 rounded-lg text-base font-medium leading-6 text-white transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "#D8522E",
              border: "2px solid rgba(255,255,255,0.12)",
            }}
          >
            {isLoading ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
