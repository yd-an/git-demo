import { api } from './api/ajax';

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$api', {
      value: api,
    });
  },
};
