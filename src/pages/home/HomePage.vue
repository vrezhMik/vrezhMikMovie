<script setup lang="ts">
import GenreFilter from "@/features/genre-filter/GenreFilter.vue";
import MainMovieView from "@/features/main-movie/main-movie-view.vue";
</script>
<template>
  <main class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <GenreFilter />
      <MainMovieView />
    </div>
  </main>
</template>
