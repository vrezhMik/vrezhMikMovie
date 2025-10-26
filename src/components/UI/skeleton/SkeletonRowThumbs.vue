<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    count?: number;
    thumbClass?: string;
  }>(),
  {
    count: 6,
    thumbClass: "w-32 aspect-square rounded-xl",
  }
);
</script>
<template>
  <div class="flex gap-4 overflow-x-auto pb-4">
    <div v-for="n in count" :key="n" class="flex-shrink-0 snap-start">
      <SkeletonBlock :class="thumbClass" />
      <SkeletonBlock class="h-4 w-28 mt-2" rounded="rounded-md" />
    </div>
  </div>
</template>
