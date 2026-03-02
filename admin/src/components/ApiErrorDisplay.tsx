/**
 * API Error Handler & Display Components
 * Reusable components for handling and displaying API errors
 */

import { ApiMutationError } from "@/hooks";
import React from "react";

interface ApiErrorDisplayProps {
  error: ApiMutationError | null;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Simple error message display component
 * @example
 * const { error } = useApiMutation(...);
 * <ApiErrorDisplay error={error} onDismiss={() => reset()} />
 */
export function ApiErrorDisplay({
  error,
  onDismiss,
  className = "",
}: ApiErrorDisplayProps) {
  if (!error) return null;

  return (
    <div
      className={`p-4 mb-4 bg-red-50 border border-red-200 rounded-md ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error.message}</p>
            {error.status && (
              <p className="text-xs text-red-600 mt-1">
                Status Code: {error.status}
              </p>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Alert toast component for errors
 * @example
 * <ApiErrorToast error={error} />
 */
interface ApiErrorToastProps {
  error: ApiMutationError | null;
  duration?: number;
  position?: "top-right" | "top-center" | "bottom-right" | "bottom-center";
}

export function ApiErrorToast({
  error,
  duration = 5000,
  position = "top-right",
}: ApiErrorToastProps) {
  const [isVisible, setIsVisible] = React.useState(!!error);

  React.useEffect(() => {
    if (error) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), duration);
      return () => clearTimeout(timer);
    }
  }, [error, duration]);

  if (!error || !isVisible) return null;

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className="bg-red-600 text-white px-4 py-3 rounded-md shadow-lg">
        <p className="font-medium">{error.message}</p>
      </div>
    </div>
  );
}

/**
 * Inline error message for form fields
 * @example
 * const { error } = useApiMutation(...);
 * <ApiFieldError error={error} fieldName="email" />
 */
interface ApiFieldErrorProps {
  error: ApiMutationError | null;
  fieldName?: string;
  className?: string;
}

export function ApiFieldError({
  error,
  fieldName,
  className = "",
}: ApiFieldErrorProps) {
  if (!error) return null;

  return (
    <p className={`text-sm text-red-600 mt-1 ${className}`}>
      {fieldName && `${fieldName}: `}
      {error.message}
    </p>
  );
}

/**
 * Utility function to extract field-specific errors if available
 * Useful if your API returns field-specific error details
 */
export function getFieldError(
  error: ApiMutationError | null,
  fieldName: string
): string | null {
  if (!error) return null;

  // Check if error data has field-specific errors
  if (error.data?.errors && typeof error.data.errors === "object") {
    return error.data.errors[fieldName] || null;
  }

  // Check for validation errors
  if (error.data?.validation && typeof error.data.validation === "object") {
    return error.data.validation[fieldName] || null;
  }

  return null;
}

/**
 * Hook for managing error display state
 * @example
 * const { error, displayError, clearError } = useErrorDisplay();
 * const { mutate, error: apiError } = useApiMutation(...);
 *
 * useEffect(() => {
 *   if (apiError) displayError(apiError);
 * }, [apiError]);
 */
export function useErrorDisplay() {
  const [displayedError, setDisplayedError] =
    React.useState<ApiMutationError | null>(null);

  const displayError = (error: ApiMutationError) => {
    setDisplayedError(error);
  };

  const clearError = () => {
    setDisplayedError(null);
  };

  return {
    error: displayedError,
    displayError,
    clearError,
  };
}
