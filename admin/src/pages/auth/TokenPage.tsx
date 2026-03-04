import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import carslLogo from "../../assets/carsl.svg";
import { useApiMutation } from "../../hooks/useApiMutation";
import AuthLayout from "../../layouts/AuthPageLayout";
import { useUserStore } from "../../store";

export default function TokenPage() {
  const [tokenBoxes, setTokenBoxes] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(59);
  const navigate = useNavigate();
  const { adminEmail, setUser, clearSession } = useUserStore();
  const { mutate: verifyLoginToken, isLoading } = useApiMutation({
    endpoint: "/admins/auth/verify-login-token",
    method: "POST",
  });

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
      const nextInput = document.getElementById(`token-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !tokenBoxes[index] && index > 0) {
      const prevInput = document.getElementById(`token-${index - 1}`);
      prevInput?.focus();
    }
  };

  const token = tokenBoxes.join("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!adminEmail) {
      setError("Session expired. Please login again.");
      navigate("/");
      return;
    }

    if (token.length !== 4) {
      setError("Please enter all 4 digits.");
      return;
    }

    verifyLoginToken(
      { email: adminEmail, loginToken: token },
      {
        onSuccess: (response) => {
          if (response.data?.token) {
            const userData = {
              token: response.data.token,
              email: response.data.email || adminEmail,
              firstname: response.data.firstname || "",
              lastname: response.data.lastname || "",
              role: response.data.role || "admin",
            };
            setUser(userData);
          }
          clearSession();
          navigate("/dashboard");
        },
        onError: (error) => {
          setError(error.message || "Invalid token. Please try again.");
        },
      }
    );
  };

  const handleGoBack = () => {
    clearSession();
    navigate("/");
  };

  const getMaskedEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    const visibleChars = Math.max(1, Math.floor(localPart.length / 3));
    const maskedLocal =
      localPart.slice(0, visibleChars) +
      "*".repeat(localPart.length - visibleChars);
    return `${maskedLocal}@${domain}`;
  };

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
              Check Your email
            </h1>
            <p className="text-sm text-gray-400">
              We have sent a 4 digit code to {getMaskedEmail(adminEmail || "")}
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
            <div>
              <div className="flex gap-4 justify-center">
                {tokenBoxes.map((value, index) => (
                  <input
                    key={index}
                    id={`token-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleTokenInput(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-20 h-20 px-4 py-3 rounded-lg border-2 bg-gray-800 text-center text-5xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
                    style={{
                      borderColor: value ? "#D8522E" : "#6B7280",
                      color: value ? "white" : "#9CA3AF",
                    }}
                    placeholder={value ? "" : "0"}
                    required
                  />
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <p className="text-sm text-gray-400">
                  Resend code (
                  <span style={{ color: "#D8522E" }}>{countdown}s</span>)
                </p>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              type="submit"
              disabled={token.length !== 4 || isLoading}
              className="w-full py-3 mt-2 font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  token.length === 4 && !isLoading ? "#D8522E" : "#D8522E",
                opacity: token.length === 4 && !isLoading ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (token.length === 4 && !isLoading) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#c13d21";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#D8522E";
              }}
            >
              {isLoading ? "Confirming..." : "Confirm"}
            </button>

            {/* Back to Login Link */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleGoBack}
                className="text-white hover:text-gray-100 text-sm underline"
              >
                Back to Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
