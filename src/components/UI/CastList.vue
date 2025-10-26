<script setup lang="ts">
const props = defineProps<{
  items: ReadonlyArray<{
    id: number;
    name: string;
    character?: string;
    profile_path?: string | null;
    order?: number;
  }>;
}>();

function profileUrl(path?: string | null) {
  return path
    ? `https://image.tmdb.org/t/p/w342${path}`
    : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop";
}
</script>

<template>
  <div
    v-if="props.items && props.items.length"
    class="flex gap-4 overflow-x-auto custom-scrollbar pb-4 snap-x snap-mandatory"
  >
    <div
      v-for="{ id, name, character, profile_path } in props.items"
      :key="id"
      class="flex-shrink-0 w-32 snap-start group cursor-pointer"
    >
      <div
        class="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3 shadow-md group-hover:shadow-xl transition-shadow duration-300"
      >
        <img
          :alt="name"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          :src="profileUrl(profile_path)"
        />
      </div>
      <h4 class="font-medium text-sm text-foreground line-clamp-2 mb-1">
        {{ name }}
      </h4>
      <p class="text-xs text-muted-foreground line-clamp-2">
        {{ character }}
      </p>
    </div>
  </div>
</template>
