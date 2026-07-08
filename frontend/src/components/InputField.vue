<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
    default: "",
  },
});
defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-1 items-start sm:items-center">
    <label class="w-full sm:w-35 text-left text-sm sm:text-base font-medium text-gray-700">

      {{ label }}</label
    >
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"

    />
  </div>
</template>
