<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { getMovieGenres, type TmdbGenre } from "@/shared/api/tmdb";
import GenreList from "@/components/UI/GenreList.vue";
import GenreMobileView from "@/components/UI/GenreMobileView.vue";

const props = withDefaults(
  defineProps<{
    modelValue?: number[];
    language?: string;
  }>(),
  {
    modelValue: () => [],
    language: "en-US",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: number[]): void;
}>();

const genres = ref<TmdbGenre[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const selected = ref<Set<number>>(new Set(props.modelValue));
const selectedIds = computed(() => Array.from(selected.value));

function toggle(id: number) {
  if (selected.value.has(id)) selected.value.delete(id);
  else selected.value.add(id);
  emit("update:modelValue", selectedIds.value);
}

onMounted(async () => {
  try {
    loading.value = true;
    error.value = null;
    const res = await getMovieGenres(props.language);
    genres.value = (res.genres ?? []).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } catch (e: any) {
    error.value = e?.message ?? "Failed to load genres";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <aside class="lg:w-64 flex-shrink-0">
    <div class="lg:sticky lg:top-24">
      <div data-testid="genre-filter" class="w-full">
        <div class="hidden lg:block">
          <GenreList
            :genres="genres"
            :selected-ids="selectedIds"
            :loading="loading"
            :error="error"
            @toggle="toggle"
          />
        </div>
        <div class="lg:hidden">
          <GenreMobileView
            :genres="genres"
            :selected-ids="selectedIds"
            :loading="loading"
            :error="error"
            @toggle="toggle"
          />
        </div>
      </div>
    </div>
  </aside>
</template>
