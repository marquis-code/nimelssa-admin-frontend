import { axiosInstance } from "./axios.config";

export const userApiFactory = {
  getUsers() {
    return axiosInstance.get('/auth/users/');
  },
  approveMatric(id: any) {
    return axiosInstance.put(`/auth/users/${id}/approve-matric`);
  },
  disApproveMatric(id: any) {
    return axiosInstance.put(`/auth/users/${id}/disapprove-matric`);
  },
};
