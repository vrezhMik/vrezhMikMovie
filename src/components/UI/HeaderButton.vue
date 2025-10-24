<script setup lang="ts">
import type { Component } from "vue";

const props = defineProps<{
  icon: Component;
  method: () => void;
}>();
</script>
<template>
  <button
    @click="props.method()"
    class="inline-flex items-center justify-center font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu text-foreground hover:bg-card-hover h-10 w-10 relative rounded-full"
  >
    <component v-if="props.icon" :is="props.icon"></component>
  </button>
</template>
