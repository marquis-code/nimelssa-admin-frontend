import { candidatesApiFactory } from "@/apiFactory/candidates";

export const useGetAllCandidates = () => {
  const loading = ref(false);
  const candidates = ref([]) as any;
  const getAllCandidates = async () => {
    loading.value = true;
    try {
      const response = await candidatesApiFactory.$_fetch_candidates();
      candidates.value = response.data;
      return response;
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
    getAllCandidates()
  })

  return { getAllCandidates, candidates, loading };
};
