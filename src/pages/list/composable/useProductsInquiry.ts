import { reactive, readonly, toRefs, onMounted, onBeforeUnmount } from '@vue/composition-api';

export function useProductsInquiry() {
  const state = reactive({
    products: [],
    carTypes: [],
  });

  const actions = {
    refreshCarList() {
      setTimeout(() => {
        state.carTypes = new Array(7).fill(0).map((_, i) => ({ id: i + 1, value: (Math.random() * 1000) | 0 }));
        state.products = new Array(30).fill(0).map((_, i) => ({ id: i + 1, value: (Math.random() * 1000) | 0 }));
      }, 1000);
    },
    switchSelectedCarType(id, bool) {
      const item = state.products.find((v) => v.id === id);
      if (item) item.selected = bool;
    },
  };

  let timer;
  onMounted(() => {
    timer = setInterval(actions.refreshCarList, 3000);
  });

  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  return {
    ...toRefs(readonly(state)),
    ...actions,
  };
}
