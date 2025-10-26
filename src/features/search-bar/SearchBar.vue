<script setup lang="ts">
import { ref } from "vue";
import SearchBarIcon from "@/components/icons/SearchBarIcon.vue";

const isFocused = ref(false);
const isHovered = ref(false);
</script>

<template>
  <div class="flex-1 max-w-xl hidden md:block">
    <div class="relative w-full">
      <div class="relative">
        <SearchBarIcon
          :class="[
            'absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 ',
            isFocused ? 'text-primary' : 'text-muted-foreground',
            isHovered ? 'text-primary' : 'text-muted-foreground',
          ]"
        />

        <input
          class="flex w-full rounded-xl border border-input bg-card/40 backdrop-blur-sm px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 pl-12 pr-12 h-12 hover:cursor-pointer"
          placeholder="Search movies..."
          type="text"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
        />

        <div
          class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
        ></div>
      </div>
    </div>
  </div>
</template>
