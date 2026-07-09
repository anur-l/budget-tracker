<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <div
    class="min-h-screen from-green-50 to-green-100 flex items-center justify-center p-4"
  >
    <div
      class="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center"
    >
      <h1 class="text-6xl font-bold text-green-600 mb-2">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>

      <div class="space-y-3">
        <button
          @click="goHome"
          class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-xl transition duration-200"
        >
          Go Home
        </button>

        <button
          @click="goBack"
          class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-xl transition duration-200"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>
