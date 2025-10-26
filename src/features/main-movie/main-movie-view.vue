<script setup lang="ts">
import MovieList from "@/components/UI/MovieList.vue";
import TrendingCarousel from "@/features/trending/TrendingCarousel.vue";

const props = defineProps<{ genres?: number[] }>();
</script>

<template>
  <div class="flex-1 min-w-0">
    <TrendingCarousel />
    <MovieList :genres="props.genres ?? []" />
  </div>
</template>
