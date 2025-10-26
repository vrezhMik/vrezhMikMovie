<script setup lang="ts">
import { computed, ref } from "vue";
import ArrowIcon from "@/components/icons/ArrowIcon.vue";
import CloseIcon from "@/components/icons/CloseIcon.vue";
import type { TmdbGenre } from "@/shared/api/tmdb";

const props = defineProps<{
  genres: TmdbGenre[];
  selectedIds: number[];
  loading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: "toggle", id: number): void;
  (e: "clear"): void;
}>();

const isOpen = ref(false);

const selectedCount = computed(() => props.selectedIds.length);
const hasSelection = computed(() => selectedCount.value > 0);

const selectedGenres = computed(() =>
  props.genres.filter((g) => props.selectedIds.includes(g.id))
);

function unselect(id: number) {
  emit("toggle", id);
}

const MAX_INLINE = 3;
</script>

<template>
  <button
    class="flex items-center justify-between w-full p-4 rounded-xl bg-card/40 backdrop-blur-sm border border-white/10 text-foreground hover:bg-card-hover transition-all duration-300"
    @click="isOpen = !isOpen"
  >
    <div class="min-h-[1.25rem] flex items-center gap-2 flex-1 overflow-hidden">
      <span v-if="!hasSelection" class="font-medium">Genres</span>

      <div v-else class="flex items-center gap-2 flex-wrap">
        <span
          v-for="g in selectedGenres.slice(0, MAX_INLINE)"
          :key="g.id"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border bg-primary/10 border-primary/30 text-primary"
        >
          {{ g.name }}
          <button
            class="p-0.5 rounded hover:bg-primary/20"
            aria-label="Remove filter"
            @click.stop="unselect(g.id)"
          >
            <CloseIcon class="w-3 h-3" />
          </button>
        </span>

        <span
          v-if="selectedCount > MAX_INLINE"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-card/60 border-white/10 text-muted-foreground"
        >
          +{{ selectedCount - MAX_INLINE }} more
        </span>
      </div>
    </div>

    <ArrowIcon :class="isOpen ? 'rotate-180' : ''" />
  </button>

  <div
    v-if="isOpen"
    class="mt-2 p-4 rounded-xl bg-card/40 backdrop-blur-sm border border-white/10 space-y-3"
  >
    <div
      v-if="hasSelection"
      class="flex items-center justify-between pb-3 border-b border-white/10"
    >
      <span class="text-sm text-muted-foreground">
        {{ selectedCount }} selected
      </span>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu text-foreground hover:bg-card-hover px-4 h-8 text-xs"
        @click.stop="emit('clear')"
      >
        Clear all
      </button>
    </div>

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
          props.selectedIds.includes(g.id)
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
