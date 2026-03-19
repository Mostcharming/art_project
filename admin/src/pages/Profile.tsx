import { useUserStore } from "../store/userStore";

export default function Profile() {
  const { user } = useUserStore();

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-white mb-6">Profile</h1>

      <div className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            First Name
          </label>
          <p className="text-white text-lg">{user?.firstname}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Last Name
          </label>
          <p className="text-white text-lg">{user?.lastname}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Email
          </label>
          <p className="text-white text-lg">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
