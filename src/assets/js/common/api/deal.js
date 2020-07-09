import { Message } from 'element-ui';
import router from '@/router';

const logOut = (rspData) => {
  window.location.href = `${rspData + window.location.host}`;
};

// 接口正常状态处理方法
export const handleResponse = (res, msg) => {
  /**
   * msg 如果是 true 则使用默认值回显，如果传入字符串则视为DIY话术
   */
  msg
    && Message({
      message: typeof msg === 'boolean' ? res.data.rspMsg || '操作成功！' : `${msg}成功！`,
      type: 'success',
      duration: 3000,
    });
  return res.data;
};

// 接口异常状态处理方法
export const handleError = (error, msg) => {
  if (error.response) {
    const { status } = error.response;
    switch (status) {
      case 404:
        Message.error('404 接口地址无效');
        break;
      default:
        Message.error(error.toString());
    }
  } else {
    // 后台返回异常rspCode处理
    const errorRes = error.data || {};
    const code = errorRes.rspCode;
    switch (true) {
      case code === '000000002':
        // 未登录
        logOut(errorRes.rspData);
        break;
      case code === '000000003':
        // 没权限
        router.replace('/noLimit');
        break;
      default:
        Message({
          message: errorRes.rspMsg || (msg && `${msg}失败`) || '操作失败',
          type: 'warning',
          duration: 5 * 1000,
        });
    }
    return errorRes;
  }
  return null;
};
