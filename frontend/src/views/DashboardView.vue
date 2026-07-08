<script setup>
import NavLink from "@/components/NavLink.vue";
import LogoutButton from "@/components/LogoutButton.vue";
</script>

<template>
  <nav>
    <div class="bg-green-300 flex px-3 py-2 justify-between items-center">
      <span class="text-green-800 font-bold ml-2">Budget Tracker</span>
      <ul class="flex gap-1.5">
        <li><NavLink to="/" text="Home" /></li>
        <li>
          <LogoutButton />
        </li>
      </ul>
    </div>
  </nav>
  <p>Welcome {{ info }}</p>
</template>
