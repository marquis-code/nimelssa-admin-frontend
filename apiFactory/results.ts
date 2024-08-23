import { axiosInstance } from "./axios.config";

export const resultApiFactory = {
  getElectionResults() {
    return axiosInstance.get('/election/election-results');
  },
};
