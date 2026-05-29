import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { CATEGORIES, BILLING_CYCLES, CURRENCIES } from "../utils/categories.js";
import { useSubscriptionStore } from "../stores/subscriptionStore.js";

export default function SubscriptionForm({
  isOpen,
  onClose,
  initialData = null,
}) {
  const { addSubscription, updateSubscription, isSubmitting } =
    useSubscriptionStore();

  const isEditing = Boolean(initialData);

  const [form, setForm] = useState(() => {
    return initialData
      ? {
          name: initialData.name || "",
          category: initialData.category || "",
          amount: initialData.amount || "",
          currency: initialData.currency || "NPR",
          billingCycle: initialData.billingCycle || "monthly",
          startDate: initialData.startDate
            ? new Date(initialData.startDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          description: initialData.description || "",
          website: initialData.website || "",
          sharedWith: initialData.sharedWith || 1,
          reminderEnabled: initialData.reminderEnabled ?? true,
        }
      : {
          name: "",
          category: "",
          amount: "",
          currency: "NPR",
          billingCycle: "monthly",
          startDate: new Date().toISOString().split("T")[0],
          description: "",
          website: "",
          sharedWith: 1,
          reminderEnabled: true,
        };
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    if (isOpen) {
      if (initialData) {
        setForm({
          name: initialData.name || "",
          category: initialData.category || "",
          amount: initialData.amount || "",
          currency: initialData.currency || "NPR",
          billingCycle: initialData.billingCycle || "monthly",
          startDate: initialData.startDate
            ? new Date(initialData.startDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          description: initialData.description || "",
          website: initialData.website || "",
          sharedWith: initialData.sharedWith || 1,
          reminderEnabled: initialData.reminderEnabled ?? true,
        });
      } else {
        setForm({
          name: "",
          category: "",
          amount: "",
          currency: "NPR",
          billingCycle: "monthly",
          startDate: new Date().toISOString().split("T")[0],
          description: "",
          website: "",
          sharedWith: 1,
          reminderEnabled: true,
        });
      }
      setFieldErrors({});
    }
  }

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear the error for a field as soon as the user starts typing in it
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.category) errors.category = "Category is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      errors.amount = "Enter a valid positive amount";
    if (!form.startDate) errors.startDate = "Start date is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run client-side validation first
    const localErrors = validate();
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }

    const payload = { ...form, amount: Number(form.amount) };

    const result = isEditing
      ? await updateSubscription(initialData._id, payload)
      : await addSubscription(payload);

    if (result.success) {
      onClose();
    } else if (result.fieldErrors) {
      const mapped = {};
      result.fieldErrors.forEach(({ field, message }) => {
        mapped[field] = message;
      });
      setFieldErrors(mapped);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-900 text-lg">
            {isEditing ? "Edit subscription" : "Add subscription"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Service name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Netflix, WorldLink, Claude"
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 ${
                fieldErrors.name
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, category: cat.value }));
                    setFieldErrors((prev) => ({
                      ...prev,
                      category: undefined,
                    }));
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    form.category === cat.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            {fieldErrors.category && (
              <p className="mt-1 text-xs text-red-500">
                {fieldErrors.category}
              </p>
            )}
          </div>

          {/* Amount + Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 bg-white"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.value}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                step="0.01"
                className={`flex-1 px-3.5 py-2.5 border rounded-xl text-sm outline-none transition-colors focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 ${
                  fieldErrors.amount
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200"
                }`}
              />
            </div>
            {fieldErrors.amount && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.amount}</p>
            )}
          </div>

          {/* Billing cycle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Billing cycle <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {BILLING_CYCLES.map((cycle) => (
                <button
                  key={cycle.value}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, billingCycle: cycle.value }))
                  }
                  className={`py-2 rounded-xl border text-xs font-medium transition-all ${
                    form.billingCycle === cycle.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {cycle.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Start / last renewal date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 ${
                fieldErrors.startDate
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {fieldErrors.startDate && (
              <p className="mt-1 text-xs text-red-500">
                {fieldErrors.startDate}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Next renewal date is computed automatically from this date.
            </p>
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Notes{" "}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              placeholder="e.g. Family plan shared with 3 people"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
                ? "Save changes"
                : "Add subscription"}
          </button>
        </form>
      </div>
    </div>
  );
}
