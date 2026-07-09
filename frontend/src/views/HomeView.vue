<script setup>
import useAuth from "@/utils/auth";
import NavLink from "@/components/NavLink.vue";
import LogoutButton from "@/components/LogoutButton.vue";

const { isLogIn } = useAuth();
</script>
<template>
  <nav v-if="isLogIn">
    <div class="bg-green-300 flex px-3 py-2 justify-between items-center">
      <span class="text-green-800 font-bold ml-2">Budget Tracker</span>
      <ul class="flex gap-1.5">
        <li><NavLink to="/dashboard" text="Dashboard" /></li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  </nav>
  <nav v-else>
    <div class="bg-green-300 flex px-3 py-2 justify-between items-center">
      <span class="text-green-800 font-bold ml-2">Budget Tracker</span>

      <ul class="flex gap-1.5">
        <li><NavLink to="/register" text="Register" /></li>
        <li><NavLink to="/login" text="Login" /></li>
      </ul>
    </div>
  </nav>
  <section
    class="flex items-center justify-center p-6 bg-green-50 min-h-screen"
  >
    <div class="text-center max-w-2xl">
      <div
        class="bg-white p-8 rounded-lg shadow-md w-96 border-t-3 border-green-300"
      >
        <h1 class="mb-4 text-3xl font-bold text-center text-green-500">
          Budget Tracker
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Track your income and expenses easily.
        </p>

        <div v-if="!isLogIn" class="flex flex-col gap-1.5">
          <router-link
            to="/login"
            class="bg-green-600 px-10 py-3 rounded-lg hover:bg-green-400 text-white font-medium transition"
            >Login</router-link
          >
          <router-link
            to="/register"
            class="bg-green-600 px-10 py-3 rounded-lg hover:bg-green-400 text-white font-medium transition"
            >Register</router-link
          >
        </div>
        <div v-else>
          <router-link
            to="/dashboard"
            class="bg-green-600 px-10 py-3 rounded-lg hover:bg-green-400 text-white font-medium transition inline-block"
          >
            Go to Dashboard
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>
