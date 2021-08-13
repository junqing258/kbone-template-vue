export default {
  FAKE_ACTION({ commit }, input): void {
    setTimeout(() => {
      commit('FAKE_MUTATION', input);
    }, 500);
  },
};
