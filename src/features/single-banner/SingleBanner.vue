<script setup lang="ts">
import { TMDB_IMG } from "@/shared/api/tmdb";
import { computed } from "vue";
const props = defineProps<{
  backdrop_path?: string | null;
}>();
const imageUrl = computed(() => {
  if (props.backdrop_path)
    return TMDB_IMG.backdrop(props.backdrop_path, "w1280");

  return "";
});
</script>
<template>
  <div
    class="relative w-full h-96 bg-cover bg-center overflow-hidden"
    :style="{ backgroundImage: `url(${imageUrl})` }"
  >
    <div
      class="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20"
    ></div>
  </div>
</template>
