import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import CategoryBadge from "./CategoryBadge.jsx";
import { formatCurrency, formatDate } from "../utils/formatters.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

export default function SubscriptionCard({ subscription, onEdit }) {
  const { deleteSubscription, updateSubscription } = useSubscriptionStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteSubscription(subscription._id);
    setIsDeleting(false);
    if (result?.success !== false) {
      setShowDeleteConfirm(false);
    }
  };
  const togglePause = async () => {
    const newStatus = subscription.status === "active" ? "paused" : "active";
    const result = await updateSubscription(subscription._id, {
      status: newStatus,
    });
    if (result?.success !== false) {
      setShowMenu(false);
    }
  };

  const isPaused = subscription.status === "paused";
  const firstLetter = subscription.name
    ? subscription.name.charAt(0).toUpperCase()
    : "?";

  return (
    <>
      <div
        className={`group relative overflow-hidden bg-white border rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-100 ${
          isPaused
            ? "opacity-75 grayscale-[0.5] border-gray-100 hover:grayscale-0"
            : "border-gray-200"
        }`}
      >
        {/* Soft decorative background gradient on hover */}
        {!isPaused && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-50 to-purple-50 rounded-full blur-3xl z-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
        )}

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3.5 mb-1 flex-1 min-w-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 text-gray-700 font-bold text-lg shadow-sm shrink-0">
                {firstLetter}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-bold text-gray-900 text-base truncate">
                    {subscription.name}
                  </h3>
                  {isPaused && (
                    <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider shrink-0">
                      Paused
                    </span>
                  )}
                </div>
                <CategoryBadge category={subscription.category} />
              </div>
            </div>

            {/* 3-dot menu */}
            <div className="relative ml-2 shrink-0" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  showMenu
                    ? "bg-blue-50 text-blue-600 shadow-inner"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                }`}
                aria-label="Options"
              >
                <MoreVertical size={18} />
              </button>

              {showMenu && (
                <div className="absolute right-0 top-9 bg-white/95 backdrop-blur-sm border border-gray-200/80 rounded-xl shadow-xl z-20 py-2 w-48 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => {
                      onEdit(subscription);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <Edit2 size={16} className="text-gray-400" /> Edit
                  </button>
                  <button
                    onClick={togglePause}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    {isPaused ? (
                      <PlayCircle size={16} className="text-emerald-500" />
                    ) : (
                      <PauseCircle size={16} className="text-amber-500" />
                    )}
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                  <hr className="my-1.5 border-gray-100 mx-2" />
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
                  >
                    <Trash2
                      size={16}
                      className="text-red-400 group-hover:text-red-600 transition-colors"
                    />{" "}
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Amount + renewal date */}
          <div className="flex items-end justify-between mt-5 pt-4 border-t border-gray-100/80">
            <div>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-black text-gray-900 tracking-tight">
                  {formatCurrency(subscription.amount, subscription.currency)}
                </p>
              </div>
              <p className="text-xs text-gray-500 capitalize block mt-0.5 font-medium tracking-wide">
                {subscription.billingCycle}
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">
                Next Renewal
              </p>
              <div className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200/60 shadow-sm">
                {!isPaused && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                )}
                <p className="text-xs font-bold text-gray-700">
                  {formatDate(subscription.nextRenewalDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete subscription?"
        message={`This will permanently delete "${subscription.name}". This action cannot be undone.`}
        isLoading={isDeleting}
      />
    </>
  );
}
