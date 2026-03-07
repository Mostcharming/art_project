export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Overview of your admin dashboard.</p>
      </div>

      {/* Dashboard content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Card 1 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white mt-2">1,234</p>
            </div>
            <div className="w-12 h-12 bg-brand-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-brand-400 text-xl">👥</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Content</p>
              <p className="text-2xl font-bold text-white mt-2">567</p>
            </div>
            <div className="w-12 h-12 bg-blue-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-blue-400 text-xl">📄</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Members</p>
              <p className="text-2xl font-bold text-white mt-2">89</p>
            </div>
            <div className="w-12 h-12 bg-green-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-green-400 text-xl">👑</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Revenue</p>
              <p className="text-2xl font-bold text-white mt-2">$4,231</p>
            </div>
            <div className="w-12 h-12 bg-purple-600 bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-purple-400 text-xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-700">
            <div>
              <p className="text-white font-medium">New user registered</p>
              <p className="text-sm text-gray-400">5 minutes ago</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-green-600 bg-opacity-20 text-green-400 rounded">
              New
            </span>
          </div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-700">
            <div>
              <p className="text-white font-medium">Content uploaded</p>
              <p className="text-sm text-gray-400">2 hours ago</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-blue-600 bg-opacity-20 text-blue-400 rounded">
              Upload
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Member joined</p>
              <p className="text-sm text-gray-400">1 day ago</p>
            </div>
            <span className="px-2 py-1 text-xs font-medium bg-purple-600 bg-opacity-20 text-purple-400 rounded">
              Member
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
