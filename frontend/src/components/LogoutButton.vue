<script setup>
import useAuth from "@/utils/auth";

const { logout } = useAuth();
</script>

<template>
  <button
    @click="logout"
    class="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-full font-medium transition"
  >
    Logout
  </button>
</template>
