<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";
import SectionTitle from "@/components/UI/SectionTitle.vue";
import MovieCard from "@/components/UI/MovieCard.vue";
import MovieIcon from "@/components/icons/MovieIcon.vue";
import SkeletonMovieCard from "@/components/UI/skeleton/SkeletonMovieCard.vue";
import {
  discoverMovies,
  type TmdbMovie,
  type TmdbPaginated,
} from "@/shared/api/tmdb";

const props = withDefaults(defineProps<{ genres?: number[] }>(), {
  genres: () => [],
});

const movies = ref<TmdbMovie[]>([]);
const loadingInitial = ref(false);
const loadingMore = ref(false);
const error = ref<string | null>(null);

const currentPage = ref(0);
const totalPages = ref<number | null>(null);

const fetchedPages = new Set<number>();
let inFlight: Promise<TmdbPaginated<TmdbMovie>> | null = null;

let reqId = 0;

const sentinel = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

function makeParams(page: number) {
  return {
    page,
    sort_by: "popularity.desc",
    ...(props.genres?.length ? { with_genres: props.genres.join(",") } : {}),
  } as unknown as Parameters<typeof discoverMovies>[0];
}

async function fetchPage(page: number) {
  if (fetchedPages.has(page)) return;
  if (totalPages.value && page > totalPages.value) return;

  if (inFlight) await inFlight.catch(() => void 0);

  const thisReq = reqId;

  const doFetch = async () => {
    const res = await discoverMovies(makeParams(page));
    if (thisReq !== reqId) return res;
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
      if (thisReq === reqId) error.value = "Server temporarily unavailable";
    } finally {
      if (thisReq === reqId) loadingInitial.value = false;
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
      if (thisReq === reqId) loadingMore.value = false;
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

function disconnectObserver() {
  if (observer && sentinel.value) observer.unobserve(sentinel.value);
  if (observer) observer.disconnect();
  observer = null;
}

async function resetAndReload() {
  reqId++;
  movies.value = [];
  error.value = null;
  currentPage.value = 0;
  totalPages.value = null;
  fetchedPages.clear();
  disconnectObserver();

  await nextTick();
  await fetchPage(1);
  observeSentinel();

  if (!totalPages.value || 2 <= totalPages.value) fetchPage(2);
}

onMounted(async () => {
  await resetAndReload();
});

watch(
  () => (props.genres ?? []).join(","),
  async () => {
    await resetAndReload();
  }
);

onBeforeUnmount(() => {
  disconnectObserver();
});
</script>

<template>
  <section aria-live="polite" aria-busy="false">
    <div class="mb-6">
      <SectionTitle
        title="More Movies"
        description="Discover more great films"
        :icon="MovieIcon"
        icon_style="bg-gradient-to-br from-primary to-accent"
      />
    </div>

    <div v-if="error" class="text-danger text-sm">
      {{ error }}
    </div>

    <div
      v-else-if="loadingInitial"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
    >
      <SkeletonMovieCard v-for="n in 8" :key="n" />
    </div>

    <div v-else>
      <div v-if="!movies.length" class="py-12 text-center">
        <p class="text-muted-foreground">No movies to show.</p>
      </div>

      <div
        v-else
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
      >
        <MovieCard v-for="m in movies" :key="m.id" :movie="m" />
      </div>

      <div class="mt-6" v-show="loadingMore">
        <div
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
        >
          <SkeletonMovieCard v-for="n in 4" :key="`more-${n}`" />
        </div>
      </div>

      <div ref="sentinel" class="h-1"></div>
    </div>
  </section>
</template>
