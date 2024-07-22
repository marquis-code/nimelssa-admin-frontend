<template>
    <main>
        <div class="lg:flex">
            <div class="lg:w-6/12 h-screen">
                <LoginComponent v-if="route.query.page === 'login'" @forgotPassword="setActiveTab"
                    @processAdminLogin="handleLogin" />
                <ForgotPasswordComponent v-else-if="route.query.page === 'forgot'"
                    @success="handleForgotPasswordSuccess" @redirectLogin="navigateToLogin" />
                <EmailSentSuccess v-else-if="route.query.page === 'success'" @redirectLogin="navigateToLogin" />
            </div>
            <div v-if="route.query.page === 'login' || route.query.page === 'forgot' || route.query.page === 'success'"
                class="lg:w-6/12 hidden lg:block h-screen">
                <section
                    class="relative hidden h-32 items-center justify-center bg-[#EBFFFF] lg:col-span-5 lg:flex lg:h-full xl:col-span-6">
                    <div class="absolute right-10 top-4 flex items-end justify-end">
                        <div class="flex items-center gap-x-10">
                            <!-- <NuxtLink to="/" class="no-underline text-gray-800">Terms</NuxtLink>
                            <NuxtLink to="/" class="no-underline text-gray-800">Privacy</NuxtLink> -->
                        </div>
                    </div>
                    <div class="flex flex-col items-center justify-center">
                        <p v-if="route.query.page === 'login'"
                            class="text-lg font-medium leading-loose tracking-wider py-0 my-0">
                            “Transforming data into actionable insights.”
                        </p>
                        <img
                        alt="Login Animated Image"
                        src="@/assets/img/transparent-logo.png"
                        class="object-cover object-center"
                      />
                        <div v-if="route.query.page === 'login'" class="">
                            <h2 class="mt-6 text-center text-2xl font-bold sm:text-3xl md:text-xl">
                                Read. Write . Create
                            </h2>
                            <p class="mt-0 text-center leading-relaxed text-[#737876]">
                                MY NIMELSSA, YOUR NIMELSSA, OUR NIMELSSA.
                            </p>
                        </div>
                        <p v-else-if="route.query.page === 'forgot'"
                            class="mt-4 text-center leading-relaxed text-[#737876]">
                            Easily retrieve your password via email recovery.
                        </p>
                        <div v-if="route.query.page === 'login'" class="flex w-full items-center justify-between pt-10">
                            <div>
                                <img src="@/assets/icons/arrow-left.svg" alt="" />
                            </div>
                            <div class="flex items-center justify-between gap-x-3">
                                <img src="@/assets/icons/active-eclipse.svg" alt="" />
                                <img src="@/assets/icons/eclipse.svg" alt="" />
                                <img src="@/assets/icons/eclipse.svg" alt="" />
                            </div>
                            <div>
                                <img src="@/assets/icons/arrow-right.svg" alt="" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <CoreLoadingSpinner :isLoading="isLoading" />
    </main>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/auth/login'
const { isLoggedIn } = useLogin()
const isLoading = ref(false)
const route = useRoute()
const router = useRouter()

onMounted(() => {
    const newQuery = { page: "login" };
    router.push({ path: "/auth", query: newQuery });
})

const handleLogin = (val) => {
    isLoading.value = true;
}

const setActiveTab = () => {
    const newQuery = { page: "forgot" };
    router.push({ query: newQuery });
}

const handleForgotPasswordSuccess = () => {
    const newQuery = { page: "success" };
    router.push({ query: newQuery });
}


const navigateToLogin = () => {
    const newQuery = { page: "login" };
    router.push({ query: newQuery });
}


if (isLoggedIn) {
    router.push('/dashboard')
}
</script>