<script setup>
import NavLink from "./NavLink.vue";
</script>

<template>
  <nav>
    <div class="bg-emerald-600 flex px-3 py-2 justify-end-safe">


      <ul class="flex gap-1.5">
        <li><NavLink to="/" text="Home" /></li>
        <li><NavLink to="/register" text="Register" /></li>
        <li><NavLink to="/dashboard" text="Dashboard" /></li>
      </ul>
    </div>
  </nav>
</template>
