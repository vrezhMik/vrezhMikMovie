<script setup lang="ts">
import { RouterLink } from "vue-router";
import MovieIcon from "@/components/icons/MovieIcon.vue";
import SearchBar from "@/features/search-bar/SearchBar.vue";
import HeaderButton from "@/components/UI/HeaderButton.vue";
import LikeIcon from "@/components/icons/LikeIcon.vue";
import LightIcon from "@/components/icons/LightIcon.vue";
import DarkIcon from "@/components/icons/DarkIcon.vue";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { useFavorites } from "@/shared/favorites/useFavorites";
type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;
  return "dark";
}

const theme = ref<Theme>(getInitialTheme());

function applyTheme(val: Theme) {
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(val);
  localStorage.setItem("theme", val);
}

applyTheme(theme.value);

watch(theme, (val) => applyTheme(val));

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}
function isThemeDark() {
  return theme.value === "dark";
}

const router = useRouter();
const fav = useFavorites();
const favCount = computed(() => fav.count.value);

function goFavorites() {
  router.push({ name: "favorites" });
}
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
  >
    <div class="container mx-auto px-4 pb-4">
      <div class="flex h-16 items-center justify-between gap-4">
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg hover:shadow-glow transition-transform duration-300 ease-smooth group-hover:scale-[1.05] group-hover:rotate-[5deg]"
          >
            <MovieIcon class="w-5 h-5 text-white" />
          </div>
          <h1 class="hidden text-xl font-bold text-gradient-primary lg:block">
            vrezhMikMovies
          </h1>
        </RouterLink>
        <div class="flex-1 max-w-xl hidden md:block">
          <SearchBar />
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <HeaderButton :icon="LikeIcon" :method="goFavorites" />
            <span
              v-if="favCount"
              class="absolute -top-1 -right-1 text-[10px] leading-none px-1.5 py-[2px] rounded-full bg-pink-500 text-white"
            >
              {{ favCount }}
            </span>
          </div>
          <HeaderButton
            :icon="isThemeDark() ? LightIcon : DarkIcon"
            :method="toggleTheme"
          />
        </div>
      </div>
      <div class="mt-2 flex-1 max-w-xl block md:hidden mx-auto">
        <SearchBar />
      </div>
    </div>
  </header>
</template>
