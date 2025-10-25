<script setup lang="ts">
import { ref, onMounted } from "vue";
import SectionTitle from "../../components/UI/SectionTitle.vue";
import MovieCard from "../../components/UI/MovieCard.vue";
import MovieIcon from "../../components/icons/MovieIcon.vue";
import { discoverMovies, type TmdbMovie } from "../../shared/api/tmdb";

const movies = ref<TmdbMovie[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function load() {
  try {
    loading.value = true;
    error.value = null;
    const res = await discoverMovies({ page: 1, sort_by: "popularity.desc" });
    movies.value = res.results;
  } catch (e: any) {
    error.value = e?.message ?? "Failed to load movies";
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>

<template>
  <section>
    <div class="mb-6">
      <SectionTitle
        title="More Movies"
        description="Discover more great films"
        :icon="MovieIcon"
        icon_gradient="bg-gradient-to-br from-primary to-accent"
      />
    </div>

    <div v-if="error" class="text-danger">{{ error }}</div>

    <div
      v-else-if="loading"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
    >
      <div v-for="n in 8" :key="n" class="h-40 rounded-xl skeleton-shimmer" />
    </div>

    <div v-else data-testid="movie-grid">
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
      >
        <MovieCard v-for="m in movies" :key="m.id" :movie="m" />
      </div>
    </div>
  </section>
</template>
