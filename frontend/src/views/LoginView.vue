<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/axios";
import InputField from "@/components/InputField.vue";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const handleLogin = async () => {
  try {
    error.value = "";
    loading.value = true;
    const res = await api.post("/auth/login", {
      email: email.value,
      password: password.value,
    });
    
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed";

  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <section
    class="flex items-center justify-center p-4 sm:p-6 bg-green-50 min-h-screen"
  >
    <div class="bg-white p-6 sm:p-8 rounded-lg  w-full max-w-sm sm:max-w-md mx-4 sm:mx-0 shadow-md">
      <form @submit.prevent="handleLogin" class="flex flex-col gap-3">
        <div class="flex gap-2">
          <InputField
            label="Email"
            type="email"
            placeholder="john@email.com"
            v-model="email"
          />
        </div>
        <div class="flex gap-2">
          <InputField
            label="Password"
            type="password"
            placeholder="********"
            v-model="password"
          />
        </div>
        <div v-if="error" class="text-red-500 text-sm">{{ error }}</div>
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          {{ loading ? "Logging in..." : "Login" }}
        </button>
      </form>
    </div>
  </section>
</template>
