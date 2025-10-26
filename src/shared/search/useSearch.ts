import { ref } from "vue";

const q = ref("");

export function useSearchQuery() {
    return q;
}
