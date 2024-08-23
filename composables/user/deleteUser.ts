import Swal from "sweetalert2";
import { useFetchAllUsers } from '@/composables/user/getAllUsers'
import { userApiFactory } from "@/apiFactory/users";
const { fetchUsers } = useFetchAllUsers();
export const useDeleteUser = () => {
    const loading = ref(false)
    const deleteUser = (userId) => {
        Swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!",
          preConfirm: async () => {
            try {
                loading.value = true;
                const response = await userApiFactory.deleteUser(userId)
                Swal.fire("Deleted!", "Usere has been deleted.", "success");
                fetchUsers(); // Refresh the products list
                return response;
              } catch (error) {
                useNuxtApp().$toast.error("Something went wrong!", {
                  autoClose: 5000,
                  dangerouslyHTMLString: true,
                });
              } finally {
                loading.value = false;
              }
          }
        }).then(() => {
          Swal.fire("Cancelled", "Action was cancelled", "info");
        })
      };

      return { deleteUser, loading }
}