import { Link } from "react-router-dom";
import carslLogo from "../assets/carsl.svg";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-10 flex justify-center">
          <img src={carslLogo} alt="CARSL" className="h-6" />
        </div>

        {/* 404 Content */}
        <div className="mb-8">
          <h1
            className="text-7xl font-bold text-brand-600 mb-4"
            style={{ fontFamily: "BankGothicBold" }}
          >
            404
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-gray-400 text-lg">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-brand-500"
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
          Back to Home
        </Link>

        {/* Decorative element */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
