<template>
  <div class="grid lg:grid-cols-3 gap-8 mb-12">
    <div class="lg:col-span-1">
      <SkeletonBlock class="w-full aspect-[2/3]" />
    </div>
    <div class="lg:col-span-2 space-y-6">
      <div class="space-y-3">
        <SkeletonBlock class="h-10 w-2/3" rounded="rounded-md" />
        <div class="flex items-center gap-3">
          <SkeletonBlock class="w-12 h-12" rounded="rounded-full" />
          <SkeletonBlock class="h-6 w-24" rounded="rounded-md" />
          <SkeletonBlock class="h-6 w-16" rounded="rounded-md" />
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <SkeletonBlock
          v-for="n in 4"
          :key="n"
          class="h-6 w-20"
          rounded="rounded-full"
        />
      </div>
      <div>
        <SkeletonBlock class="h-5 w-1/3 mb-3" rounded="rounded-md" />
        <SkeletonText :lines="3" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonBlock from "./SkeletonBlock.vue";
import SkeletonText from "./SkeletonText.vue";
</script>
