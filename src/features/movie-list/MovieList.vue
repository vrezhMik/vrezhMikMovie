<script lang="ts" setup>
import ObjectPoolCarousel from "../carousel/ObjectPoolCarousel.vue";
import MovieIcon from "../../components/icons/MovieIcon.vue";
import SectionTitle from "../../components/UI/SectionTitle.vue";
const trending = [
  {
    id: 1,
    title: "Cosmic Odyssey",
    rating: 8.5,
    date: "Mar 2024",
    img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
  },
  {
    id: 2,
    title: "Neon Nights",
    rating: 7.8,
    date: "Feb 2024",
    img: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
  },
  {
    id: 3,
    title: "The Last Symphony",
    rating: 9.1,
    date: "Jan 2024",
    img: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1920&h=1080&fit=crop",
  },
  {
    id: 4,
    title: "Shadow Realm",
    rating: 7.4,
    date: "Apr 2024",
    img: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&h=1080&fit=crop",
  },
  {
    id: 5,
    title: "Velocity",
    rating: 8.2,
    date: "May 2024",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&h=1080&fit=crop",
  },
  {
    id: 6,
    title: "Wonderland Chronicles",
    rating: 8.9,
    date: "Jun 2024",
    img: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
  },
];
import { ref, onMounted } from "vue";
import { discoverMovies, type TmdbMovie } from "../../shared/api/tmdb";
import MovieCard from "../../components/UI/MovieCard.vue";

const loading = ref(false);
const page = ref(1);
const movies = ref<TmdbMovie[]>([]);
const error = ref<string | null>(null);

async function load() {
  try {
    loading.value = true;
    error.value = null;
    const data = await discoverMovies({
      page: page.value,
      sort_by: "popularity.desc",
    });
    movies.value = data.results;
    console.log(movies.value);
  } catch (e: any) {
    error.value = e?.message ?? "Failed to load";
  } finally {
    loading.value = false;
  }
}

onMounted(load);
</script>
<template>
  <div class="flex-1 min-w-0">
    <ObjectPoolCarousel
      :items="trending"
      :visible="4"
      :gap-px="16"
      :item-width-px="288"
      title="Trending Now"
    >
      <template #item="{ item }">
        <div
          class="group/card relative rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 transform-gpu hover:scale-105 w-72"
        >
          <RouterLink class="block" :to="`/movie/${item.id}`">
            <div class="relative aspect-[16/9] overflow-hidden bg-muted">
              <img
                :alt="item.title"
                :src="item.img"
                class="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                loading="lazy"
              />
              <div
                class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
              />
              <div class="absolute top-3 left-3">
                <div
                  class="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm bg-gradient-to-br from-success to-success/70 shadow-xl"
                >
                  {{ item.rating }}
                </div>
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  class="text-foreground font-display font-semibold text-lg mb-2 line-clamp-2"
                >
                  {{ item.title }}
                </h3>
                <div
                  class="inline-flex items-center rounded-full px-3 py-1 font-medium transition-all duration-300 bg-card/40 backdrop-blur-sm text-foreground border border-white/10 text-xs"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                  {{ item.date }}
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </template>
    </ObjectPoolCarousel>

    <section style="opacity: 1; transform: none">
      <div class="mb-6">
        <SectionTitle
          title="More Movies"
          description="Discover more great films"
          :icon="MovieIcon"
        />
      </div>
      <div style="display: contents">
        <div data-testid="movie-grid">
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
          >
            <MovieCard v-for="movie in movies" :movie="movie" />
          </div>
          <div class="h-20 flex items-center justify-center mt-8">
            <p class="text-muted-foreground text-sm">Loading more...</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
