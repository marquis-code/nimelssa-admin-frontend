import Swal from "sweetalert2";
import { useGetAllCandidates } from '@/composables/candidates/fetch';
import { candidatesApiFactory } from "@/apiFactory/candidates";
const { getAllCandidates } = useGetAllCandidates();
export const useDeleteCandidate = () => {
    const loading = ref(false)
    const deleteCandidate = (candidateId) => {
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
                const response = await candidatesApiFactory.$_delete_candidates(candidateId)
                Swal.fire("Deleted!", "Candidate has been deleted.", "success");
                getAllCandidates(); // Refresh the products list
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

      return { deleteCandidate, loading }
}