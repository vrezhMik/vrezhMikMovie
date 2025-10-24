<script lang="ts" setup>
import ObjectPoolCarousel from "../carousel/ObjectPoolCarousel.vue";
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
import LikeIcon from "../../components/icons/LikeIcon.vue";
import DateIcon from "../../components/icons/DateIcon.vue";
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
        <div class="flex items-center gap-3 mb-2">
          <div class="p-2 rounded-lg bg-card border border-border">
            <div style="display: contents">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-film h-5 w-5 text-foreground"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"></rect>
                <path d="M7 3v18"></path>
                <path d="M3 7.5h4"></path>
                <path d="M3 12h18"></path>
                <path d="M3 16.5h4"></path>
                <path d="M17 3v18"></path>
                <path d="M17 7.5h4"></path>
                <path d="M17 16.5h4"></path>
              </svg>
            </div>
          </div>
          <div>
            <h2 class="text-3xl font-display font-bold text-foreground">
              More Movies
            </h2>
            <p class="text-muted-foreground">Discover more great films</p>
          </div>
        </div>
      </div>
      <div style="display: contents">
        <div data-testid="movie-grid">
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6"
          >
            <div style="display: contents" v-for="value in movies">
              <div
                data-testid="movie-card"
                class="group relative rounded-2xl overflow-hidden bg-card shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 transform-gpu"
                style="opacity: 1; transform: none"
              >
                <a class="block" href="/movie/1" data-discover="true">
                  <div class="relative aspect-[2/3] overflow-hidden bg-muted">
                    <img
                      :alt="value.title"
                      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      :src="`https://image.tmdb.org/t/p/w342${value.poster_path}`"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                    <div
                      class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div style="display: contents">
                        <button
                          data-testid="favorite-button"
                          aria-pressed="false"
                          aria-label="Add to favorites"
                          class="inline-flex items-center justify-center rounded-full transition-all duration-300 transform-gpu bg-card/60 backdrop-blur-sm text-muted-foreground border border-white/10 hover:bg-card-hover hover:text-foreground h-8 w-8"
                          tabindex="0"
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
                          data-testid="rating-badge"
                          class="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-sm bg-gradient-to-br from-success to-success/70 shadow-xl"
                        >
                          {{ value.vote_average }}
                        </div>
                      </div>
                    </div>
                    <div
                      class="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <h3
                        class="text-foreground font-display font-semibold text-lg mb-2 line-clamp-2"
                      >
                        {{ value.title }}
                      </h3>
                      <div style="display: contents">
                        <div
                          class="inline-flex items-center rounded-full px-3 py-1 font-medium transition-all duration-300 bg-card/40 backdrop-blur-sm text-foreground border border-white/10 text-xs"
                        >
                          <div style="display: contents">
                            <DateIcon />
                          </div>
                          {{ value.release_date }}
                        </div>
                      </div>
                    </div>
                  </div></a
                >
              </div>
            </div>
          </div>
          <div class="h-20 flex items-center justify-center mt-8">
            <p class="text-muted-foreground text-sm">Loading more...</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
