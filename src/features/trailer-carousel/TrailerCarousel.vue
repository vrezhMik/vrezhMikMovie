<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import ObjectPoolCarousel from "@/features/carousel/ObjectPoolCarousel.vue";
import type { TmdbVideo } from "@/shared/api/tmdb";

const props = withDefaults(
  defineProps<{
    videos: ReadonlyArray<TmdbVideo>;
    title?: string;
    autoplay?: boolean;
    intervalMs?: number;
  }>(),
  {
    title: "Trailers & Videos",
    autoplay: false,
    intervalMs: 3500,
  }
);

const ITEM_W = 288;
const GAP = 16;

const filtered = computed(() =>
  (props.videos ?? []).filter((v) => v.site === "YouTube" && v.key)
);

const root = ref<HTMLElement | null>(null);
const visible = ref(3);
let ro: ResizeObserver | null = null;

function recalcVisible(w: number) {
  const per = Math.max(1, Math.floor((w + GAP) / (ITEM_W + GAP)));
  visible.value = per;
}

onMounted(() => {
  if (!root.value) return;
  recalcVisible(root.value.clientWidth);
  ro = new ResizeObserver((entries) => {
    for (const e of entries) recalcVisible(e.contentRect.width);
  });
  ro.observe(root.value);
});
onBeforeUnmount(() => {
  if (ro && root.value) ro.unobserve(root.value);
  ro = null;
});

const playingId = ref<string | null>(null);
function play(id: string) {
  playingId.value = id;
}
function stop() {
  playingId.value = null;
}
function isPlaying(id: string) {
  return playingId.value === id;
}

function ytThumb(key?: string) {
  return key ? `https://img.youtube.com/vi/${key}/hqdefault.jpg` : "";
}
function ytEmbed(key?: string) {
  return key ? `https://www.youtube.com/embed/${key}?autoplay=1&rel=0` : "";
}
</script>

<template>
  <div ref="root">
    <ObjectPoolCarousel
      :items="filtered"
      :visible="visible"
      :gap-px="16"
      :item-width-px="288"
      :loop="filtered.length > visible"
      :title="title"
      :autoplay="autoplay"
      :interval-ms="intervalMs"
      :pause-on-hover="true"
      @shift="stop"
    >
      <template #item="{ item }">
        <div
          class="group relative w-72 h-40 rounded-xl overflow-hidden bg-muted transition-all duration-300 hover:shadow-xl hover:shadow-primary/20"
        >
          <template v-if="!isPlaying(item.id)">
            <img
              :alt="item.name"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              :src="ytThumb(item.key)"
              loading="lazy"
            />
            <button
              class="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors duration-300"
              :aria-label="`Play ${item.name}`"
              @click="play(item.id)"
            >
              <div
                class="w-16 h-16 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-8 w-8 text-primary-foreground ml-1"
                >
                  <path
                    d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"
                  />
                </svg>
              </div>
            </button>

            <div
              class="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
            >
              <p class="text-foreground text-sm font-medium line-clamp-2">
                {{ item.name }}
              </p>
              <p class="text-muted-foreground text-xs mt-1">
                {{ item.type }}
              </p>
            </div>
          </template>

          <iframe
            v-else
            class="absolute inset-0 w-full h-full rounded-xl"
            :src="ytEmbed(item.key)"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
      </template>
    </ObjectPoolCarousel>
  </div>
</template>
