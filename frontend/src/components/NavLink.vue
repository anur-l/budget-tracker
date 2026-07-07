<script setup>
const props = defineProps({
  to: {
    type: String,
    require: true,
  },
  text: {
    type: String,
    require: true,
  },
});
</script>

<template>
  <router-link :to="to" class="inline-block bg-lime-500 p-1.5 rounded-2xl hover:bg-lime-700">
    {{ text }}
  </router-link>
</template>
