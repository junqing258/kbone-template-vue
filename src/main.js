import Vue from 'vue';
import VueCompositionAPI from '@vue/composition-api';
import App from './App.vue';
import router from './router';
import store from './store';
import { Skeleton } from 'vant';

Vue.config.productionTip = false;

Vue.use(VueCompositionAPI);
Vue.use(Skeleton);

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
