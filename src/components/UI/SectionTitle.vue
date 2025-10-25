<script setup lang="ts">
import type { Component } from "vue";

const props = defineProps<{
  title: string;
  description: string;
  icon: Component;
  icon_style?: string;
}>();
</script>

<template>
  <div class="flex items-center gap-3 mb-2">
    <div :class="['p-2 rounded-lg ', props.icon_style]">
      <component v-if="props.icon" :is="props.icon" />
    </div>

    <div>
      <h2 class="text-3xl font-display font-bold text-foreground">
        {{ props.title }}
      </h2>
      <p class="text-muted-foreground">{{ props.description }}</p>
    </div>
  </div>
</template>
