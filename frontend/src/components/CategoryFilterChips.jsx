import * as Icons from "lucide-react";
import { CATEGORIES } from "../utils/categories.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

export default function CategoryFilterChips() {
  const { filters, setFilter } = useSubscriptionStore();
  const activeCategory = filters.category;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-4">
      <button
        onClick={() => setFilter("category", "")}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
          activeCategory === ""
            ? "bg-gray-900 text-white"
            : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
        }`}
      >
        All
      </button>

      {CATEGORIES.map((cat) => {
        const Icon = Icons[cat.icon];
        const isActive = activeCategory === cat.value;

        return (
          <button
            key={cat.value}
            onClick={() => setFilter("category", isActive ? "" : cat.value)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
            }`}
          >
            {Icon && <Icon size={12} />}
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
