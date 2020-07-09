export const getCookie = (name) => {
  let arr;
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  if (arr === document.cookie.match(reg)) {
    return unescape(arr[2]);
  }
  return null;
};
export const setCookie = (name, value, time) => {
  const date = new Date(); // 获取当前时间
  const expiresDays = time; // 将date设置为n天以后的时间
  let domain = window.location.host;
  if (domain.indexOf(':') !== -1) {
    domain = domain.substring(0, domain.indexOf(':'));
  }
  date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); // 格式化为cookie识别的时间
  document.cookie = `${name}=${value};expires=${date.toGMTString()};Domain=.jdfcloud.com;path=/`; // 设置cookie
};
export const delCookie = (name) => {
  const exp = new Date();
  let domain = window.location.host;
  if (domain.indexOf(':') !== -1) {
    domain = domain.substring(0, domain.indexOf(':'));
  }
  exp.setTime(exp.getTime() - 10000);
  const cval = getCookie(name);
  if (cval != null) {
    document.cookie = `${name}=${cval};expires=${exp.toGMTString()};Domain=.jdfcloud.com;path=/`;
  }
};
export const getLSItem = (key) => {
  if (key === undefined) return null;
  let result = window.localStorage.getItem(key);
  try {
    result = JSON.parse(result);
  } catch (e) {
    console.warn('er---', e);
  }
  return result;
};
export const setLSItem = (key, item) => {
  if (key === undefined || item === undefined) return;
  if (typeof item === 'object') {
    item = JSON.stringify(item);
  }
  window.localStorage.setItem(key, item);
};
export const removeLSItem = (key) => {
  if (key === undefined) return;
  window.localStorage.removeItem(key);
};
export const getUrl = (name) => {
  const reg = new RegExp(`(^|[&?]{1})${name}=([^&]*)(|$)`, 'i');
  const j = window.location.href;
  let r = null;
  if (j.split('?')[1]) {
    r = j.split('?')[1].match(reg);
  }
  if (r != null) return decodeURIComponent(r[2]).replace(/[~'!<>]/g, '');
  return null;
};
export const getArrayObj = (arr, key, val) => {
  const json = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      json.val = arr[i];
      json.index = i;
      return json;
    }
  }
  return false;
};
export const getArrayObjDb = (arr, key1, val1, key2, val2) => {
  const json = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key1] === val1 && arr[i][key2] === val2) {
      json.val = arr[i];
      json.index = i;
      return json;
    }
  }
  return false;
};
export const debounce = (func, wait, immediate, ...args) => {
  let timeout;
  return () => {
    const context = this;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
export const addClass = (element, className) => {
  if (!element) {
    return;
  }
  let arr = [];
  if (Array.isArray(element) || element.length !== undefined) {
    arr = Array.prototype.slice.call(element);
  } else {
    arr = [element];
  }
  arr.forEach((x) => {
    x.classList.add(...className.split(' '));
  });
};
export const removeClass = (element, className) => {
  if (!element) {
    return;
  }
  let arr = [];
  if (Array.isArray(element) || element.length !== undefined) {
    arr = Array.prototype.slice.call(element);
  } else {
    arr = [element];
  }
  if (className) {
    arr.forEach((x) => {
      x.classList.remove(...className.split(' '));
    });
  } else {
    arr.forEach((x) => {
      x.classList = [];
    });
  }
};
export const formatDate = (date, fmt) => {
  if (typeof date === 'string' || typeof date === 'number') {
    const { userAgent } = window.navigator;
    if (
      (userAgent.indexOf('Safari') !== -1
        && userAgent.indexOf('Chrome') === -1)
      || userAgent.indexOf('MSIE') !== -1
      || userAgent.indexOf('Edge') !== -1
      || userAgent.indexOf('Trident') !== -1
    ) {
      if (date.indexOf('T') !== -1) {
        const arr = date.split('T');
        const day = arr[0];
        const timeArr = arr[1].split('.000');
        const time = timeArr[0];
        const result = `${day} ${time}`;
        date = new Date(result.replace(/-/g, '/'));
      } else {
        date = new Date(date.replace(/-/g, '/'));
      }
    } else {
      date = new Date(date);
    }
  }
  if (!fmt) fmt = 'yyyy-MM-dd hh:mm:ss';

  if (!date || date == null) return null;
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length),
    );
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
      );
    }
  }
  return fmt;
};
