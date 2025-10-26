<script setup lang="ts">
import { ref } from "vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import type { TmdbGenre } from "@/shared/api/tmdb";

const props = defineProps<{
  genres: TmdbGenre[];
  selectedIds: number[];
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "toggle", id: number): void;
}>();

const isOpen = ref(false);

function isSelected(id: number) {
  return props.selectedIds.includes(id);
}
</script>

<template>
  <button
    class="flex items-center justify-between w-full p-4 rounded-xl bg-card/40 backdrop-blur-sm border border-white/10 text-foreground hover:bg-card-hover transition-all duration-300"
    @click="isOpen = !isOpen"
  >
    <span class="font-medium">Genres</span>
    <ArrowIcon :class="isOpen ? 'rotate-180' : ''" />
  </button>

  <div
    v-if="isOpen"
    class="mt-2 p-4 rounded-xl bg-card/40 backdrop-blur-sm border border-white/10 space-y-3"
  >
    <div v-if="loading" class="flex flex-wrap gap-2">
      <div
        v-for="n in 10"
        :key="n"
        class="h-6 w-20 rounded-full skeleton-shimmer"
      />
    </div>

    <p v-else-if="error" class="text-danger text-sm">{{ error }}</p>

    <div v-else class="flex flex-wrap gap-2">
      <button
        v-for="g in props.genres"
        :key="g.id"
        type="button"
        class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border transition-all duration-300 hover:scale-105"
        :class="
          isSelected(g.id)
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-muted/40 text-muted-foreground border-muted/50'
        "
        @click="emit('toggle', g.id)"
      >
        {{ g.name }}
      </button>
    </div>
  </div>
</template>
