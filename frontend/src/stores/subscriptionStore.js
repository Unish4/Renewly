import { create } from "zustand";
import { subscriptionService } from "../services/subscription.service.js";
import toast from "react-hot-toast";

export const useSubscriptionStore = create((set, get) => ({
  subscriptions: [],
  summary: null,
  isLoading: false,
  isSubmitting: false,

  filters: {
    category: "",
    status: "active",
    search: "",
    sortBy: "createdAt",
    order: "desc",
  },

  fetchSubscriptions: async () => {
    set({ isLoading: true });
    try {
      const filters = get().filters;

      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== ""),
      );

      const [listData, summaryData] = await Promise.all([
        subscriptionService.getAll(params),
        subscriptionService.getSummary(),
      ]);

      set({ subscriptions: listData.data, summary: summaryData.data.summary });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load subscriptions",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  refreshSummary: async () => {
    try {
      const data = await subscriptionService.getSummary();
      set({ summary: data.data.summary });
    } catch {
      // Silent fail — summary is a display enhancement, not critical
    }
  },

  addSubscription: async (formData) => {
    set({ isSubmitting: true });

    try {
      const data = await subscriptionService.create(formData);
      set((state) => ({
        subscriptions: [data.data, ...state.subscriptions],
      }));
      get().refreshSummary();
      toast.success(`${data.data.name} added successfully`);
      return { success: true };
    } catch (error) {
      const fieldErrors = error.response?.data?.errors;
      if (!fieldErrors) {
        toast.error(
          error.response?.data?.message || "Failed to add subscription",
        );
      }
      return { success: false, fieldErrors };
    } finally {
      set({ isSubmitting: false });
    }
  },

  updateSubscription: async (id, formData) => {
    set({ isSubmitting: true });
    try {
      const data = await subscriptionService.update(id, formData);
      set((state) => ({
        subscriptions: state.subscriptions.map((sub) =>
          sub._id === id ? data.data : sub,
        ),
      }));
      get().refreshSummary();
      toast.success(`${data.data.name} updated`);
      return { success: true };
    } catch (error) {
      const fieldErrors = error.response?.data?.errors;
      if (!fieldErrors) {
        toast.error(
          error.response?.data?.message || "Failed to update subscription",
        );
      }
      return { success: false, fieldErrors };
    } finally {
      set({ isSubmitting: false });
    }
  },

  deleteSubscription: async (id) => {
    try {
      await subscriptionService.delete(id);
      set((state) => ({
        subscriptions: state.subscriptions.filter((sub) => sub._id !== id),
      }));
      get().refreshSummary();
      toast.success("Subscription deleted");
      return { success: true };
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete subscription",
      );
      return { success: false };
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().fetchSubscriptions();
  },

  resetFilters: () => {
    set({
      filters: {
        category: "",
        status: "active",
        search: "",
        sortBy: "createdAt",
        order: "desc",
      },
    });
    get().fetchSubscriptions();
  },
}));
