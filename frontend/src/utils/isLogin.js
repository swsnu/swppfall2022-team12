const isLogin = () => {
  return !!window.sessionStorage.getItem('access');
};

export default isLogin;
