export default function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
        <div className="h-7 bg-gray-100 rounded-full w-24" />
      </div>
      <div className="flex items-end justify-between">
        <div className="h-6 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-100 rounded w-16" />
      </div>
    </div>
  );
}
