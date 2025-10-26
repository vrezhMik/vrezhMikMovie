<script setup lang="ts">
import DateIcon from "@/components/icons/DateIcon.vue";
import LikeIcon from "@/components/icons/LikeIcon.vue";
import TimeIcon from "@/components/icons/TimeIcon.vue";
import type { TmdbMovieFull } from "@/shared/api/tmdb";
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
</script>
<template>
  <div class="grid lg:grid-cols-3 gap-8 mb-12">
    <div class="lg:col-span-1" style="opacity: 1; transform: none">
      <div class="relative rounded-2xl overflow-hidden shadow-2xl">
        <img
          alt="Cosmic Odyssey"
          class="w-full aspect-[2/3] object-cover"
          :src="
            props.movie?.poster_path
              ? `https://image.tmdb.org/t/p/w342${props.movie?.poster_path}`
              : ''
          "
        />
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
                class="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm bg-gradient-to-br transition-all duration-300 from-emerald-500 to-emerald-600 shadow-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]"
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
                <LikeIcon />
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
