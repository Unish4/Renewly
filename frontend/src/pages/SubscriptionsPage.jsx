import { useEffect, useState, useRef } from "react";
import { Plus, Search } from "lucide-react";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";
import SubscriptionCard from "../components/SubscriptionCard.jsx";
import SkeletonCard from "../components/SkeletonCard.jsx";
import SubscriptionForm from "../components/SubscriptionForm.jsx";
import SpendingSummaryBar from "../components/SpendingSummaryBar.jsx";
import CategoryFilterChips from "../components/CategoryFilterChips.jsx";
import { useDebounce } from "../utils/useDebounce.js";

export default function SubscriptionsPage() {
  const {
    subscriptions,
    isLoading,
    fetchSubscriptions,
    setFilter,
    filters,
    resetFilters,
  } = useSubscriptionStore();

  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

  const closeFormTimeoutRef = useRef(null);

  useEffect(() => {
    if (filters.search !== debouncedSearch) {
      setFilter("search", debouncedSearch);
    }
  }, [debouncedSearch, filters.search, setFilter]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    return () => {
      if (closeFormTimeoutRef.current) {
        clearTimeout(closeFormTimeoutRef.current);
      }
    };
  }, []);

  const handleEdit = (subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    if (closeFormTimeoutRef.current) {
      clearTimeout(closeFormTimeoutRef.current);
    }
    closeFormTimeoutRef.current = setTimeout(
      () => setEditingSubscription(null),
      200,
    );
  };

  const hasActiveFilters = filters.category || filters.search;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 -left-4 w-64 h-64 md:w-96 md:h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      <div className="absolute top-0 -right-4 w-64 h-64 md:w-96 md:h-96 bg-yellow-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-700 to-indigo-500 tracking-tight">
            Subscriptions
          </h1>
          <p className="text-sm font-medium text-gray-500 mt-2">
            {isLoading
              ? "Loading your subscriptions..."
              : `${subscriptions.length} active subscription${subscriptions.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSubscription(null);
            setShowForm(true);
          }}
          className="group flex flex-none items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-md hover:shadow-xl hover:-translate-y-1 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
        >
          <Plus
            size={18}
            className="transition-transform group-hover:rotate-90 duration-300"
          />
          <span className="whitespace-nowrap">Add new</span>
        </button>
      </div>

      <SpendingSummaryBar />

      {/* Search + filter bar */}
      <div className="flex w-full sm:w-1/2 lg:w-1/3 flex-col sm:flex-row gap-3 mb-8">
        <div className="flex-1 relative group">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
          />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm outline-none shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all font-medium placeholder:font-normal"
          />
        </div>

      </div>
        {/* Category filter */}
        <CategoryFilterChips />

      {/* Subscription grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-24 sm:py-32 px-4 rounded-3xl bg-white/50 backdrop-blur-sm border border-white/60 shadow-sm mt-8">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-3xl mb-5 transform -rotate-6">
            <div className="text-4xl mb-3">
              {hasActiveFilters ? "🔍" : "📋"}
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
            {hasActiveFilters ? "No matches found" : "No subscriptions yet"}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mb-8 leading-relaxed">
            {hasActiveFilters
              ? "We couldn't find any subscriptions matching your current filters. Try adjusting them."
              : "Start tracking your recurring expenses by adding your first subscription."}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={() => {
                setSearchInput("");
                resetFilters();
              }}
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Clear filters
            </button>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:shadow-lg transition-all duration-300"
            >
              <Plus size={16} /> Add your first subscription
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
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
    </div>
  );
}
