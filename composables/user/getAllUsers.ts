import { ref, onMounted } from 'vue';
import { userApiFactory } from "@/apiFactory/users";

export const useFetchAllUsers = () => {
  const usersList = ref<any[]>([]);
  const loading = ref(false);

  const fetchUsers = async () => {
    loading.value = true;
    try {
      const response = await userApiFactory.getUsers();
      usersList.value = response?.data || [];
    } catch (error: any) {
      useNuxtApp().$toast.error(error.message || 'Something went wrong while fetching users.', {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
      return error;
    } finally {
      loading.value = false;
    }
  };


  const approvedUsers = computed(() => {
    return usersList.value.filter(user => user.isMatricApproved);
  });

  const notApprovedUsers = computed(() => {
    return usersList.value.filter(user => !user.isMatricApproved);
  });

  const usersByLevel = (level) => {
    return computed(() => {
      return usersList.value.filter(user => Number(user.level) === Number(level));
    });
  };

  onMounted(() => {
    fetchUsers();
  });

  return { usersList, fetchUsers, loading, approvedUsers, notApprovedUsers, usersByLevel };
};
