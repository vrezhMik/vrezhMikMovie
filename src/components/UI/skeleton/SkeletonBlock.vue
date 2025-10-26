<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    rounded?: string;
  }>(),
  {
    rounded: "rounded-xl",
  }
);
</script>

<template>
  <div
    :class="['relative overflow-hidden bg-muted/60', props.rounded]"
    aria-hidden="true"
  >
    <div
      class="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer motion-reduce:animate-none"
    />
  </div>
</template>
