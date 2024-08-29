import { axiosInstance } from "./axios.config";

export const resultApiFactory = {
  getElectionResults() {
    return axiosInstance.get('/election/election-results');
  },
  groupVoteByLevel() {
    return axiosInstance.get('/election/votes-by-level');
  },
};
