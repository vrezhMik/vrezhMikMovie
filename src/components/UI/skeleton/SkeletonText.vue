<script setup lang="ts">
import SkeletonBlock from "./SkeletonBlock.vue";
const props = withDefaults(defineProps<{ lines?: number; class?: string }>(), {
  lines: 3,
});
</script>

<template>
  <div class="space-y-2" aria-hidden="true">
    <SkeletonBlock
      v-for="n in props.lines"
      :key="n"
      class="h-4"
      :class="[
        { 'w-11/12': n === props.lines, 'w-full': n !== props.lines },
        props.class,
      ]"
      rounded="rounded-md"
    />
  </div>
</template>
