<script setup>
const props = defineProps({
  to: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <router-link
    :to="to"
    class="inline-block bg-white text-green-700 px-4 py-1.5 rounded-full font-medium hover:bg-green-50"
  >
    {{ text }}
  </router-link>
</template>
