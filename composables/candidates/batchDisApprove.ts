import { userApiFactory } from "@/apiFactory/users";

export const useBatchDisApproveMatric = () => {
  const loading = ref(false);
  const matricList = ref([]);
  const batchDisApproveMatric = async () => {
    loading.value = true;
    try {
        const payload = {
            matricNumbers: matricList.value
        }
      const response = await userApiFactory.batchDisApproveMatric(payload);
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
  
  const setMatricNumbers = (data: any) => {
    matricList.value = data
  }

  return { batchDisApproveMatric, matricList, loading, setMatricNumbers };
};
