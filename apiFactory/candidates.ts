import { axiosInstance } from "./axios.config";

export const candidatesApiFactory = {
  $_create_candidates(payload: Record<string, any>) {
    return axiosInstance.post("/candidate/create", payload);
  },

  $_update_candidates(id: string | number, payload: Record<string, any>) {
    return axiosInstance.patch(`/candidate/candidates/${id}`, payload);
  },

  $_fetch_candidates() {
    return axiosInstance.get("/candidate/all-candidates");
  },

  $_fetch_candidates_by_id(id: string | number) {
    return axiosInstance.get(`/candidate/${id}`);
  },

  $_delete_candidates(id: string | number) {
    return axiosInstance.delete(`/candidate/candidates/${id}`);
  },
};
