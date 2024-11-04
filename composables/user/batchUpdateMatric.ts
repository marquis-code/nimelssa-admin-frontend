import { userApiFactory } from "@/apiFactory/users";
import { useFetchAllUsers } from '@/composables/user/getAllUsers'
import Swal from "sweetalert2";
const route = useRoute();
export const useBatchUpdateMatric = () => {
  const loading = ref(false);
  const { fetchUsers } =  useFetchAllUsers()
  const updateMatricNumbers = async (payload) => {
    loading.value = true;
    Swal.fire({
        icon: "question",
        title: "Please Confirm",
        text: `Are you sure your want to update the selected users with the matric numbers`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Approve.",
        cancelButtonText: "Nah, Just kidding",
        preConfirm: async () => {
          return await userApiFactory.batchUpdateMatric(payload).catch((error: any) => {
            const msg = error.response && error.response.data ? error.response.data.message : "An error occurred, please try again.";
            Swal().showValidationMessage(msg);
            loading.value = false
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then(async (result) => {
        if (result.isConfirmed) {
            await fetchUsers()
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Action successful!",
            showCloseButton: true,
          });
          loading.value = false
        }
      });
  };

  return { updateMatricNumbers, loading };
};
