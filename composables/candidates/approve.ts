import { candidatesApiFactory } from "@/apiFactory/candidates";

export const useBatchApprove = () => {
  const loading = ref(false);
  const approvedInfo = ref({}) as any;
  const matricNumbers = ref([]) as any
  const batchApprove = async () => {
    loading.value = true;
    try {
      const response = await candidatesApiFactory.$_batch_approve_matric(matricNumbers);
      approvedInfo.value = response.data;
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

  return { batchApprove, approvedInfo, loading };
};
