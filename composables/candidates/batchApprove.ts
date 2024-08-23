import { userApiFactory } from "@/apiFactory/users";

export const useBatchApproveMatric = () => {
  const loading = ref(false);
  const matricList = ref([]);
  const batchApproveMatric = async () => {
    loading.value = true;
    try {
        const payload = {
            matricNumbers: matricList.value
        }
      const response = await userApiFactory.batchApproveMatric(payload);
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
  
  const setMatricNumbers = (data) => {
    matricList.value = data
  }

  return { batchApproveMatric, matricList, loading, setMatricNumbers };
};
