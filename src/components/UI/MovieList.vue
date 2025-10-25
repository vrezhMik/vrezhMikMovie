<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import SectionTitle from "../../components/UI/SectionTitle.vue";
import MovieCard from "../../components/UI/MovieCard.vue";
import MovieIcon from "../../components/icons/MovieIcon.vue";
import {
  discoverMovies,
  type TmdbMovie,
  type TmdbPaginated,
} from "../../shared/api/tmdb";

const movies = ref<TmdbMovie[]>([]);
const loadingInitial = ref(false);
const loadingMore = ref(false);
const error = ref<string | null>(null);

const currentPage = ref(0);
const totalPages = ref<number | null>(null);

const fetchedPages = new Set<number>();
let inFlight: Promise<TmdbPaginated<TmdbMovie>> | null = null;

const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

async function fetchPage(page: number) {
  if (fetchedPages.has(page)) return;
  if (totalPages.value && page > totalPages.value) return;

  if (inFlight) await inFlight.catch(() => void 0);

  const doFetch = async () => {
    const res = await discoverMovies({ page, sort_by: "popularity.desc" });
    fetchedPages.add(page);
    currentPage.value = Math.max(currentPage.value, res.page);
    totalPages.value = res.total_pages;

    const existing = new Set(movies.value.map((m) => m.id));
    const toAdd = res.results.filter((m) => !existing.has(m.id));
    movies.value = movies.value.concat(toAdd);
    return res;
  };

  if (page === 1) {
    loadingInitial.value = true;
    error.value = null;
    try {
      inFlight = doFetch();
      await inFlight;
    } catch (e: any) {
      error.value = e?.message ?? "Failed to load movies";
    } finally {
      loadingInitial.value = false;
      inFlight = null;
    }
  } else {
    loadingMore.value = true;
    try {
      inFlight = doFetch();
      await inFlight;
    } catch (e: any) {
      console.error(e);
    } finally {
      loadingMore.value = false;
      inFlight = null;
    }
  }
}

function observeSentinel() {
  if (!sentinel.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const next = (currentPage.value || 0) + 1;
        if (totalPages.value && next > totalPages.value) return;
        fetchPage(next);
      }
    },
    { root: null, rootMargin: "1200px 0px 1200px 0px", threshold: 0 }
  );
  observer.observe(sentinel.value);
}

onMounted(async () => {
  await fetchPage(1);
  observeSentinel();
  if (!totalPages.value || 2 <= totalPages.value) fetchPage(2);
});

onBeforeUnmount(() => {
  if (observer && sentinel.value) observer.unobserve(sentinel.value);
  observer = null;
});
</script>

<template>
  <section>
    <div class="mb-6">
      <SectionTitle
        title="More Movies"
        description="Discover more great films"
        :icon="MovieIcon"
        icon_style="bg-gradient-to-br from-primary to-accent"
      />
    </div>

    <div v-if="error" class="text-danger">{{ error }}</div>

    <div
      v-else-if="loadingInitial"
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

      <div
        class="h-16 flex items-center justify-center mt-6"
        v-show="loadingMore"
      >
        <p class="text-muted-foreground text-sm">Loading more…</p>
      </div>

      <div ref="sentinel" style="height: 1px"></div>
    </div>
  </section>
</template>
