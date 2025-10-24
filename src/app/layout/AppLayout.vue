<script setup lang="ts">
import AppHeader from "./AppHeader.vue";
</script>

<template>
  <AppHeader />
  <main class="container mx-auto px-4 py-8">
    <RouterView />
  </main>
</template>
