/* eslint-disable react-hooks/set-state-in-effect */
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import carslLogo from "../assets/carsl.svg";
import { useApiMutation } from "../hooks/useApiMutation";
import AuthLayout from "../layouts/AuthPageLayout";
import { useUserStore } from "../store";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const {
    forgotPasswordEmail,
    forgotPasswordToken,
    clearForgotPasswordSession,
  } = useUserStore();

  const { mutate: resetPassword, isPending } = useApiMutation({
    endpoint: "/admins/auth/reset-password",
    method: "POST",
  });

  useEffect(() => {
    if (!forgotPasswordEmail || !forgotPasswordToken) {
      navigate("/forgot-password");
    }
  }, [forgotPasswordEmail, forgotPasswordToken, navigate]);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [password]);

  const validatePasswords = () => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePasswords()) {
      return;
    }

    if (!forgotPasswordEmail || !forgotPasswordToken) {
      setError("Session expired. Please start again.");
      navigate("/forgot-password");
      return;
    }

    resetPassword(
      {
        email: forgotPasswordEmail,
        resetToken: forgotPasswordToken,
        newPassword: password,
      },
      {
        onSuccess: () => {
          clearForgotPasswordSession();
          navigate("/", { replace: true });
          const successDiv = document.createElement("div");
          successDiv.innerHTML = "Password reset successfully! Please log in.";
          successDiv.className =
            "fixed top-4 right-4 p-3 bg-green-500 bg-opacity-10 border border-green-500 text-green-400 rounded-lg text-sm";
          document.body.appendChild(successDiv);
          setTimeout(() => {
            successDiv.remove();
          }, 3000);
        },
        onError: (error) => {
          setError(
            error.message || "Failed to reset password. Please try again."
          );
        },
      }
    );
  };

  const handleGoBack = () => {
    clearForgotPasswordSession();
    navigate("/forgot-password");
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-600";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const isFormValid =
    password &&
    confirmPassword &&
    password === confirmPassword &&
    passwordStrength >= 3;

  return (
    <AuthLayout>
      <div className="flex items-center justify-center flex-1 min-h-screen w-full">
        <div className="w-full max-w-md px-6">
          <div className="mb-10 flex justify-center">
            <img src={carslLogo} alt="CARSL" className="h-6" />
          </div>

          <div className="mb-8 text-center">
            <h1
              className="mb-2 text-3xl font-bold text-white"
              style={{ fontFamily: "BankGothicBold" }}
            >
              Reset Password
            </h1>
            <p className="text-sm text-gray-400">
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500 bg-opacity-10 border border-red-500 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Enter your new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1 rounded ${
                          i < passwordStrength
                            ? getPasswordStrengthColor()
                            : "bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Strength:{" "}
                    <span className="text-white">
                      {getPasswordStrengthText()}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400">
                    • At least 8 characters{" "}
                    {password.length >= 8 && (
                      <span className="text-green-400">✓</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    • One uppercase letter{" "}
                    {/[A-Z]/.test(password) && (
                      <span className="text-green-400">✓</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    • One number{" "}
                    {/[0-9]/.test(password) && (
                      <span className="text-green-400">✓</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>

              {confirmPassword && (
                <p className="mt-2 text-xs">
                  {password === confirmPassword ? (
                    <span className="text-green-400">✓ Passwords match</span>
                  ) : (
                    <span className="text-red-400">
                      ✗ Passwords do not match
                    </span>
                  )}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isPending}
              className="w-full py-3 mt-6 font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  isFormValid && !isPending ? "#D8522E" : "#D8522E",
                opacity: isFormValid && !isPending ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (isFormValid && !isPending) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#c13d21";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#D8522E";
              }}
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleGoBack}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
