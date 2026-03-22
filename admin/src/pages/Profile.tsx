import { ArrowLeft, Edit2, Eye, EyeOff, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";

export default function Profile() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstname: user?.firstname || "",
    lastname: user?.lastname || "",
    email: user?.email || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-orange-400 transition mb-8"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Go Back</span>
        </button>

        {/* Profile Header Section */}
        <div className="flex items-start gap-6 mb-12">
          {/* User Avatar */}
          <div className="relative">
            <div className="w-32 h-32 bg-gray-700 rounded-lg flex items-center justify-center">
              <User size={64} className="text-gray-500" />
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 p-3 rounded-lg transition transform hover:scale-105"
            >
              <Edit2 size={20} className="text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              {user?.firstname} {user?.lastname}
            </h1>
            <p className="text-lg text-gray-400">{user?.role}</p>
          </div>
        </div>

        {/* Edit Profile Section */}
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Profile Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border transition ${
                  isEditing
                    ? "bg-gray-800 border-orange-500 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    : "bg-gray-800 border-gray-700 text-gray-300 cursor-not-allowed"
                }`}
                placeholder="Enter your name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 rounded-lg border transition ${
                  isEditing
                    ? "bg-gray-800 border-orange-500 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    : "bg-gray-800 border-gray-700 text-gray-300 cursor-not-allowed"
                }`}
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        {/* Security Settings Section */}
        <div className="bg-gray-900 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Security Settings</h2>
            <button className="text-orange-500 hover:text-orange-400 transition text-sm font-medium">
              Change Password
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value="••••••••••••"
                disabled
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
