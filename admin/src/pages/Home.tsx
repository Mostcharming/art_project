import { Link } from "react-router-dom";
import carslLogo from "../assets/carsl.svg";
import AuthLayout from "../layouts/AuthPageLayout";

export default function Home() {
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
              Welcome to CARSL
            </h1>
            <p className="text-sm text-gray-400">
              Your premium admin dashboard awaits
            </p>
          </div>

          {/* Features Section */}
          <div className="space-y-4 mb-8">
            <div className="p-4 rounded-lg border border-gray-700 bg-gray-800 bg-opacity-50">
              <h3 className="text-white font-semibold mb-1">Coming Soon</h3>
              <p className="text-sm text-gray-400">
                We're building something amazing. The full landing page is
                coming soon!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-center">
                <div className="text-xl mb-1">📊</div>
                <p className="text-xs text-gray-300">Dashboard</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-center">
                <div className="text-xl mb-1">👥</div>
                <p className="text-xs text-gray-300">Publishers</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-800 border border-gray-700 text-center">
                <div className="text-xl mb-1">📝</div>
                <p className="text-xs text-gray-300">Content</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            to="/admin"
            className="w-full py-3 mt-6 font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 block text-center"
            style={{
              backgroundColor: "#D8522E",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#c13d21";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                "#D8522E";
            }}
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
