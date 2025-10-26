<script setup lang="ts">
type CastPerson = {
  id: number;
  name: string;
  character?: string;
  profile_path?: string | null;
  order?: number;
};

const props = defineProps<{
  items: CastPerson[];
}>();
</script>

<template>
  <div style="display: contents">
    <div
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
            :src="
              profile_path
                ? `https://image.tmdb.org/t/p/w342${profile_path}`
                : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'
            "
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
  </div>
</template>
