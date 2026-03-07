export default function Members() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Members</h1>
          <p className="text-gray-400">View and manage members.</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
          Add Member
        </button>
      </div>

      {/* Members stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Members</p>
          <p className="text-3xl font-bold text-white mt-2">156</p>
          <p className="text-xs text-green-400 mt-2">↑ 12 this month</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-3xl font-bold text-white mt-2">143</p>
          <p className="text-xs text-gray-400 mt-2">91.7% of total</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <p className="text-gray-400 text-sm">Inactive</p>
          <p className="text-3xl font-bold text-white mt-2">13</p>
          <p className="text-xs text-gray-400 mt-2">8.3% of total</p>
        </div>
      </div>

      {/* Members list */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                  Member {i}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  member{i}@example.com
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  Jan {i}, 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 py-1 text-xs font-medium bg-green-600 bg-opacity-20 text-green-400 rounded">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button className="text-brand-400 hover:text-brand-300">
                    Edit
                  </button>
                  <span className="text-gray-600">•</span>
                  <button className="text-red-400 hover:text-red-300">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
