import { userApiFactory } from "@/apiFactory/users";
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { useFetchAllUsers } from '@/composables/user/getAllUsers'

export const useUpdateUser = () => {
  const selectedUser = ref(null);
  const selectedUserId = ref('') as any;
  const showDropdown = ref(false);
  const loading = ref(false);
  const { fetchUsers } = useFetchAllUsers();
  // const { user } = useLogin()

  const form = ref({
    firstname: "",
    lastname: "",
    level: "",
    matric: "",
  });

  const errors = ref({
    firstname: "",
    lastname: "",
    level: "",
    matric: "",
  });

  const validateForm = () => {
    errors.value.firstname = form.value.firstname ? "" : "Name name is required";
    errors.value.lastname = form.value.lastname
      ? ""
      : "Last Name is required";
      errors.value.level = form.value.level
      ? ""
      : "Level is required";
    errors.value.matric = form.value.matric
      ? ""
      : "Matric is required";

    return (
      !errors.value.firstname &&
      !errors.value.lastname &&
      !errors.value.level &&
      !errors.value.matric
    );
  };

  const resetForm = () => {
    form.value = {
      firstname: "",
      lastname: "",
      level: "",
      matric: "",
    };
    errors.value = {
      firstname: "",
      lastname: "",
      level: "",
      matric: "",
    };
  };

  const editUser = async () => {
    if (!validateForm()) return;
    try {
      loading.value = true;
      const response = await userApiFactory.updateUser(selectedUserId.value, form.value);
      resetForm();
      useNuxtApp().$toast.success("User was successfully updated.", {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
    
      await fetchUsers(); // Add this line to refresh the candidate list
      return response;
    } catch (error) {
      useNuxtApp().$toast.error("Something went wrong!", {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
    } finally {
      loading.value = false;
    }
  };

  const setEditUser = (user: any) => {
    selectedUser.value = user;
    selectedUserId.value = user._id;
    form.value = { ...user };
    showDropdown.value = true;
  };
  
  return {
    editUser,
    resetForm,
    form,
    loading,
    errors,
    showDropdown,
    selectedUser,
    setEditUser,
  };
};
