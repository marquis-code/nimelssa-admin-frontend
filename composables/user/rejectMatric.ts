import { userApiFactory } from "@/apiFactory/users";
import Swal from "sweetalert2";
import { useFetchAllUsers } from '@/composables/user/getAllUsers'
export const useRejectMatric = () => {
  const loading = ref(false);
  const { fetchUsers } =  useFetchAllUsers()
  const rejectMatricNumber = async (user: Record<string, any>) => {
    loading.value = true;
    Swal.fire({
        icon: "question",
        title: "Please Confirm",
        text: `Are you sure your want to reject user ${user.firstname} ${user.lastname} with Matric Number (${user.matric})`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Reject.",
        cancelButtonText: "Nah, Just kidding",
        preConfirm: async () => {
          return await userApiFactory.disApproveMatric(user._id).catch((error: any) => {
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
  return { rejectMatricNumber, loading };
};
