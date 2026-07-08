<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/utils/axios";
import InputField from "@/components/InputField.vue";
import NavLink from "@/components/NavLink.vue";
import useAuth from "@/utils/auth";

const { login } = useAuth();
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
    login(res.data.token, res.data.user);
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed";
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <nav>
    <div class="bg-green-300 flex px-3 py-2 justify-between items-center">
      <span class="text-green-800 font-bold ml-2">💰 Budget Tracker</span>

      <ul class="flex gap-1.5">
        <li><NavLink to="/" text="Home" /></li>
        <li><NavLink to="/register" text="Register" /></li>
      </ul>
    </div>
  </nav>
  <section
    class="flex items-center justify-center p-4 sm:p-6 bg-green-50 min-h-screen"
  >
    <div
      class="bg-white p-6 sm:p-8 rounded-lg w-full max-w-sm sm:max-w-md mx-4 sm:mx-0 shadow-md"
    >
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
        <div v-if="error" class="text-red-500 text-sm sm:text-base font">
          {{ error }}
        </div>
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
