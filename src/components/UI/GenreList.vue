<script setup lang="ts">
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

function isChecked(id: number) {
  return props.selectedIds.includes(id);
}
</script>

<template>
  <fieldset class="space-y-4">
    <legend class="flex items-center justify-between mb-4">
      <span class="text-lg font-semibold text-foreground">Genres</span>
    </legend>

    <div v-if="loading" class="space-y-2">
      <div v-for="n in 10" :key="n" class="h-10 rounded-lg skeleton-shimmer" />
    </div>

    <p v-else-if="error" class="text-danger text-sm">{{ error }}</p>

    <div
      v-else
      class="space-y-2 overflow-y-auto custom-scrollbar pr-2"
      style="max-height: calc(100vh - 12rem)"
    >
      <label
        v-for="g in genres"
        :key="g.id"
        class="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-300 bg-card border border-transparent hover:bg-card-hover"
      >
        <input
          class="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
          type="checkbox"
          :checked="isChecked(g.id)"
          @change="emit('toggle', g.id)"
        />
        <span class="text-sm font-medium text-foreground">{{ g.name }}</span>
      </label>
    </div>
  </fieldset>
</template>
