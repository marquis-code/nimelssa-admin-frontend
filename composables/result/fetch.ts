import { resultApiFactory } from "@/apiFactory/results";

export const useFetchResults = () => {
  const electionResultsList = ref([]);
  const loading = ref(false);
  const fetchElectionResults = async () => {
    loading.value = true;
    try {
      const response = await resultApiFactory.getElectionResults();
      electionResultsList.value = response.data;
    } catch (error: any) {
      useNuxtApp().$toast.error(error.message, {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
      return error;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchElectionResults()
  })

  return { fetchElectionResults, electionResultsList, loading };
};
