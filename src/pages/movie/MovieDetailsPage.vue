<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import SingleBanner from "@/features/single-banner/SingleBanner.vue";
import BackIcon from "@/components/icons/BackIcon.vue";
import SingleMovie from "@/components/UI/SingleMovie.vue";
import CastList from "@/components/UI/CastList.vue";
import TrailerCarousel from "@/features/trailer-carousel/TrailerCarousel.vue";
import SkeletonBanner from "@/components/UI/skeleton/SkeletonBanner.vue";
import SkeletonSingleMovie from "@/components/UI/skeleton/SkeletonSingleMovie.vue";
import SkeletonRowThumbs from "@/components/UI/skeleton/SkeletonRowThumbs.vue";

import {
  getMovieByIdWithExtras,
  getMovieVideos,
  type TmdbMovieFull,
  type TmdbVideo,
} from "@/shared/api/tmdb";

const props = defineProps<{ id?: string | number }>();

const route = useRoute();
const router = useRouter();

const id = computed(() => Number(props.id ?? route.params.id));

const movie = ref<TmdbMovieFull | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const topCast = computed(() =>
  (movie.value?.credits?.cast ?? [])
    .filter((c) => !!c.profile_path)
    .slice(0, 10)
);
const videos = computed<TmdbVideo[]>(() => movie.value?.videos?.results ?? []);

async function load() {
  try {
    loading.value = true;
    error.value = null;

    const data = await getMovieByIdWithExtras(id.value, "en-US");
    movie.value = data;

    if (!videos.value.length) {
      const vids = await getMovieVideos(id.value, "en-US");
      movie.value = { ...data, videos: vids };
    }
  } catch (e: any) {
    console.error(e);
    error.value = e?.message ?? "Failed to load movie";
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function goBack() {
  router.back();
}
</script>

<template>
  <template v-if="loading">
    <SkeletonBanner />
  </template>
  <template v-else>
    <SingleBanner :backdrop_path="movie?.backdrop_path" />
  </template>

  <main class="container mx-auto px-4 -mt-64 relative z-10">
    <div style="display: contents">
      <button
        class="inline-flex items-center gap-2 justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu bg-card/40 backdrop-blur-xl border border-white/10 text-foreground hover:bg-card/60 h-11 px-6 text-base mb-6"
        @click="goBack"
      >
        <BackIcon /> Back
      </button>
    </div>

    <div
      v-if="error"
      class="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 p-4"
    >
      <p class="text-destructive font-medium">{{ error }}</p>
      <button
        class="mt-3 inline-flex items-center rounded-lg border border-white/10 bg-card/60 px-4 py-2 text-sm hover:bg-card"
        @click="load"
      >
        Retry
      </button>
    </div>

    <template v-if="loading">
      <SkeletonSingleMovie />

      <section class="mb-12">
        <h2 class="text-2xl font-display font-semibold text-foreground mb-6">
          Cast
        </h2>
        <SkeletonRowThumbs
          :count="8"
          thumbClass="w-32 aspect-square rounded-xl"
        />
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-display font-semibold text-foreground mb-6">
          Trailers &amp; Videos
        </h2>
        <SkeletonRowThumbs :count="4" thumbClass="w-72 h-40 rounded-xl" />
      </section>
    </template>

    <template v-else>
      <SingleMovie v-if="movie" :movie="movie" />

      <section class="mb-12" v-if="topCast.length">
        <h2 class="text-2xl font-display font-semibold text-foreground mb-6">
          Cast
        </h2>
        <CastList :items="topCast" />
      </section>

      <section class="mb-12" v-if="videos.length">
        <h2 class="text-2xl font-display font-semibold text-foreground mb-6">
          Trailers &amp; Videos
        </h2>
        <TrailerCarousel
          :videos="videos"
          :autoplay="true"
          :interval-ms="1500"
        />
      </section>

      <section class="mb-12" v-else-if="movie">
        <p class="text-muted-foreground text-sm">No trailers available.</p>
      </section>
    </template>
  </main>
</template>
