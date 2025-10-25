<script setup lang="ts">
import DateIcon from "../icons/DateIcon.vue";
import LikeIcon from "../icons/LikeIcon.vue";
import type { TmdbMovie } from "../../shared/api/tmdb";

const props = defineProps<{
  movie: TmdbMovie;
}>();

function formatToOneDecimal(num: number): number {
  if (isNaN(num)) return 0;
  return Math.floor(num * 10) / 10;
}

function formatToMonthYear(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}
</script>

<template>
  <div style="display: contents">
    <div
      class="group relative rounded-2xl overflow-hidden bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 transform-gpu"
      style="opacity: 1; transform: none"
    >
      <RouterLink :to="`/movie/${props.movie.id}`">
        <div class="relative aspect-[2/3] overflow-hidden bg-muted">
          <img
            :alt="props.movie.title"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            :src="`https://image.tmdb.org/t/p/w342${props.movie.poster_path}`"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></div>
          <div
            class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div style="display: contents">
              <button
                class="inline-flex items-center justify-center rounded-full transition-all duration-300 transform-gpu bg-card/60 backdrop-blur-sm text-muted-foreground border border-white/10 hover:bg-card-hover hover:text-foreground h-8 w-8"
              >
                <div style="transform: none">
                  <div style="display: contents">
                    <LikeIcon />
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div class="absolute top-3 left-3">
            <div style="display: contents">
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm bg-gradient-to-br from-success to-success/70 shadow-xl"
              >
                {{ formatToOneDecimal(props.movie.vote_average) }}
              </div>
            </div>
          </div>
          <div
            class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          >
            <h3
              class="text-foreground font-display font-semibold text-lg mb-2 line-clamp-2"
            >
              {{ props.movie.title }}
            </h3>
            <div style="display: contents">
              <div
                class="inline-flex items-center rounded-full px-3 py-1 font-medium transition-all duration-300 bg-card/40 backdrop-blur-sm text-foreground border border-white/10 text-xs"
              >
                <div style="display: contents">
                  <DateIcon />
                </div>
                {{ formatToMonthYear(props.movie.release_date) }}
              </div>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
