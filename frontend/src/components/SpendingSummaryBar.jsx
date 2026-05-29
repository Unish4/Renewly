import { formatCurrency } from "../utils/formatters.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";
import { TrendingUp } from "lucide-react";
import SpendingSummarySkeleton from "./SpendingSummarySkeleton.jsx";

export default function SpendingSummaryBar() {
  const { summary, isLoading } = useSubscriptionStore();

  // Show skeleton while loading
  if (isLoading) {
    return (
     <SpendingSummarySkeleton />
    );
  }

  if (!summary) return null;

  const activeCurrencies = Object.entries(summary).filter(
    ([, data]) => data.count > 0,
  );

  if (activeCurrencies.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={15} className="text-gray-400" />
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          Monthly spend
        </span>
      </div>

      <div className="flex flex-wrap gap-6">
        {activeCurrencies.map(([currency, data]) => (
          <div key={currency} className="flex flex-col">
            {/* Monthly total — the primary figure */}
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(data.monthly, currency)}
            </span>

            {/* Yearly total + subscription count */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-gray-400">
                {formatCurrency(data.yearly, currency)} / year
              </span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">
                {data.count} subscription{data.count !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
