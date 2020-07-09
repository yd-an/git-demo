const serversConfig = {
  dev: {
    core: 'http://test.yhgateway.jdfcloud.com:8082/asm/', // 后台服务
    logout: 'http://zdpoc-ssa.jdfcloud.com/sso/login?ReturnUrl=', // 退出登陆
  },
  test: {
    core: 'http://test.yhgateway.jdfcloud.com:8082/asm/',
    logout: 'http://zdpoc-ssa.jdfcloud.com/sso/login?ReturnUrl=',
  },
  prod: {
    core: 'http://zd-asm-server.jdfcloud.com/',
    logout: 'http://zdpoc-ssa.jdfcloud.com/sso/login?ReturnUrl=',
  },
};

const servers = serversConfig[process.env.NODE_ENV];

export default servers;
