import Vue from 'vue';

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/index.css';

import echarts from 'echarts';

import Table from '@/components/plugins/table';
import Search from '@/components/plugins/search';

import App from './App.vue';
import router from './router';
import store from './store';

import '@/assets/css/index.scss';
import plugin from './assets/js/common/plugin';

Vue.prototype.$echarts = echarts;
Vue.use(ElementUI);
Vue.use(Table);
Vue.use(Search);
Vue.use(plugin);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
