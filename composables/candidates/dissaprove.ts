import { candidatesApiFactory } from "@/apiFactory/candidates";

export const useBatchDisapprove = () => {
  const loading = ref(false);
  const disApprovedInfo = ref({}) as any;
  const matricNumbers = ref([]) as any
  const batchDisapprove = async () => {
    loading.value = true;
    try {
      const response = await candidatesApiFactory.$_batch_disapprove_matric(matricNumbers);
      disApprovedInfo.value = response.data;
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

  return { batchDisapprove, disApprovedInfo, loading };
};
