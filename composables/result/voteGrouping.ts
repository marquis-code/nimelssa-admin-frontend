import { resultApiFactory } from "@/apiFactory/results";

export const useFetchVoteGrouping = () => {
  const resultGrouping = ref({});
  const loading = ref(false);
  const fetchVoteGroupingData = async () => {
    loading.value = true;
    try {
      const response = await resultApiFactory.groupVoteByLevel();
      resultGrouping.value = response.data;
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
    fetchVoteGroupingData()
  })

  return { fetchVoteGroupingData, resultGrouping, loading };
};
