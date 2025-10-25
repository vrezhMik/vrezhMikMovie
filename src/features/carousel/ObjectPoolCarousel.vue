<script setup lang="ts" generic="T">
import { computed, ref, watch, onMounted } from "vue";
import SectionTitle from "../../components/UI/SectionTitle.vue";
import TrendingIcon from "../../components/icons/TrendingIcon.vue";
import SliderButtonIcon from "../../components/icons/SliderButtonIcon.vue";

const props = withDefaults(
  defineProps<{
    items: ReadonlyArray<T>;
    visible?: number;
    gapPx?: number;
    itemWidthPx?: number;
    loop?: boolean;
    title?: string;
  }>(),
  {
    visible: 4,
    gapPx: 16,
    itemWidthPx: 288,
    loop: true,
    title: "Carousel",
  }
);

const strip = ref<HTMLDivElement | null>(null);
const animating = ref(false);
const head = ref(0);

const step = computed(() => (props.itemWidthPx ?? 0) + (props.gapPx ?? 0));
/** Resting offset keeps the "viewport" centered between a 1-item buffer on both sides */
const baseOffset = computed(() => -step.value);

/** Pool = visible + 2 (1 buffer on each side) */
const poolSize = computed(() =>
  Math.min(props.items.length, (props.visible ?? 0) + 2)
);

/** Which real item index should each pooled slot show */
const visibleIndices = computed<number[]>(() => {
  const len = props.items.length;
  if (len === 0) return [];
  const count = poolSize.value;
  const out: number[] = new Array(count);
  for (let i = 0; i < count; i++) {
    // start from head-1 to include the left buffer
    out[i] = (head.value + i - 1 + len) % len;
  }
  return out;
});

const transform = ref("translateX(0px)");
const transition = ref("");

function resetTransform() {
  transition.value = "";
  transform.value = `translateX(${baseOffset.value}px)`;
}

onMounted(() => {
  resetTransform();
});

watch(step, () => {
  // If step changes (responsive), re-center the strip
  resetTransform();
});

function shift(by: 1 | -1) {
  if (animating.value || props.items.length <= 1) return;

  // Non-loop edges
  if (
    !props.loop &&
    ((by === 1 && head.value + (props.visible ?? 0) >= props.items.length) ||
      (by === -1 && head.value <= 0))
  ) {
    return;
  }

  animating.value = true;

  // Animate away from the resting "-step" position
  transition.value = "transform 350ms var(--transition-smooth)";
  transform.value =
    by === 1
      ? `translateX(${baseOffset.value - step.value}px)` // -step -> -2*step
      : `translateX(${baseOffset.value + step.value}px)`; // -step -> 0

  const el = strip.value;
  if (!el) {
    animating.value = false;
    resetTransform();
    return;
  }

  const onEnd = () => {
    el.removeEventListener("transitionend", onEnd);
    // Rotate head after motion
    const len = props.items.length;
    head.value = (head.value + by + len) % len;
    // Snap back to resting position without visible jump
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
        <SectionTitle
          :title="title"
          description="Popular movies everyone is watching"
          :icon="TrendingIcon"
          icon_style="bg-gradient-to-br from-primary to-accent"
        />
      </slot>
    </div>

    <div class="relative group overflow-hidden">
      <div
        ref="strip"
        data-carousel
        class="flex pb-4 will-change-transform transform-gpu"
        :style="{ gap: (gapPx ?? 0) + 'px', transform, transition }"
      >
        a
        <div
          v-for="(idx, slot) in visibleIndices"
          :key="slot"
          class="flex-shrink-0 w-72 snap-start"
        >
          <slot name="item" :item="(items[idx] as T)" :index="idx" />
        </div>
      </div>

      <button
        :disabled="animating"
        class="inline-flex items-center justify-center h-10 w-10 absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Scroll left"
        @click="prev"
      >
        <SliderButtonIcon />
      </button>
      <button
        :disabled="animating"
        class="inline-flex items-center justify-center h-10 w-10 absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/70 z-10 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Scroll right"
        @click="next"
      >
        <SliderButtonIcon class="rotate-180" />
      </button>
    </div>
  </section>
</template>

<style>
@media (prefers-reduced-motion: reduce) {
  [data-carousel] {
    transition: none !important;
  }
}
</style>
