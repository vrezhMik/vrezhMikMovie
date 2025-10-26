<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import GenreFilter from "@/features/genre-filter/GenreFilter.vue";
import MainMovieView from "@/features/main-movie/main-movie-view.vue";

const route = useRoute();
const router = useRouter();
const selectedGenres = ref<number[]>([]);

onMounted(() => {
  const q = String(route.query.genres ?? "").trim();
  if (q) selectedGenres.value = q.split(",").map(Number).filter(Boolean);
});

watch(
  selectedGenres,
  (ids) => {
    router.replace({
      query: { ...route.query, genres: ids.length ? ids.join(",") : undefined },
    });
  },
  { deep: true }
);
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <div class="flex flex-col lg:flex-row gap-8">
      <GenreFilter v-model="selectedGenres" />
      <MainMovieView :genres="selectedGenres" />
    </div>
  </main>
</template>
