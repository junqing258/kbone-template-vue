import Vue from 'vue';
import Router from 'vue-router';

const Home = () => import(/* webpackChunkName: "Home" */ '@/pages/home/Index.vue');
const List = () => import(/* webpackChunkName: "List" */ '@/pages/list/Index.vue');
const Detail = () => import(/* webpackChunkName: "Detail" */ '@/pages/detail/Index.vue');

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/(home|index)?',
      name: 'Home',
      component: Home,
    },
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
