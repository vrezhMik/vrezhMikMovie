<script setup lang="ts">
import GenreFilter from "../../features/genre-filter/GenreFilter.vue";
import MovieList from "../../features/movie-list/MovieList.vue";
</script>
<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <GenreFilter />
    <MovieList />
  </div>
</template>
