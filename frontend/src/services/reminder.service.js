import api from "./api.js";

export const reminderService = {
  getUpcoming: async (days = 30) => {
    const response = await api.get("/subscriptions/upcoming", {
      params: { days },
    });
    return response.data;
  },

  // Returns active subscriptions whose nextRenewalDate is in the past.
  getOverdue: async () => {
    const response = await api.get("/subscriptions/overdue");
    return response.data;
  },
};
