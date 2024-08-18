import Swal from "sweetalert2";
import { candidatesApiFactory } from "@/apiFactory/candidates";
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { useLogin } from '@/composables/auth/login'
import { useGetAllCandidates } from '@/composables/candidates/fetch'

export const useUpdateCandidate = () => {
  const selectedCandidate = ref(null);
  const selectedCandidateId = ref('') as any;
  const showDropdown = ref(false);
  const loading = ref(false);
  const { getAllCandidates } = useGetAllCandidates()
  // const { user } = useLogin()


  const levelList = ref([
    {
        name: '200 Level',
        code: '200'
    },
    {
        name: '300 Level',
        code: '300'
    },
    {
        name: '400 Level',
        code: '400'
    },
    {
        name: '500 Level',
        code: '500'
    }
])

const positionsList = ref([
    {
        name: 'President',
        code: 'PRESIDENT'
    },
    {
        name: 'Vice President',
        code: 'VICE_PRESIDENT'
    },
    {
        name: 'Academic Secretary',
        code: 'ACADEMIC_SECRETARY'
    },
    {
        name: 'General Secretary',
        code: 'GENERAL_SECRETARY'
    },
    {
        name: 'Assistant General Secretary',
        code: 'ASSISTANT_GENERAL_SECRETARY'
    },
    {
        name: 'Financial Secretary',
        code: 'FINANCIAL_SECRETARY'
    },
    {
        name: 'Treasurer',
        code: 'TREASURER'
    },
    {
        name: 'Public Relations Officer',
        code: 'PUBLIC_RELATIONS_OFFICER'
    },
    {
        name: 'Social Secretary',
        code: 'SOCIAL_SECRETARY'
    },
    {
        name: 'Sport Secretary',
        code: 'SPORT_SECRETARY'
    },
    {
        name: 'Senate 200 Level',
        code: 'SENATE_200'
    },
    {
        name: 'Senate 300 Level',
        code: 'SENATE_300'
    },
    {
        name: 'Senate 400 Level',
        code: 'SENATE_400'
    },
    {
        name: 'Senate 500 Level',
        code: 'SENATE_500'
    }
])

  const form = ref({
    name: "",
    position: "",
    level: "",
    quote: "",
    image: null,
    imageUrl: "",
  });

  const errors = ref({
    name: "",
    position: "",
    level: "",
    quote: "",
  });

  const validateForm = () => {
    errors.value.name = form.value.name ? "" : "Candidate name is required";
    errors.value.position = form.value.position
      ? ""
      : "Position is required";
      errors.value.level = form.value.level
      ? ""
      : "Level is required";
    errors.value.quote = form.value.quote
      ? ""
      : "Quote is required";

    return (
      !errors.value.name &&
      !errors.value.position &&
      !errors.value.level &&
      !errors.value.quote
    );
  };

  const resetForm = () => {
    form.value = {
      name: "",
      position: "",
      level: "",
      quote: "",
      image: null,
      imageUrl: "",
      file: ''
    };
    errors.value = {
      name: "",
      position: "",
      level: "",
      quote: "",
    };
  };

  const updateCandidate = async () => {
    if (!validateForm()) return;
    try {
      loading.value = true;
      const response = await candidatesApiFactory.$_update_candidates(selectedCandidateId.value, form.value);
      resetForm();
      useNuxtApp().$toast.success("Candidate was successfully updated.", {
        autoClose: 5000,
        dangerouslyHTMLString: true,
      });
    
      await getAllCandidates(); // Add this line to refresh the candidate list
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

  const setEditCandidate = (candidate: any) => {
    selectedCandidate.value = candidate;
    selectedCandidateId.value = candidate._id;
    form.value = { ...candidate, imageUrl: candidate.image || '' };
    showDropdown.value = true;
  };
  
  return {
    updateCandidate,
    resetForm,
    form,
    loading,
    errors,
    showDropdown,
    setEditCandidate,
  };
};
