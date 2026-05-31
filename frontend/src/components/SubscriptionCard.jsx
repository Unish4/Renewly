import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  BellOff,
} from "lucide-react";
import CategoryBadge from "./CategoryBadge.jsx";
import RenewalBadge from "./RenewalBadge.jsx";
import ReminderToggle from "./ReminderToggle.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import { formatCycleLabel, formatDate } from "../utils/formatters.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

export default function SubscriptionCard({ subscription, onEdit }) {
  const { deleteSubscription, updateSubscription } = useSubscriptionStore();

  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const isPaused = subscription.status === "paused";
  const isMuted = !(subscription.reminderEnabled ?? true);

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteSubscription(subscription._id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const togglePause = async () => {
    await updateSubscription(subscription._id, {
      status: isPaused ? "active" : "paused",
    });
    setShowMenu(false);
  };

  return (
    <>
      <div
        className={`
        bg-white border rounded-2xl p-5 transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${isPaused ? "opacity-60 border-gray-100" : "border-gray-200"}
      `}
      >
        {/* ── Header  */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-2">
            {/* Name + status indicators */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate max-w-40">
                {subscription.name}
              </h3>
              {isPaused && (
                <span className="shrink-0 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  Paused
                </span>
              )}
              {isMuted && (
                <BellOff
                  size={12}
                  className="shrink-0 text-gray-300"
                  aria-label="Email reminders muted"
                />
              )}
            </div>

            <CategoryBadge category={subscription.category} />
          </div>

          {/* 3-dot menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className={`p-1.5 rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-gray-200 ${
                showMenu ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              aria-label="Options"
              aria-expanded={showMenu}
            >
              <MoreVertical size={16} className={`transition-colors ${showMenu ? "text-gray-800" : "text-gray-400"}`} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1.5 w-52 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <button
                  onClick={() => {
                    onEdit(subscription);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Edit2 size={16} className="shrink-0 text-gray-400" />
                  Edit subscription
                </button>

                <button
                  onClick={togglePause}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  {isPaused ? (
                    <>
                      <PlayCircle
                        size={16}
                        className="shrink-0 text-green-500"
                      />{" "}
                      Resume tracking
                    </>
                  ) : (
                    <>
                      <PauseCircle size={16} className="shrink-0 text-gray-400" /> Pause tracking
                    </>
                  )}
                </button>

                <ReminderToggle
                  subscription={subscription}
                  onClose={() => setShowMenu(false)}
                />

                <div className="border-t border-gray-100" />

                <button
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <Trash2 size={16} className="shrink-0 text-red-500" />
                  Delete subscription
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer: amount + renewal */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 leading-none mb-1.5">
              {formatCycleLabel(
                subscription.amount,
                subscription.currency,
                subscription.billingCycle,
              )}
            </p>
            {/* Renewal badge only shows when ≤7 days or overdue */}
            <RenewalBadge renewalDate={subscription.nextRenewalDate} />
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">Next renewal</p>
            <p className="text-xs font-semibold text-gray-700">
              {formatDate(subscription.nextRenewalDate)}
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete subscription?"
        message={`Permanently delete "${subscription.name}"? This cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}
