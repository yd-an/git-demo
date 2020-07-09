import axios from 'axios';
import { servers } from '@/assets/utils/envirooment';

axios.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});
axios.interceptors.response.use(response => {
  return response;
}, error => {
  return Promise.resolve(error);
});

const jaxios = {
  install(Vue) {
    Vue.prototype.jaxios = async (url, data, baseURL = servers.core, token = servers.token, subToken = servers.token) => {
      const defaultOptions = {
        method: 'post',
        baseURL,
        url: `${url}?token=${token}&sub_token=${subToken}`,
        withCredentials: true,
        timeout: 100000,
        data: JSON.stringify(data),
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json; charset=utf-8',
        },
      };
      const promise = new Promise((resolve, reject) => {
        axios(defaultOptions).then(
          (response) => {
            if (response && response.status === 401) {
              window.location.href = servers.login + window.location.href;
            } else if (response && response.status === 200) {
              resolve(response.data);
            } else {
              reject(response);
            }
          },
        ).catch(
          (response) => {
            if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
              reject(response);
            }
          },
        );
      });
      return promise;
    };

    Vue.prototype.jaxiosup = (url, data, baseURL = servers.core) => {
      const defaultOptions = { // http默认配置
        method: 'post',
        baseURL,
        url,
        withCredentials: true,
        timeout: 10000,
        data,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'multipart/form-data',
        },
      };
      const promise = new Promise((resolve, reject) => {
        axios(defaultOptions).then(
          (response) => {
            if (response && response.status === 401) {
              window.location.href = servers.login + window.location.href;
            } else {
              resolve(response.data);
            }
          },
        ).catch(
          (response) => {
            if (response && (response.status === 200 || response.status === 304 || response.status === 400)) {
              reject(response);
            }
          },
        );
      });
      return promise;
    };
  },
};

export default jaxios;
