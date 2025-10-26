<script setup lang="ts">
import MovieList from "@/components/UI/MovieList.vue";
import TrendingCarousel from "@/features/trending/TrendingCarousel.vue";
</script>

<template>
  <div class="flex-1 min-w-0">
    <TrendingCarousel />
    <MovieList />
  </div>
</template>
