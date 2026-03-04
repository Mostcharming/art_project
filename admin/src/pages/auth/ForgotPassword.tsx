import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import carslLogo from "../../assets/carsl.svg";
import { useApiMutation } from "../../hooks/useApiMutation";
import AuthLayout from "../../layouts/AuthPageLayout";
import { useUserStore } from "../../store";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setForgotPasswordEmail } = useUserStore();

  const { mutate: requestPasswordReset, isPending } = useApiMutation({
    endpoint: "/admins/auth/forgot-password",
    method: "POST",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    requestPasswordReset(
      { email },
      {
        onSuccess: () => {
          setForgotPasswordEmail(email);
          navigate("/forgot-password/verify-token");
        },
        onError: (error) => {
          setError(
            error.message || "Failed to send reset email. Please try again."
          );
        },
      }
    );
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
              Forgot Password?
            </h1>
            <p className="text-sm text-gray-400">
              Enter your email address and we'll send you a code to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500 bg-opacity-10 border border-red-500 text-red-400 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!email || isPending}
              className="w-full py-3 mt-6 font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: email && !isPending ? "#D8522E" : "#D8522E",
                opacity: email && !isPending ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (email && !isPending) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#c13d21";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#D8522E";
              }}
            >
              {isPending ? "Sending..." : "Send Reset Code"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Remember your password?{" "}
              <Link
                to="/"
                className="text-white hover:text-gray-100 font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
