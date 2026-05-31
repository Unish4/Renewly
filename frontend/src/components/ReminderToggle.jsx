import { Bell, BellOff } from "lucide-react";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

export default function ReminderToggle({ subscription, onClose }) {
  const { updateSubscription } = useSubscriptionStore();

  const isEnabled = subscription.reminderEnabled ?? true;

  const handleToggle = async () => {
    await updateSubscription(subscription._id, { reminderEnabled: !isEnabled });
    onClose?.();
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
    >
      {isEnabled ? (
        <>
          <BellOff size={16} className="text-gray-400 shrink-0" />
          <span className="text-gray-700">Mute email reminders</span>
        </>
      ) : (
        <>
          <Bell size={16} className="text-orange-500 shrink-0" />
          <span className="text-orange-700">Enable reminders</span>
        </>
      )}
    </button>
  );
}
