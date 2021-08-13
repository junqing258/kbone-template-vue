/*
 * @Author: junqing.zhang
 * @Date: 2021-08-07 11:31:31
 * @LastEditors: junqing.zhang
 * @LastEditTime: 2021-08-07 17:22:19
 * @Description:
 */
import Vue from 'vue';
import Router from 'vue-router';
import App from '@/App.vue';
import store from '@/store';
import Home from '@/pages/home/Index.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/(home|index)?',
      name: 'Home',
      component: Home,
    },
    {
      path: '/index.html',
      name: 'HomeHtml',
      component: Home,
    },
    // {
    //   path: "/list",
    //   name: "List",
    //   component: List,
    // },
  ],
});

export default function createApp(): Vue {
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
