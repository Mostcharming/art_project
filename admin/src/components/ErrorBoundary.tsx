import React, { type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-screen w-full">
            <div className="w-full max-w-md px-6 text-center">
              <h1 className="mb-4 text-2xl font-bold text-white">
                Oops! Something went wrong
              </h1>
              <p className="mb-6 text-gray-400">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 text-white rounded-lg transition-colors"
                style={{
                  backgroundColor: "#D8522E",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#c13d21";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "#D8522E";
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
