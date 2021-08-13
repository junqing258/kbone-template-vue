import { reactive, readonly } from '@vue/composition-api';

const state = reactive({
  message: 'Hello!',
});

export const sharedState = readonly(state);

export const actions = {
  setMessageAction(newValue: string) {
    state.message = newValue;
  },
  clearMessageAction() {
    state.message = '';
  },
};
