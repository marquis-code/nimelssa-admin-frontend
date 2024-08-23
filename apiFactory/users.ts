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
  deleteUser(id: string | number) {
    return axiosInstance.delete(`/auth/user/${id}`);
  },
  updateUser(id: string | number, payload: any) {
    return axiosInstance.patch(`/auth/user/${id}`, payload);
  },
  batchApproveMatric(payload: any) {
    return axiosInstance.post('/auth/batch-approve-matric', payload);
  },
  batchDisApproveMatric(payload: any) {
    return axiosInstance.post('/auth/batch-disapprove-matric', payload);
  },
};
