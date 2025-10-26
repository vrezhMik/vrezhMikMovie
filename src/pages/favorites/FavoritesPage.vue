<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import SectionTitle from "@/components/UI/SectionTitle.vue";
import LikeIcon from "@/components/icons/LikeIcon.vue";
import BigLikeIcon from "@/components/icons/BigLikeIcon.vue";
import MovieCard from "@/components/UI/MovieCard.vue";
import { useFavorites } from "@/shared/favorites/useFavorites";

const router = useRouter();
const fav = useFavorites();
const loading = ref(true);
const favCount = computed(() => fav.count.value);

const items = computed(() => fav.list.value);
const hasAny = computed(() => items.value.length > 0);

function browse() {
  router.push({ path: "/" });
}

onMounted(async () => {
  try {
    await fav.loadAll();
  } finally {
    loading.value = false;
  }
});

async function clearAllFavorites() {
  await fav.clearAll();
}
</script>

<template>
  <main class="container mx-auto px-4 py-8">
    <div class="flex items-center justify-between">
      <SectionTitle
        title="My Favorites"
        :description="
          hasAny
            ? `${favCount} movie saved`
            : 'You haven’t added any favorites yet'
        "
        :icon="LikeIcon"
        icon_style="p-3 rounded-xl bg-accent/20 border border-accent/30"
      />
      <div style="display: contents">
        <button
          class="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu border-2 h-11 px-6 text-base border-danger text-danger hover:bg-danger/10"
          @click="clearAllFavorites"
        >
          Clear All
        </button>
      </div>
    </div>

    <div v-if="loading" class="py-12 text-center text-muted-foreground">
      Loading your favorites…
    </div>

    <div
      v-else-if="!hasAny"
      class="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div class="mb-4 rounded-full bg-muted/40 p-6">
        <BigLikeIcon />
      </div>
      <h3 class="text-2xl font-semibold text-foreground mb-2">
        No favorites yet
      </h3>
      <p class="text-muted-foreground max-w-md mb-6">
        Start adding movies to your favorites to see them here. Click the heart
        icon on any movie card or details page.
      </p>
      <button
        class="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/20 h-11 px-6 text-base"
        @click="browse"
      >
        Browse Movies
      </button>
    </div>

    <section v-else>
      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 py-5"
      >
        <MovieCard v-for="m in items" :key="m.id" :movie="m" />
      </div>
    </section>
  </main>
</template>
