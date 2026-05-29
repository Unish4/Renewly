import { create } from "zustand";
import { subscriptionService } from "../services/subscription.service.js";
import toast from "react-hot-toast";

export const useSubscriptionStore = create((set, get) => ({
  subscriptions: [],
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

      const data = await subscriptionService.getAll(params);
      set({ subscriptions: data.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load subscriptions",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  addSubscription: async (formData) => {
    set({ isSubmitting: true });

    try {
      const data = await subscriptionService.create(formData);
      set((state) => ({
        subscriptions: [data.data, ...state.subscriptions],
      }));
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
      toast.success(`${data.data.name} updated`);
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
