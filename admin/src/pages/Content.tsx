export default function Content() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Content</h1>
          <p className="text-gray-400">Manage your content here.</p>
        </div>
        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
          Add Content
        </button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <span className="text-4xl">📋</span>
            </div>
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">
                Content Item {i}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Description of content item {i}
              </p>
              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-red-600 bg-opacity-20 hover:bg-opacity-30 text-red-400 rounded transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
