<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import ObjectPoolCarousel from "../carousel/ObjectPoolCarousel.vue";
import DateIcon from "../../components/icons/DateIcon.vue";
import { trendingMovies, type TmdbMovie } from "../../shared/api/tmdb";

const trending = ref<TmdbMovie[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function load() {
  try {
    loading.value = true;
    error.value = null;
    const res = await trendingMovies({ time_window: "week", page: 1 });
    trending.value = res.results;
  } catch (e: any) {
    error.value = e?.message ?? "Failed to load trending";
  } finally {
    loading.value = false;
  }
}

function getRatingClass(v?: number) {
  const score = v ?? 0;
  if (score <= 3) return "from-danger to-danger/70";
  if (score <= 5) return "from-warning to-warning/70";
  if (score <= 7) return "from-ring to-ring/70";
  return "from-success to-success/70";
}

function formatToMonthYear(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(date);
}

onMounted(load);
</script>

<template>
  <div>
    <ObjectPoolCarousel
      v-if="!loading && !error && trending.length"
      :items="trending"
      :visible="4"
      :gap-px="16"
      :item-width-px="288"
      title="Trending Now"
    >
      <template #item="{ item }">
        <RouterLink
          :to="`/movie/${item.id}`"
          class="group/card relative rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform-gpu hover:scale-105 w-72 block"
        >
          <div class="relative aspect-[16/9] overflow-hidden bg-muted">
            <img
              :alt="item.title || item.name"
              :src="
                item.poster_path
                  ? `https://image.tmdb.org/t/p/w780${item.poster_path}`
                  : ''
              "
              class="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
              loading="lazy"
            />

            <div
              class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
            />

            <!-- rating badge -->
            <div class="absolute top-3 left-3">
              <div
                :class="[
                  'inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm bg-gradient-to-br shadow-xl on-media text-foreground',
                  getRatingClass(item.vote_average),
                ]"
              >
                {{ (item.vote_average ?? 0).toFixed(1) }}
              </div>
            </div>

            <!-- text overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-4 on-media">
              <h3
                class="text-foreground font-display font-semibold text-lg mb-2 line-clamp-2"
              >
                {{ item.title || item.name }}
              </h3>
              <div
                class="inline-flex items-center rounded-full px-3 py-1 font-medium transition-all duration-300 bg-card/40 backdrop-blur-sm text-foreground border border-white/10 text-xs"
              >
                <DateIcon class="mr-1 h-3 w-3" />
                {{ formatToMonthYear(item.release_date) }}
              </div>
            </div>
          </div>
        </RouterLink>
      </template>
    </ObjectPoolCarousel>

    <div v-else-if="loading" class="grid grid-cols-4 gap-4">
      <div v-for="n in 4" :key="n" class="h-40 rounded-xl skeleton-shimmer" />
    </div>
    <p v-else-if="error" class="text-danger">{{ error }}</p>
  </div>
</template>
