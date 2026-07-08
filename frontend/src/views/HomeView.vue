Homeview

<template>
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

        <div>
          <router-link
            to="/login"
            class="bg-green-600 px-10 py-3 rounded-lg hover:bg-green-400 text-white font-medium transition"
            >Login</router-link
          >
        </div>
      </div>
    </div>
  </section>
</template>
