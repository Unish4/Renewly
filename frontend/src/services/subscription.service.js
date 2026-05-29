import api from "./api.js";

export const subscriptionService = {
  // Accepts a params object for filtering: { category, status, search, sortBy, order }
  getAll: async (params = {}) => {
    const response = await api.get("/subscriptions", { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/subscriptions", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/subscriptions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },
};
