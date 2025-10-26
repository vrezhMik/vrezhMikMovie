<script setup lang="ts">
import DateIcon from "@/components/icons/DarkIcon.vue";
import LikeIcon from "@/components/icons/LikeIcon.vue";
import type { TmdbMovie } from "@/shared/api/tmdb";
import { computed } from "vue";

const props = defineProps<{ movie: TmdbMovie }>();

const ratingClass = computed(() => {
  const v = props.movie.vote_average ?? 0;
  if (v <= 3) return "from-danger to-danger/70";
  if (v <= 5) return "from-warning to-warning/70";
  if (v <= 7) return "from-ring to-ring/70";
  return "from-success to-success/70";
});

function formatToMonthYear(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(d);
}
import { useFavorites } from "@/shared/favorites/useFavorites";
import { ref, onMounted } from "vue";
import MovieBigIcon from "../icons/MovieBigIcon.vue";

const fav = useFavorites();
const liked = ref(false);

onMounted(async () => {
  liked.value = await fav.isLiked(props.movie.id);
});

async function toggleLike(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
  await fav.toggle(props.movie);
  liked.value = await fav.isLiked(props.movie.id);
}
</script>

<template>
  <div
    class="group relative rounded-2xl overflow-hidden bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 transform-gpu"
  >
    <RouterLink :to="`/movie/${props.movie.id}`">
      <div class="relative aspect-[2/3] overflow-hidden bg-muted">
        <template v-if="props.movie.poster_path">
          <img
            :alt="props.movie.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            :src="`https://image.tmdb.org/t/p/w342${props.movie.poster_path}`"
          />
        </template>
        <template v-else>
          <div
            class="relative w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-muted flex flex-col items-center justify-center p-6"
          >
            <div
              class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"
            ></div>

            <div class="relative z-10 flex flex-col items-center">
              <div
                class="mb-4 p-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-white/10"
              >
                <MovieBigIcon />
              </div>

              <div class="text-center">
                <p class="text-sm font-medium text-foreground mb-1">
                  No Image Available
                </p>
                <p class="text-xs text-muted-foreground">Poster coming soon</p>
              </div>
            </div>
          </div>
        </template>

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <div
          class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <button
            class="inline-flex items-center justify-center rounded-full transition-all duration-300 transform-gpu bg-card/60 backdrop-blur-sm border border-white/10 h-8 w-8"
            :class="
              liked
                ? 'text-rose-500 bg-rose-500/10'
                : 'text-muted-foreground hover:bg-card-hover hover:text-foreground'
            "
            aria-label="Toggle favorite"
            :aria-pressed="liked"
            @click="toggleLike"
          >
            <LikeIcon />
          </button>
        </div>

        <div class="absolute top-3 left-3">
          <div
            :class="[
              'inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm bg-gradient-to-br shadow-xl on-media text-foreground',
              ratingClass,
            ]"
          >
            {{ (props.movie.vote_average ?? 0).toFixed(1) }}
          </div>
        </div>

        <div
          class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 on-media z-10"
        >
          <h3
            class="text-foreground font-display font-semibold text-lg mb-2 line-clamp-2"
          >
            {{ props.movie.title }}
          </h3>

          <div
            class="inline-flex items-center rounded-full px-3 py-1 font-medium bg-card/40 backdrop-blur-sm text-foreground border border-white/10 text-xs"
          >
            <DateIcon class="mr-1 h-3 w-3" />
            {{ formatToMonthYear(props.movie.release_date) }}
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
