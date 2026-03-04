import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import carslLogo from "../../assets/carsl.svg";
import { useApiMutation } from "../../hooks/useApiMutation";
import AuthLayout from "../../layouts/AuthPageLayout";
import { useUserStore } from "../../store";

export default function ForgotPasswordTokenPage() {
  const [tokenBoxes, setTokenBoxes] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(59);
  const navigate = useNavigate();
  const {
    forgotPasswordEmail,
    setForgotPasswordToken,
    clearForgotPasswordSession,
  } = useUserStore();

  const { mutate: verifyResetToken, isPending: isVerifying } = useApiMutation({
    endpoint: "/admins/auth/verify-reset-token",
    method: "POST",
  });

  const { mutate: resendResetToken, isPending: isResending } = useApiMutation({
    endpoint: "/admins/auth/resend-reset-token",
    method: "POST",
  });

  useEffect(() => {
    if (!forgotPasswordEmail) {
      navigate("/forgot-password");
    }
  }, [forgotPasswordEmail, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleTokenInput = (index: number, value: string) => {
    const newValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const newTokenBoxes = [...tokenBoxes];
    newTokenBoxes[index] = newValue;
    setTokenBoxes(newTokenBoxes);

    if (newValue && index < 3) {
      const nextInput = document.getElementById(`reset-token-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !tokenBoxes[index] && index > 0) {
      const prevInput = document.getElementById(`reset-token-${index - 1}`);
      prevInput?.focus();
    }
  };

  const token = tokenBoxes.join("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!forgotPasswordEmail) {
      setError("Session expired. Please start again.");
      navigate("/forgot-password");
      return;
    }

    if (token.length !== 4) {
      setError("Please enter all 4 digits.");
      return;
    }

    verifyResetToken(
      { email: forgotPasswordEmail, resetToken: token },
      {
        onSuccess: (response) => {
          if (response.data?.token) {
            setForgotPasswordToken(response.data.token);
            navigate("/forgot-password/reset");
          }
        },
        onError: (error) => {
          setError(error.message || "Invalid token. Please try again.");
        },
      }
    );
  };

  const handleResendCode = () => {
    setError("");

    if (!forgotPasswordEmail) {
      setError("Session expired. Please start again.");
      navigate("/forgot-password");
      return;
    }

    resendResetToken(
      { email: forgotPasswordEmail },
      {
        onSuccess: () => {
          setError("");
          setCountdown(59);
          setTokenBoxes(["", "", "", ""]);
        },
        onError: (error) => {
          setError(error.message || "Failed to resend code. Please try again.");
        },
      }
    );
  };

  const handleGoBack = () => {
    clearForgotPasswordSession();
    navigate("/forgot-password");
  };

  const getMaskedEmail = (email: string) => {
    if (!email || !email.includes("@")) {
      return "";
    }
    const [localPart, domain] = email.split("@");
    const visibleChars = Math.max(1, Math.floor(localPart.length / 3));
    const maskedLocal =
      localPart.slice(0, visibleChars) +
      "*".repeat(Math.max(0, localPart.length - visibleChars));
    return `${maskedLocal}@${domain}`;
  };

  const canResend = countdown === 0;

  return (
    <AuthLayout>
      <div className="flex items-center justify-center flex-1 min-h-screen w-full">
        <div className="w-full max-w-md px-6">
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <img src={carslLogo} alt="CARSL" className="h-6" />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className="mb-2 text-3xl font-bold text-white"
              style={{ fontFamily: "BankGothicBold" }}
            >
              Check Your Email
            </h1>
            <p className="text-sm text-gray-400">
              We've sent a 4-digit code to{" "}
              <span className="font-medium text-white">
                {getMaskedEmail(forgotPasswordEmail || "")}
              </span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500 bg-opacity-10 border border-red-500 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Token Boxes */}
            <div className="flex gap-2 justify-center">
              {tokenBoxes.map((box, index) => (
                <input
                  key={index}
                  id={`reset-token-${index}`}
                  type="text"
                  value={box}
                  onChange={(e) => handleTokenInput(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className="w-14 h-14 text-2xl font-bold text-center border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="0"
                />
              ))}
            </div>

            {/* Resend Code */}
            <div className="text-center text-sm">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-brand-500 hover:text-brand-400 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? "Resending..." : "Resend Code"}
                </button>
              ) : (
                <p className="text-gray-400">
                  Didn't receive the code?{" "}
                  <span className="text-brand-500">Resend in {countdown}s</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={token.length !== 4 || isVerifying}
              className="w-full py-3 mt-6 font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  token.length === 4 && !isVerifying ? "#D8522E" : "#D8522E",
                opacity: token.length === 4 && !isVerifying ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (token.length === 4 && !isVerifying) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#c13d21";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#D8522E";
              }}
            >
              {isVerifying ? "Verifying..." : "Verify Code"}
            </button>
          </form>

          {/* Back Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleGoBack}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to Email
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
