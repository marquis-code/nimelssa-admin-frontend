import { userApiFactory } from "@/apiFactory/users";
import Swal from "sweetalert2";
import { useFetchAllUsers } from '@/composables/user/getAllUsers'
const route = useRoute();
export const useApproveMatric = () => {
    const { fetchUsers } =  useFetchAllUsers()
  const loading = ref(false);
  const approveMatricNumber = async (user: Record<string, any>) => {
    loading.value = true;
    Swal.fire({
        icon: "question",
        title: "Please Confirm",
        text: `Are you sure your want to approve user ${user.firstname} ${user.lastname} with Matric Number (${user.matric})`,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Approve.",
        cancelButtonText: "Nah, Just kidding",
        preConfirm: async () => {
          return await userApiFactory.approveMatric(user._id).catch((error: any) => {
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

  return { approveMatricNumber, loading };
};
