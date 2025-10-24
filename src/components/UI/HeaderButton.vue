<script setup lang="ts">
import type { Component } from "vue";

const props = defineProps<{
  icon: Component;
  method: () => void;
}>();
</script>
<template>
  <button @click="props.method()">
    <component v-if="props.icon" :is="props.icon"></component>
  </button>
</template>
