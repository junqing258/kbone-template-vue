/*
 * @Author: junqing.zhang
 * @Date: 2021-08-07 11:31:31
 * @LastEditors: junqing.zhang
 * @LastEditTime: 2021-08-07 17:24:59
 * @Description:
 */
import Vue from 'vue';
import Router from 'vue-router';
import App from '@/App.vue';
import store from '@/store';
import List from '@/pages/list/Index.vue';
import Detail from '@/pages/detail/Index.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/list/:id',
      name: 'List',
      component: List,
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: Detail,
    },
  ],
});

export default function createApp() {
  const container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);

  Vue.config.productionTip = false;

  return new Vue({
    el: '#app',
    router,
    store,
    render: (h) => h(App),
  });
}
