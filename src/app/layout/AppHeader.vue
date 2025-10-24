<script setup lang="ts">
import { RouterLink } from "vue-router";
import MovieIcon from "../../components/icons/MovieIcon.vue";
import SearchBar from "../../features/search-bar/SearchBar.vue";
import HeaderButton from "../../components/UI/HeaderButton.vue";
import LikeIcon from "../../components/icons/LikeIcon.vue";
import LightIcon from "../../components/icons/LightIcon.vue";
import DarkIcon from "../../components/icons/DarkIcon.vue";
import { ref, onMounted, watchEffect } from "vue";

type Theme = "light" | "dark";
const theme = ref<Theme>("dark");

onMounted(() => {
  const saved = localStorage.getItem("theme") as Theme | null;
  if (saved) {
    theme.value = saved;
  }
});

watchEffect(() => {
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(theme.value);
  localStorage.setItem("theme", theme.value);
});

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}

function isThemeDark() {
  return theme.value === "dark";
}
</script>

<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl"
  >
    <div class="mx-auto max-w-7xl px-4">
      <div class="flex h-16 items-center justify-between gap-4">
        <RouterLink to="/" class="flex items-center gap-3 group">
          <div
            class="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg hover:shadow-glow transition-transform duration-300 ease-smooth group-hover:scale-[1.05] group-hover:rotate-[5deg]"
          >
            <MovieIcon class="w-5 h-5 text-white" />
          </div>

          <h1
            class="hidden sm:inline-block text-xl font-bold text-gradient-primary"
          >
            vrezhMikMovies
          </h1>
        </RouterLink>
        <SearchBar />
        <div class="flex items-center gap-2">
          <HeaderButton
            :icon="LikeIcon"
            :method="
              () => {
                console.log('Like');
              }
            "
          />
          <HeaderButton
            :icon="isThemeDark() ? LightIcon : DarkIcon"
            :method="
              () => {
                toggleTheme();
              }
            "
          />
        </div>
      </div>
    </div>
  </header>
</template>
