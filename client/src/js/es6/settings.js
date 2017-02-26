let httpApiHost = 'http://127.0.0.1:8088/api';

const SETTINGS = {
  api: {
    http: {
      baseUrl: httpApiHost,
      stateUrl: httpApiHost + '/state/',
      tokenGetUrl: httpApiHost + '/token/get/'
    }
  }
};

export {SETTINGS as default}

