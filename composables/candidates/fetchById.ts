import { candidatesApiFactory } from "@/apiFactory/candidates";

export const useGetSponsoredAdById = () => {
  const loading = ref(false);
  const candidate = ref(null);
  const getSponsoredAdById = async (id: string) => {
    loading.value = true;
    try {
      const response = await candidatesApiFactory.$_fetch_candidates_by_id(id);
      candidate.value = response.data;
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

  return { getSponsoredAdById, candidate, loading };
};
