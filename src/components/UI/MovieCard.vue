<script setup lang="ts">
import DateIcon from "../icons/DateIcon.vue";
import LikeIcon from "../icons/LikeIcon.vue";
import type { TmdbMovie } from "../../shared/api/tmdb";
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
</script>

<template>
  <div
    class="group relative rounded-2xl overflow-hidden bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 transform-gpu"
  >
    <RouterLink :to="`/movie/${props.movie.id}`">
      <div class="relative aspect-[2/3] overflow-hidden bg-muted">
        <img
          :alt="props.movie.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          :src="
            props.movie.poster_path
              ? `https://image.tmdb.org/t/p/w342${props.movie.poster_path}`
              : ''
          "
        />

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        <div
          class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <button
            class="inline-flex items-center justify-center rounded-full transition-all duration-300 transform-gpu bg-card/60 backdrop-blur-sm text-muted-foreground border border-white/10 hover:bg-card-hover hover:text-foreground h-8 w-8"
            aria-label="Add to favorites"
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
          class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 on-media"
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
