import { useEffect, useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";
import SubscriptionCard from "../components/SubscriptionCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import SubscriptionForm from "../components/SubscriptionForm.jsx";
import { CATEGORIES } from "../utils/categories.js";

export default function SubscriptionsPage() {
  const { subscriptions, isLoading, fetchSubscriptions, setFilter, filters } =
    useSubscriptionStore();

  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTimeout(() => setEditingSubscription(null), 200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Subscriptions
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            {subscriptions.length} active subscription
            {subscriptions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSubscription(null);
            setShowForm(true);
          }}
          className="group flex flex-none items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus
            size={16}
            className="transition-transform group-hover:rotate-90 duration-300"
          />
          <span className="whitespace-nowrap">Add new</span>
        </button>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1 relative group">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all font-medium placeholder:font-normal"
          />
        </div>

        {/* Category filter */}
        <div className="relative shrink-0 sm:w-48">
          <select
            value={filters.category}
            onChange={(e) => setFilter("category", e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all font-medium appearance-none cursor-pointer"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <SlidersHorizontal
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Subscription grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 sm:py-32 px-4 rounded-3xl bg-gray-50/50 border border-gray-100 border-dashed mt-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-3xl mb-5 transform -rotate-6">
            <span role="img" aria-label="clipboard">
              📋
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
            {filters.search || filters.category
              ? "No matches found"
              : "No subscriptions yet"}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
            {filters.search || filters.category
              ? "We couldn't find any subscriptions matching your current filters. Try adjusting them."
              : "Start tracking your recurring expenses by adding your first subscription."}
          </p>
          {!filters.search && !filters.category && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus size={16} /> Add your first subscription
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {subscriptions.map((sub) => (
            <SubscriptionCard
              key={sub._id}
              subscription={sub}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Add / Edit form modal */}
      <SubscriptionForm
        isOpen={showForm}
        onClose={handleCloseForm}
        initialData={editingSubscription}
      />
    </div>
  );
}
