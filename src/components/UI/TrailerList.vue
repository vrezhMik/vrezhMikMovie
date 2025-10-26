<script setup lang="ts">
import { ref } from "vue";
import type { TmdbVideo } from "../../shared/api/tmdb";
import PlayIcon from "../icons/PlayIcon.vue";
defineProps<{
  videos: TmdbVideo[];
}>();

const playing = ref<Set<string>>(new Set());

function play(videoId: string) {
  playing.value.add(videoId);
}
function isPlaying(videoId: string) {
  return playing.value.has(videoId);
}
function ytThumb(key?: string) {
  return key ? `https://img.youtube.com/vi/${key}/hqdefault.jpg` : "";
}
function ytEmbed(key?: string) {
  return key ? `https://www.youtube.com/embed/${key}?autoplay=1&rel=0` : "";
}
</script>

<template>
  <div class="relative">
    <div
      class="flex gap-4 overflow-x-auto custom-scrollbar pb-4 snap-x snap-mandatory"
    >
      <div
        v-for="v in videos"
        :key="v.id"
        class="group relative flex-shrink-0 w-72 h-40 rounded-xl overflow-hidden snap-start bg-muted transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
      >
        <template v-if="!isPlaying(v.id)">
          <img
            :alt="v.name"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            :src="ytThumb(v.key)"
            loading="lazy"
          />
          <button
            class="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors duration-300"
            :aria-label="`Play ${v.name}`"
            @click="play(v.id)"
          >
            <div
              class="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-lg"
            >
              <PlayIcon />
            </div>
          </button>

          <div
            class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
          >
            <p class="text-foreground text-sm font-medium line-clamp-2">
              {{ v.name }}
            </p>
            <p class="text-muted-foreground text-xs mt-1">{{ v.type }}</p>
          </div>
        </template>

        <iframe
          v-else
          class="absolute inset-0 w-full h-full rounded-xl"
          :src="ytEmbed(v.key)"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        />
      </div>
    </div>
  </div>
</template>
