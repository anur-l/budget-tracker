<script setup>
import NavLink from "./NavLink.vue";
</script>

<template>
  <nav>
    <div class="bg-green-300 flex px-3 py-2 justify-end">
      <ul class="flex gap-1.5">
        <li><NavLink to="/" text="Home" /></li>
        <li><NavLink to="/login" text="Login" /></li>
        <!-- <li><NavLink to="/register" text="Register" /></li> -->
        <!-- <li><NavLink to="/dashboard" text="Dashboard" /></li> -->
      </ul>
    </div>
  </nav>
</template>
