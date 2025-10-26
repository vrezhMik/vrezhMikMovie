<script setup lang="ts">
import SkeletonBlock from "./SkeletonBlock.vue";
</script>

<template>
  <div class="relative rounded-2xl overflow-hidden bg-card shadow-lg">
    <div class="relative aspect-[2/3] overflow-hidden">
      <SkeletonBlock class="w-full h-full rounded-none" />
      <div class="absolute top-3 left-3">
        <SkeletonBlock class="w-12 h-12" rounded="rounded-full" />
      </div>
      <div class="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <SkeletonBlock class="h-5 w-3/4" rounded="rounded-md" />
        <SkeletonBlock class="h-4 w-24" rounded="rounded-md" />
      </div>
    </div>
  </div>
</template>
