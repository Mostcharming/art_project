import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import carslLogo from "../assets/carsl.svg";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
  };

  return (
    <div className="flex items-center justify-center flex-1 min-h-screen w-full">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <img src={carslLogo} alt="CARSL" className="h-6" />
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="mb-2 text-3xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: "BankGothicBold" }}
          >
            Welcome back
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Checkbox and Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-[#D8522E]"
              />
              <span className="text-gray-700 dark:text-gray-300">
                Remember for 30 days
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-white hover:text-gray-100"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!email || !password}
            className="w-full py-3 mt-6 font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: email && password ? "#D8522E" : "#D8522E",
              opacity: email && password ? 1 : 0.5,
            }}
            onMouseEnter={(e) => {
              if (email && password) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "#c13d21";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "#D8522E";
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
