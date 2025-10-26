<script setup lang="ts">
import DateIcon from "@/components/icons/DateIcon.vue";
import LikeIcon from "@/components/icons/LikeIcon.vue";
import TimeIcon from "@/components/icons/TimeIcon.vue";
import type { TmdbMovieFull } from "@/shared/api/tmdb";
import { computed } from "vue";

const props = defineProps<{ movie: TmdbMovieFull }>();
function formatToMonthYear(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(d);
}

function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return "0min";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}
import { ref, onMounted } from "vue";
import { useFavorites } from "@/shared/favorites/useFavorites";
const fav = useFavorites();
const liked = ref(false);
onMounted(async () => {
  liked.value = await fav.isLiked(props.movie.id);
});
async function toggleLike() {
  await fav.toggle(props.movie);
  liked.value = await fav.isLiked(props.movie.id);
}
const ratingClass = computed(() => {
  const v = props.movie.vote_average ?? 0;
  if (v <= 3) return "from-danger to-danger/70";
  if (v <= 5) return "from-warning to-warning/70";
  if (v <= 7) return "from-ring to-ring/70";
  return "from-success to-success/70";
});
</script>
<template>
  <div class="grid lg:grid-cols-3 gap-8 mb-12">
    <div class="lg:col-span-1" style="opacity: 1; transform: none">
      <div class="relative rounded-2xl overflow-hidden shadow-2xl">
        <template v-if="props.movie?.poster_path">
          <img
            :alt="props.movie?.title"
            class="w-full aspect-[2/3] object-cover"
            :src="`https://image.tmdb.org/t/p/w342${props.movie?.poster_path}`"
          />
        </template>

        <template v-else>
          <div
            class="relative w-full aspect-[2/3] bg-gradient-to-br from-primary/20 via-accent/10 to-muted flex flex-col items-center justify-center p-6 z-0"
          >
            <div
              class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30 z-0"
            ></div>

            <div class="relative z-10 flex flex-col items-center">
              <div
                class="mb-4 p-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-white/10 z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="lucide lucide-film h-16 w-16 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  viewBox="0 0 24 24"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 3v18" />
                  <path d="M3 7.5h4" />
                  <path d="M3 12h18" />
                  <path d="M3 16.5h4" />
                  <path d="M17 3v18" />
                  <path d="M17 7.5h4" />
                  <path d="M17 16.5h4" />
                </svg>
              </div>
              <div class="text-center z-10">
                <p class="text-sm font-medium text-foreground mb-1">
                  No Image Available
                </p>
                <p class="text-xs text-muted-foreground">Poster coming soon</p>
              </div>
            </div>
          </div>
        </template>

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20"
        ></div>
      </div>
    </div>
    <div class="lg:col-span-2 space-y-6" style="opacity: 1; transform: none">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <h1
            class="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4"
          >
            {{ props.movie?.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-3">
            <div style="display: contents">
              <div
                :class="[
                  'inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm bg-gradient-to-br shadow-xl on-media text-foreground',
                  ratingClass,
                ]"
              >
                {{ (props.movie?.vote_average ?? 0).toFixed(1) }}
              </div>
            </div>
            <div style="display: contents">
              <div
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 bg-card/40 backdrop-blur-sm text-foreground border border-white/10"
              >
                <div style="display: contents">
                  <DateIcon />
                </div>
                {{ formatToMonthYear(props.movie?.release_date) }}
              </div>
            </div>
            <div style="display: contents" v-if="props.movie?.runtime">
              <div
                class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 bg-card/40 backdrop-blur-sm text-foreground border border-white/10"
              >
                <div style="display: contents">
                  <TimeIcon />
                </div>
                {{ formatRuntime(props.movie?.runtime) }}
              </div>
            </div>
          </div>
        </div>
        <div style="display: contents">
          <button
            aria-label="Add to favorites"
            class="inline-flex items-center justify-center rounded-full transition-all duration-300 transform-gpu bg-card/60 backdrop-blur-sm text-muted-foreground border border-white/10 hover:bg-card-hover hover:text-foreground h-12 w-12"
          >
            <div style="transform: none">
              <div style="display: contents">
                <button
                  aria-label="Toggle favorite"
                  class="inline-flex items-center justify-center rounded-full transition-all duration-300 transform-gpu border border-white/10 h-12 w-12"
                  :class="
                    liked
                      ? 'bg-rose-500/20 text-rose-500'
                      : 'bg-card/60 backdrop-blur-sm text-muted-foreground hover:bg-card-hover hover:text-foreground'
                  "
                  @click="toggleLike"
                >
                  <LikeIcon />
                </button>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div class="flex flex-wrap gap-2">
        <div style="display: contents" v-for="{ name } in props.movie?.genres">
          <div
            class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 bg-primary/20 text-primary border border-primary/30"
          >
            {{ name }}
          </div>
        </div>
      </div>
      <div class="space-y-3">
        <h2 class="text-2xl font-display font-semibold text-foreground">
          Overview
        </h2>
        <p class="text-muted-foreground leading-relaxed line-clamp-3">
          {{ props.movie?.overview }}
        </p>
      </div>
    </div>
  </div>
</template>
