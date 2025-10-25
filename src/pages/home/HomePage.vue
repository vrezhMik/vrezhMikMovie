<script setup lang="ts">
import GenreFilter from "../../features/genre-filter/GenreFilter.vue";
import MainMovieView from "../../features/main-movie/main-movie-view.vue";
</script>
<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <GenreFilter />
    <MainMovieView />
  </div>
</template>
