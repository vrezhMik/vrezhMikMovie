<script setup lang="ts">
import { ref, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import SearchBarIcon from "@/components/icons/SearchBarIcon.vue";
import { useSearchQuery } from "@/shared/search/useSearch";

const isFocused = ref(false);
const isHovered = ref(false);
const input = ref("");

const globalQuery = useSearchQuery();

const MAX_LEN = 80;

const SAFE = /[\p{L}\p{N}\s:'\-.,!&()]/u;

function sanitize(raw: string): string {
  let v = raw.normalize?.("NFC") ?? raw;

  v = Array.from(v)
    .filter((ch) => SAFE.test(ch))
    .join("");

  v = v.replace(/\s+/g, " ").trim();

  if (v.length > MAX_LEN) v = v.slice(0, MAX_LEN);

  return v;
}

watch(globalQuery, (v) => {
  const s = sanitize(v ?? "");
  if (s !== input.value) input.value = s;
});

const pushDebounced = useDebounceFn((v: string) => {
  const s = sanitize(v);

  globalQuery.value = s;
}, 400);

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  const s = sanitize(target.value);
  if (s !== input.value) input.value = s;
  pushDebounced(s);
}

function clearSearch() {
  input.value = "";
  pushDebounced("");
}
</script>

<template>
  <div class="relative w-full">
    <SearchBarIcon
      :class="[
        'absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300',
        isFocused || isHovered ? 'text-primary' : 'text-muted-foreground',
      ]"
      aria-hidden="true"
    />
    <input
      :value="input"
      @input="onInput"
      class="flex w-full rounded-xl border border-input bg-card/40 backdrop-blur-sm px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 pl-12 pr-12 h-12 hover:cursor-pointer"
      placeholder="Search movies..."
      type="search"
      inputmode="search"
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
      maxlength="120"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      aria-label="Search movies"
    />
    <button
      v-if="input"
      class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      @click="clearSearch"
      aria-label="Clear search"
      type="button"
    >
      ✕
    </button>
  </div>
</template>
<style>
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
  appearance: none;
  display: none;
}
</style>
