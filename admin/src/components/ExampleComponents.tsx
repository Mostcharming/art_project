/**
 * PRACTICAL EXAMPLE: Login Component
 *
 * This file demonstrates a real-world implementation of the useApiMutation hook
 * in a login form with proper error handling, loading states, and user feedback.
 */

import { useApiMutation } from "@/hooks";
import { useState } from "react";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export function LoginComponentExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Initialize the mutation
  const {
    mutate: login,
    isPending,
    error,
  } = useApiMutation<LoginResponse>({
    endpoint: "/api/auth/login",
    method: "POST",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Trigger the mutation with success/error handlers
    login(
      { email, password },
      {
        onSuccess: (response) => {
          // Store token
          if (response.token) {
            localStorage.setItem("authToken", response.token);
          }

          // Clear form
          setEmail("");
          setPassword("");

          // Redirect or show success message
          console.log("Login successful:", response.user.name);
          // navigate("/dashboard");
        },
        onError: (error) => {
          // Error is automatically captured in the `error` state
          console.error("Login failed:", error.message);
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            placeholder="john@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">Error</p>
            <p>{error.message}</p>
            {error.status && <p className="text-sm">Status: {error.status}</p>}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600 text-center">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-600">
          Sign up
        </a>
      </p>
    </div>
  );
}

/**
 * PRACTICAL EXAMPLE 2: File Upload Component
 */

export function FileUploadComponentExample() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const {
    mutate: uploadFile,
    isPending,
    data,
    error,
  } = useApiMutation({
    endpoint: "/api/upload",
    method: "POST",
    isFormData: true, // Critical for file uploads!
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", "profile");

    uploadFile(formData, {
      onSuccess: (response) => {
        console.log("File uploaded successfully:", response);
        setSelectedFile(null);
        setPreview("");
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 border border-gray-300 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Upload Profile Picture</h2>

      <div className="space-y-4">
        {/* File Input */}
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={isPending}
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />

        {/* Preview */}
        {preview && (
          <div>
            <p className="text-sm font-medium mb-2">Preview:</p>
            <img src={preview} alt="Preview" className="w-full rounded-md" />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error.message}
          </div>
        )}

        {/* Success Message */}
        {data && (
          <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            File uploaded successfully!
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
