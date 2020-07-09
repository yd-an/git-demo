import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home/home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/first',
    name: 'first',
    component: () => import('@/views/first/pages/A'),
    meta: {
      activeItem: '/first',
    },
  },
  {
    path: '/second',
    name: 'second',
    component: () => import('@/views/second/pages/A'),
    meta: {
      activeItem: '/second',
    },
  },
  {
    path: '/third',
    name: 'third',
    component: () => import('@/views/third/pages/A'),
    meta: {
      activeItem: '/third',
    },
  },
];

const router = new VueRouter({
  routes,
});

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default router;
