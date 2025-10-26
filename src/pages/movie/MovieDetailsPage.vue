<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import SingleBanner from "../../features/single-banner/SingleBanner.vue";
import BackIcon from "../../components/icons/BackIcon.vue";
import SingleMovie from "../../components/UI/SingleMovie.vue";
import {
  getMovieByIdWithExtras,
  getMovieVideos,
  type TmdbMovieFull,
  type TmdbVideo,
} from "../../shared/api/tmdb";

const route = useRoute();
const router = useRouter();
const id = computed(() => Number(route.params.id));

const movie = ref<TmdbMovieFull | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const topCast = computed(() => movie.value?.credits?.cast?.slice(0, 10) ?? []);

const videos = computed<TmdbVideo[]>(() => movie.value?.videos?.results ?? []);

const playing = ref<Set<string>>(new Set());
function play(videoId: string) {
  playing.value.add(videoId);
}
function isPlaying(videoId: string) {
  return playing.value.has(videoId);
}

function ytThumb(key?: string) {
  return key ? `https://img.youtube.com/vi/${key}/hqdefault.jpg` : "";
}
function ytEmbed(key?: string) {
  return key ? `https://www.youtube.com/embed/${key}?autoplay=1&rel=0` : "";
}

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

    console.log("🎬 Movie details:", movie.value);
    console.log("👥 Top cast:", topCast.value);
    console.log("▶️ Videos:", videos.value);
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
        <BackIcon />
        Back
      </button>
    </div>

    <SingleMovie :movie="movie" />

    <section class="mb-12" style="opacity: 1; transform: none">
      <h2 class="text-2xl font-display font-semibold text-foreground mb-6">
        Cast
      </h2>
      <div style="display: contents">
        <div
          class="flex gap-4 overflow-x-auto custom-scrollbar pb-4 snap-x snap-mandatory"
        >
          <div
            class="flex-shrink-0 w-32 snap-start group cursor-pointer"
            v-for="{ id, name, character, profile_path } in topCast"
            :key="id"
          >
            <div
              class="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3 shadow-md group-hover:shadow-xl transition-shadow duration-300"
            >
              <img
                :alt="name"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                :src="
                  profile_path
                    ? `https://image.tmdb.org/t/p/w342${profile_path}`
                    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'
                "
              />
            </div>
            <h4 class="font-medium text-sm text-foreground line-clamp-2 mb-1">
              {{ name }}
            </h4>
            <p class="text-xs text-muted-foreground line-clamp-2">
              {{ character }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-12" style="opacity: 1; transform: none">
      <h2 class="text-2xl font-display font-semibold text-foreground mb-6">
        Trailers &amp; Videos
      </h2>

      <div style="display: contents">
        <div class="relative">
          <div
            class="flex gap-4 overflow-x-auto custom-scrollbar pb-4 snap-x snap-mandatory"
          >
            <div
              v-for="v in videos"
              :key="v.id"
              class="group relative flex-shrink-0 w-72 h-40 rounded-xl overflow-hidden snap-start bg-muted transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
            >
              <template v-if="!isPlaying(v.id)">
                <img
                  :alt="v.name"
                  class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  :src="ytThumb(v.key)"
                  loading="lazy"
                />
                <button
                  class="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors duration-300"
                  :aria-label="`Play ${v.name}`"
                  @click="play(v.id)"
                >
                  <div
                    class="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="h-8 w-8 text-primary-foreground ml-1"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
                      />
                    </svg>
                  </div>
                </button>

                <div
                  class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
                >
                  <p class="text-foreground text-sm font-medium line-clamp-2">
                    {{ v.name }}
                  </p>
                  <p class="text-muted-foreground text-xs mt-1">
                    {{ v.type }}
                  </p>
                </div>
              </template>

              <iframe
                v-else
                class="absolute inset-0 w-full h-full rounded-xl"
                :src="ytEmbed(v.key)"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
