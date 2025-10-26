<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import SingleBanner from "@/features/single-banner/SingleBanner.vue";
import BackIcon from "@/components/icons/BackIcon.vue";
import SingleMovie from "@/components/UI/SingleMovie.vue";
import CastList from "@/components/UI/CastList.vue";
import TrailerList from "@/components/UI/TrailerList.vue";
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

const topCast = computed(() => movie.value?.credits?.cast?.slice(0, 10) ?? []);
const videos = computed<TmdbVideo[]>(() => movie.value?.videos?.results ?? []);

onMounted(async () => {
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
    error.value = e?.message ?? "Failed to load movie";
    console.error(e);
  } finally {
    loading.value = false;
  }
});

function goBack() {
  router.back();
}
</script>

<template>
  <SingleBanner :backdrop_path="movie?.backdrop_path" />

  <main class="container mx-auto px-4 -mt-64 relative z-10">
    <div style="display: contents">
      <button
        class="inline-flex items-center gap-2 justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu bg-card/40 backdrop-blur-xl border border-white/10 text-foreground hover:bg-card/60 h-11 px-6 text-base mb-6"
        @click="goBack"
      >
        <BackIcon /> Back
      </button>
    </div>

    <SingleMovie :movie="movie" v-if="movie" />

    <section
      class="mb-12"
      style="opacity: 1; transform: none"
      v-if="topCast.length"
    >
      <h2 class="text-2xl font-display font-semibold text-foreground mb-6">
        Cast
      </h2>
      <CastList :items="topCast" />
    </section>

    <section
      class="mb-12"
      style="opacity: 1; transform: none"
      v-if="videos.length"
    >
      <h2 class="text-2xl font-display font-semibold text-foreground mb-6">
        Trailers &amp; Videos
      </h2>

      <TrailerList :videos="videos" />
    </section>
  </main>
</template>
