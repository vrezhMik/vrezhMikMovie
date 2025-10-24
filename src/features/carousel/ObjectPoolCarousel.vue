<script setup lang="ts" generic="T">
import { computed, ref, watch } from "vue";

interface Props<T> {
  items: T[];
  visible?: number;
  gapPx?: number;
  itemWidthPx?: number;
  loop?: boolean;
  title?: string;
}
const props = withDefaults(defineProps<Props<T>>(), {
  visible: 4,
  gapPx: 16,
  itemWidthPx: 288,
  loop: true,
  title: "Carousel",
});

const strip = ref<HTMLDivElement | null>(null);
const animating = ref(false);
const dir = ref<0 | 1 | -1>(0);
const head = ref(0);
const step = computed(() => props.itemWidthPx + props.gapPx);

const poolSize = computed(() =>
  Math.min(props.items.length, props.visible + 2)
);

const slotToItemIndex = computed(() => {
  const out: number[] = [];
  const len = props.items.length || 1;
  for (let i = 0; i < poolSize.value; i++) {
    const idx = (head.value + i - 1 + len) % len;
    out.push(idx);
  }
  return out;
});

const transform = ref<string>("translateX(0)");
const transition = ref<string>("");

function resetTransform() {
  transition.value = "";
  transform.value = "translateX(0)";
  dir.value = 0;
}

function shift(by: 1 | -1) {
  if (animating.value || props.items.length <= 1) return;
  if (
    !props.loop &&
    ((by === 1 && head.value + props.visible >= props.items.length) ||
      (by === -1 && head.value <= 0))
  ) {
    return;
  }
  animating.value = true;
  dir.value = by;

  transition.value = "transform 300ms var(--transition-smooth)";
  transform.value = `translateX(${by === 1 ? -step.value : step.value}px)`;

  const el = strip.value;
  if (!el) {
    animating.value = false;
    resetTransform();
    return;
  }

  const onEnd = () => {
    el.removeEventListener("transitionend", onEnd);
    const len = props.items.length;
    head.value = (head.value + by + len) % len;

    resetTransform();
    animating.value = false;
  };
  el.addEventListener("transitionend", onEnd, { once: true });
}

function next() {
  shift(1);
}
function prev() {
  shift(-1);
}

watch(
  () => props.items.length,
  () => {
    animating.value = false;
    head.value = 0;
    resetTransform();
  }
);
</script>

<template>
  <section class="mb-12">
    <div class="flex items-center gap-3 mb-6" v-if="$slots.header || title">
      <slot name="header">
        <div class="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M16 7h6v6" />
            <path d="m22 7-8.5 8.5-5-5L2 17" />
          </svg>
        </div>
        <div>
          <h2 class="text-3xl font-display font-bold text-foreground">
            {{ title }}
          </h2>
          <p class="text-muted-foreground text-sm">
            Popular movies everyone is watching
          </p>
        </div>
      </slot>
    </div>

    <div class="relative group overflow-hidden">
      <div
        ref="strip"
        class="flex pb-4"
        :style="{
          gap: gapPx + 'px',
          transform,
          transition,
        }"
      >
        <div
          v-for="slot in poolSize"
          :key="slot"
          class="flex-shrink-0 w-72 snap-start"
        >
          <slot
            name="item"
            :item="items[slotToItemIndex[slot - 1]]"
            :index="slotToItemIndex[slot - 1]"
          />
        </div>
      </div>

      <button
        class="inline-flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transform-gpu text-foreground h-10 w-10 absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10"
        aria-label="Scroll left"
        @click="prev"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        class="inline-flex items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 transform-gpu text-foreground h-10 w-10 absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10"
        aria-label="Scroll right"
        @click="next"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </section>
</template>
